import contextlib
import re
from bs4 import BeautifulSoup


def informationer(self):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/FindSkemaAdv.aspx"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    informationerDict = {}

    for section in soup.find_all("section", {"class": "island"}):
        sectionName = (
            section.find("span", {"class": "islandHeader"})
            .text.lower()
            .replace(" ", "_")
        )
        informationerDict[sectionName] = {}
        select = section.find("select")
        if select is not None:
            for option in select.find_all("option"):
                informationerDict[sectionName][option.text] = option.get("value")

    return informationerDict


def fåBruger(self, brugerId, hold_gruppe=True):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/contextcard/contextcard.aspx?lectiocontextcard={brugerId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    titel = soup.find("span").text

    bruger = {
        "navn": titel.split(" - ")[-1],
        "pictureid": None,
        "id": soup.find_all("a")[-1].get("href").split("=")[-1],
        "type": titel.split(" - ")[0].lower(),
    }

    with contextlib.suppress(AttributeError):
        bruger["pictureid"] = (
            re.search("pictureid=\d+", soup.find("img").get("src"))
            .group()
            .replace("pictureid=", "")
        )
    if bruger["type"] == "lærer":
        bruger["hold"] = {}
        for hold in soup.find("table", {"class": "textTop"}).find_all("a"):
            bruger["hold"][hold.text] = (
                re.search("holdelementid=\d+", hold.get("href"))
                .group()
                .replace("holdelementid=", "")
            )
    else:
        bruger["stamklasse"] = (
            soup.find("table", {"class": "textTop"}).find_all("td")[1].text
        )
    return bruger


def fåElev(self, elevId):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/SkemaNy.aspx?type=elev&elevid={elevId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    return {
        "navn": soup.find("div", {"class": "maintitle"})
        .text.replace("Eleven ", "")
        .replace(" - Skema", ""),
        "billede": soup.find(
            "img", {"id": "s_m_HeaderContent_picctrlthumbimage"}
        ).get("src"),
    }
