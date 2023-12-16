import re
import unicodedata
from bs4 import BeautifulSoup
import markdownify

from lectio.utils import generatePayload


def opgave(self, exerciseid):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/ElevAflevering.aspx?elevid={self.elevId}&exerciseid={exerciseid}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    opgaveDict = {
        "oplysninger": {
            "opgavetitel": None,
            "opgavebeskrivelse": None,
            "opgavenote": None,
            "hold": None,
            "karakterskala": None,
            "ansvarlig": None,
            "elevtid": None,
            "afleveringsfrist": None,
            "i_undervisningsbeskrivelse": None,
        },
        "gruppemedlemmer": [],
        "afleveres_af": {},
        "opgave_indlæg": [],
    }
    for tr in soup.find("table", {"class": "ls-std-table-inputlist"}).find_all("tr"):
        if (
            identifier := unicodedata.normalize("NFKD", tr.find("th").text)
            .lower()
            .replace(" ", "_")
            .replace(":", "")
        ) == "ansvarlig":
            opgaveDict["oplysninger"][identifier] = {
                "navn": unicodedata.normalize("NFKD", tr.find("td").text),
                "bruger_id": tr.find("span").get("data-lectiocontextcard"),
            }
        elif identifier == "opgavebeskrivelse":
            opgaveBeskrivelse = "".join(
                f'[{unicodedata.normalize("NFKD", a.text).lstrip().rstrip()}](https://www.lectio.dk{a.get("href")})\n  '
                for a in tr.find_all("a")
            )
            opgaveDict["oplysninger"][identifier] = opgaveBeskrivelse[:-1]
        else:
            opgaveDict["oplysninger"][identifier] = markdownify.markdownify(
                str(tr.find("td").text), bullets="-"
            )

    if soup.find_all("span", {"class": "islandHeader"})[1].text == "Gruppeaflevering":
        for tr in soup.find("table", {"class": "ls-table-layout1 lf-grid"}).find_all(
            "tr"
        )[1:]:
            opgaveDict["gruppemedlemmer"].append(
                {
                    "navn": unicodedata.normalize("NFKD", tr.text.lstrip().rstrip()),
                    "bruger_id": tr.find("span").get("data-lectiocontextcard"),
                }
            )

    header = soup.find(
        "table", {"class": "ls-table-layout1 maxW textTop lf-grid"}
    ).find_all("tr", {"class": ""})[0]
    headerIdentifiers = [
        th.text.lower().replace(" ", "_") for th in header.find_all("th")[1:]
    ]
    for tr in soup.find(
        "table", {"class": "ls-table-layout1 maxW textTop lf-grid"}
    ).find_all("tr")[1:]:
        for i, td in enumerate(tr.find_all("td")[1:]):
            if (identifier := headerIdentifiers[i]) == "afsluttet":
                opgaveDict["afleveres_af"][identifier] = (
                    td.find("input").get("checked") == "checked"
                )
            elif identifier == "elev":
                opgaveDict["afleveres_af"][identifier] = {
                    "navn": unicodedata.normalize("NFKD", td.text).lstrip().rstrip(),
                    "bruger_id": td.find_all("span")[1].get("data-lectiocontextcard"),
                }
            elif identifier == "status_-_frav\u00e6r":
                opgaveDict["afleveres_af"]["status_frav\u00e6r"] = (
                    unicodedata.normalize("NFKD", td.text).lstrip().rstrip()
                )

            else:
                opgaveDict["afleveres_af"][identifier] = (
                    unicodedata.normalize("NFKD", td.text).lstrip().rstrip()
                )
    indlægHtml = soup.find("table", {"id": "m_Content_RecipientGV"})
    indlægHeader = [
        header.text.lower().replace(" ", "_") for header in indlægHtml.find_all("th")
    ]

    for tr in indlægHtml.find_all("tr")[1:]:
        indlæg = {}
        for i, td in enumerate(tr.find_all("td")):
            if (identifier := indlægHeader[i]) == "dokument" and td.find(
                "a"
            ) is not None:
                indlæg[
                    identifier
                ] = f"[{td.text.lstrip().rstrip()}](https://www.lectio.dk{td.find('a').get('href')})"
            elif identifier == "bruger":
                indlæg[identifier] = {
                    "navn": td.text.lstrip().rstrip(),
                    "bruger_id": td.find("span").get("data-lectiocontextcard"),
                }
            else:
                indlæg[identifier] = td.text.lstrip().rstrip()
        opgaveDict["opgave_indlæg"].append(indlæg)

    return opgaveDict


def opgaver(self):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/OpgaverElev.aspx?elevid={self.elevId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    if (
        str(
            soup.find(
                "input", {"id": "s_m_Content_Content_CurrentExerciseFilterCB"}
            ).get("checked")
        )
        == "checked"
    ):
        resp = self.session.post(
            f"https://www.lectio.dk/lectio/{self.skoleId}/OpgaverElev.aspx?elevid={self.elevId}",
            data=generatePayload(soup, "s$m$Content$Content$CurrentExerciseFilterCB"),
        )
        soup = BeautifulSoup(resp.text, "html.parser")

    opgaver = []
    _header = soup.find("tr")
    header = [th.text.lower().replace("\xad", "-") for th in _header.find_all("th")]
    for opgave in soup.find_all("tr")[1:]:
        opgaveDict = {}

        for i, td in enumerate(opgave.find_all("td")):
            if header[i] == "opgavetitel":
                opgaveDict["exerciseid"] = re.findall(
                    "exerciseid=\d+", td.find("a", href=True).get("href")
                )[0].replace("exerciseid=", "")

            opgaveDict[header[i]] = td.text.lstrip()
        if opgaveDict["afventer"] == "":
            opgaveDict["status"] = "Afsluttet"
        opgaveDict["status"] = (
            opgaveDict["status"].split("\r\n\t\t\t\t\t\t\t")[0].strip()
        )
        opgaver.append(opgaveDict)

    return opgaver


def afleverOpgave(self, exerciseid, file=None, note=None):
    pass
