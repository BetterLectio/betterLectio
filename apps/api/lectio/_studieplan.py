import contextlib
import re
from bs4 import BeautifulSoup


def studieplan(self):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/studieplan.aspx?displaytype=ugeteksttabel&elevid={self.elevId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    studieplanList = []
    table = soup.find("table", {"id": "s_m_Content_Content_spUge_theTable"})
    colEnd = 0
    alleFagsIndhold = table.find_all("td")[2:-2]
    for header in table.find("tr").find_all("th")[2:-2]:
        colStart = colEnd
        try:
            colEnd += int(header.get("colspan")) - 1
        except Exception:
            colEnd += 1

        fag = {
            "fag": header.text.strip(),
            "fag_id": header.find("a").get("data-lectiocontextcard"),
            "kalender": [],
        }

        for fagIndhold in alleFagsIndhold[colStart:colEnd]:
            for forløb in fagIndhold.find_all("div", {"class": "phase"}):
                forløbBoks = forløb.find("a")
                forløbBoksInfo = forløbBoks.get("data-tooltip")
                forløbDict = {
                    "titel": forløbBoks.text,
                    "estimat": re.search("Estimat: [^\n]+", forløbBoksInfo)
                    .group()
                    .replace("Estimat: ", ""),
                    "periode": re.search("Periode: [^\n]+", forløbBoksInfo)
                    .group()
                    .replace("Periode: ", ""),
                    "id": forløbBoks.get("data-lectiocontextcard"),
                    "top": int(
                        re.search("top:\w+", forløb.get("style"))
                        .group()
                        .replace("top:", "")
                        .replace("px", "")
                    ),
                }
                forløbDict["beskrivelse"] = forløbBoksInfo.replace(
                    f"Titel: {forløbDict['titel']}\nEstimat: {forløbDict['estimat']}\nPeriode: {forløbDict['periode']}",
                    "",
                ).strip()
                fag["kalender"].append(forløbDict)

        fag["kalender"] = sorted(fag["kalender"], key=lambda forløb: forløb["top"])
        studieplanList.append(fag)

        colEnd += 1

    return studieplanList


def forløb(self, id):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/studieplan/forloeb_vis.aspx?phaseid={id[2:]}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    oversigt = soup.find("div", {"class": "ls-phase-activity", "id": "overview"}).find(
        "table"
    )
    forløbDict = {
        "titel": soup.find(
            "div", {"class": "ls-paper-section-heading ls-section-title-heading"}
        ).text
    }
    for row in oversigt:
        with contextlib.suppress(AttributeError):
            key = row.find("th").text.strip().replace(" ", "_").lower()[:-1]
            value = row.find("td")
            if value.find("table") is None:
                forløbDict[key] = value.text.strip().replace(
                    "\r\n\t\t\t\t\t\t\t—\r\n\t\t\t\t\t\t\t", " - "
                )
    return forløbDict
