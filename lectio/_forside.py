import contextlib
import copy
import re
from bs4 import BeautifulSoup
import markdownify

from lectio.utils import skemaBrikExtract


colorDict = {
    "prio1.auto": "rød",
    "prio2.auto": "gul",
    "prio3.auto": "grå",
    "prio4.auto": "grøn",
}


def forside(self):
    url = (
        f"https://www.lectio.dk/lectio/{self.skoleId}/forside.aspx?elevid={self.elevId}"
    )
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    forsideDict = {
        "aktuelt": [],
        "kommunikation": {"beskeder": [], "dokumenter": []},
        "undervisning": {},
        "skema": [],
        "eksamener": [],
        "hold_og_grupper": {"hold": {}},
    }

    forsideDict["overskrift"] = soup.find("div", {"id": "s_m_HeaderContent_MainTitle"}).text

    with contextlib.suppress(Exception):
        for tr in soup.find(
            "div", {"id": "s_m_Content_Content_aktueltIsland_pa"}
        ).find_all("tr", {"class": "DashWithScroll textTop"}):
            content = tr.find("td", {"class": "infoCol"}).find("span")
            contentStr = str(content)
            for span in content.find_all("span", {"class": "bb_b"}):
                new = copy.copy(span)
                new.name = "strong"
                contentStr = contentStr.replace(str(span), str(new))

            forsideDict["aktuelt"].append(
                {
                    # "punkt_farve": colorDict[
                    #     tr.find("td", {"class": "iconCol"})
                    #     .find("img")
                    #     .get("src")
                    #     .split("/")[-1]
                    # ],
                    "punkt_farve": "grå",
                    "text": markdownify.markdownify(contentStr, heading_style="ATX")
                    .lstrip()
                    .rstrip()
                    .replace("\n\n", "\n"),  # HTML til markdown det
                }
            )
    with contextlib.suppress(Exception):
        kommunikation = soup.find("div", {"id": "s_m_Content_Content_kommIsland_pa"})
        for id, type in [
            ["s_m_Content_Content_BeskederInfo", "beskeder"],
            ["s_m_Content_Content_DokumenterInfo", "dokumenter"],
        ]:
            for tr in kommunikation.find("table", {"id": id}).find_all("tr"):
                tds = tr.find_all("td")
                with contextlib.suppress(IndexError):
                    forsideDict["kommunikation"][type].append(
                        {
                            "navn": tds[1].text,
                            "afsender": tds[2].find("span").get("title"),
                            "dato": tds[3].get("title"),
                            "id": re.search("id=\d+", str(tds[1].find("a").get("href")))
                            .group()
                            .replace("id=", ""),
                        }
                    )
    with contextlib.suppress(Exception):
        undervisning = soup.find(
            "div", {"id": "s_m_Content_Content_undervisningIsland_pa"}
        )
        headings = undervisning.find_all("div", {"role": "heading"})
        tables = undervisning.find_all("table")

        for i in range(len(headings)):
            navn = (
                headings[i]
                .find("span", {"class": "dashboardLinkHeaderText"})
                .text.lower()
                .replace(" ", "_")
            )
            forsideDict["undervisning"][navn] = []
            for tr in tables[i].find_all("tr"):
                tds = tr.find_all("td")
                with contextlib.suppress(IndexError):
                    forsideDict["undervisning"][navn].append(
                        {
                            "navn": tds[1].text,
                            "dato": tds[2].get("title"),
                            "id": re.findall("exerciseid=(\d+)", str(tds[1].find("a").get("href")))[0] if navn == "opgaveaflevering" else re.findall("id=(\d+)", str(tds[1].find("a").get("href")))[0],
                            "punkt_farve": colorDict[
                                tds[0].find("img").get("src").split("/")[-1]
                            ],
                        }
                    )
                    print(forsideDict["undervisning"][navn][-1])
    for element in soup.find(
        "div", {"id": "s_m_Content_Content_skemaIsland_pa"}
    ).find_all("div"):
        if element.get("role") == "heading":
            forsideDict["skema"].append(
                skemaBrikExtract(element.find("a", {"class": "s2skemabrik"}))
            )

    with contextlib.suppress(Exception):
        eksamener_table = soup.find(
            "table", {"id": "s_m_Content_Content_EksamenerInfo"}
        )
        for row in eksamener_table.find_all("tr"):
            tds = row.find_all("td")
            forsideDict["eksamener"].append(
                {
                    "navn": tds[1].text,
                    "link": "https://www.lectio.dk" + tds[1].find("a").get("href"),
                    "dato": tds[1].get("title").split("\n\n")[0].split("\n")[1],
                    "punkt_farve": colorDict[
                        tds[0].find("img").get("src").split("/")[-1]
                    ],
                }
            )
    with contextlib.suppress(Exception):
        hold_og_grupper = soup.find_all("ul", {"class": "entitylinklistH"})
        hold = hold_og_grupper[0]
        for li in hold.find_all("li"):
            forsideDict["hold_og_grupper"]["hold"][li.find("a").text] = (
                "HE" + re.findall("id=(\d+)", li.find("a").get("href"))[0]
            )

    return forsideDict
