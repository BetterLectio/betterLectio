import contextlib
from bs4 import BeautifulSoup
import markdownify

from lectio.utils import skemaBrikExtract


def modul(self, absid):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/aktivitet/aktivitetforside2.aspx?absid={absid}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    modulDetaljer = {
        "aktivitet": None,
        "note": "",
        "lektier": "",
        "præsentation": "",
        "grupper": {},
        "øvrigtIndhold": "",
    }

    with contextlib.suppress(Exception):
        modulDetaljer["note"] = markdownify.markdownify(
            str(
                soup.find(
                    "textarea", {"id": "s_m_Content_Content_tocAndToolbar_ActNoteTB_tb"}
                )
            ).replace("\r\n", "\n\n"),
            bullets="-",
        )
    modulContent = soup.find(
        "div", {"id": "s_m_Content_Content_tocAndToolbar_inlineHomeworkDiv"}
    )
    last = ""
    for div in modulContent.find_all("div"):
        if div.get("id") is None:
            if (
                divText := div.text.lstrip().rstrip()
            ) != "" and divText != "Vis fuld skærm":
                last = divText.lower().title().replace(" ", "")
                last = last[0].lower() + last[1:]
        else:
            article = div.find("article")
            if (
                article
                and article.find("h1") is not None
                and article.find("h1").text == "Groups"
            ):
                groupNames = list(map(lambda x: x.text, article.find_all("p")))
                groupParticipants = article.find_all("ul")
                for i, group in enumerate(groupNames):
                    modulDetaljer["grupper"][group] = list(
                        map(lambda x: x.text, groupParticipants[i].find_all("li"))
                    )
            elif article:
                for child in article.find_all(recursive=False):
                    if child.name == "h1":
                        child.name = "h3"
                    elif child.name == "h2":
                        child.name = "h4"
                    modulDetaljer[last] += markdownify.markdownify(
                        str(child), bullets="-"
                    )
            elif last == "præsentation" and (
                anchor := div.find("a", attrs={"data-lc-display-linktype": "file"})
            ):
                if modulDetaljer[last] != f"[{anchor.text}]({anchor.get('href')})":
                    modulDetaljer[last] += f"[{anchor.text}]({anchor.get('href')})"
            else:
                modulDetaljer[last] += markdownify.markdownify(str(div), bullets="-")

    modulDetaljer["aktivitet"] = skemaBrikExtract(soup.find("a", class_="s2skemabrik"))

    return modulDetaljer


def elevFeedback():
    pass
