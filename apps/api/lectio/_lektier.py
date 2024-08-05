import unicodedata
from bs4 import BeautifulSoup

from lectio.utils import skemaBrikExtract


def lektier(self):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/material_lektieoversigt.aspx?elevid={self.elevId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")

    soup = BeautifulSoup(resp.text, "html.parser")

    lektier = []

    for tr in soup.find_all("tr")[1:]:
        lektie = {"aktivitet": {}, "lektier": ""}
        for i, td in enumerate(tr.find_all("td")[:3]):
            if i == 1:
                modul = td.find("a", class_="s2skemabrik")
                modulDict = skemaBrikExtract(modul)
                lektie["aktivitet"] = modulDict
            elif i == 2:
                for element in (
                    str(td)
                    .replace("\xa0", "\n")
                    .replace("<br/>", "\n")
                    .replace("</a>", "</a>\n")
                    .split("\n")
                ):
                    elementSoup = BeautifulSoup(element, "html.parser")
                    if elementSoup.text != "":
                        if (
                            elementWithHref := elementSoup.find("a", href=True)
                        ) is not None:
                            href = elementWithHref.get("href")
                            if href.startswith(f"/lectio/{self.skoleId}"):
                                href = f"https://www.lectio.dk{href}"
                            lektie["lektier"] += unicodedata.normalize(
                                "NFKD",
                                f"[{elementSoup.text.rstrip().lstrip()}]({href})\n",
                            )
                        else:
                            lektie["lektier"] += unicodedata.normalize(
                                "NFKD",
                                elementSoup.text.rstrip().lstrip().replace("\xa0", " ")
                                + "\n",
                            )

        lektier.append(lektie)

    return lektier
