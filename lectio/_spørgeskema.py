import re
from bs4 import BeautifulSoup
import urllib

from lectio.utils import generatePayload


def spørgeskemaer(self):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/spoergeskema/spoergeskema_rapport.aspx?type=mine&elevid={self.elevId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    table = soup.find(
        "table", {"id": "s_m_Content_Content_SpørgeskemaerÅbneForSvarGV"}
    ).find_all("tr")

    headers = [th.text.lower() for th in table[0].find_all("th")]
    spørgeskemaerDict = {"åbne_for_besvarelse": [], "åbne_for_rapportering": []}
    for tr in table[1:]:
        spørgeskemaDict = {
            headers[i]: td.text.lstrip() for i, td in enumerate(tr.find_all("td"))
        }
        spørgeskemaDict["id"] = (
            re.search("id=\d+", str(tr.find("a").get("href")))
            .group()
            .replace("id=", "")
        )
        spørgeskemaerDict["åbne_for_besvarelse"].append(spørgeskemaDict)

    table = soup.find(
        "table", {"id": "s_m_Content_Content_SpørgeskemaerÅbneForRapporteringGV"}
    ).find_all("tr")

    headers = [th.text.lower() for th in table[0].find_all("th")]
    for tr in table[1:]:
        spørgeskemaDict = {
            headers[i]: td.text.lstrip() for i, td in enumerate(tr.find_all("td"))
        }
        spørgeskemaDict["id"] = (
            re.search("id=\d+", str(tr.find("a").get("href")))
            .group()
            .replace("id=", "")
        )
        spørgeskemaerDict["åbne_for_rapportering"].append(spørgeskemaDict)

    return spørgeskemaerDict


def spørgeskema(self, id):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/spoergeskema/spoergeskema_besvar.aspx?id={id}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    _spørgeskema = soup.find("table", {"id": "m_Content_questionnairegv"})

    formatted_spørgeskema = []
    for spørgsmål in _spørgeskema.find_all("tr")[1:]:
        content = spørgsmål.find("td").findChildren()

        spørgeskemaDict = {
            "titel": content[0].text,
            "tekst": None,
            "svar": {"type": None, "id": None, "muligheder": []},
        }

        if (
            content[1].find("div", {"class": "ls-questionnaire-answer-text"})
            is not None
        ):
            spørgeskemaDict["svar"]["type"] = "tekstfelt"
            spørgeskemaDict["svar"]["id"] = content[1].find("textarea").get("name")
        elif (
            options := content[1].find(
                "div", {"class": "ls-questionnaire-answer-option"}
            )
        ) is not None and content[1].find("input", {"type": "radio"}) is not None:
            mulighed = {"tekst": "", "id": ""}
            children = options.find("span").findChildren()
            for option in children:
                if option.name == "label":
                    mulighed["tekst"] = option.text
                    spørgeskemaDict["svar"]["muligheder"].append(mulighed)
                    mulighed = {"tekst": "", "id": ""}

                elif option.name == "input":
                    mulighed["id"] = option.get("value")
                    spørgeskemaDict["svar"]["id"] = option.get("name")
                    spørgeskemaDict["svar"]["type"] = option.get("type")
        elif content[1].find("input", {"type": "checkbox"}) is not None:
            for option in content[1].find_all(
                "div", {"class": "ls-questionnaire-answer-option"}
            ):
                children = option.findChildren()
                spørgeskemaDict["svar"]["type"] = children[0].get("type")
                spørgeskemaDict["svar"]["muligheder"].append(
                    {"tekst": children[1].text.strip(), "id": children[0].get("name")}
                )

        tekst = content[1].find_all("div", {"class": "ls-questionnaire-question-text"})
        if len(tekst) == 2:  # Så er det en udvidet beskrivelse
            tekst = tekst[1]
            spørgeskemaDict["tekst"] = (
                "Da BetterLectio stadig er under udvikling er formatering ikke optimal.\n\n"
                + tekst.text.strip()
            )
            # TO DO: Udvidet tekst skraber
        else:
            spørgeskemaDict["tekst"] = tekst[0].text.strip()

        formatted_spørgeskema.append(spørgeskemaDict)

    info = soup.find(
        "div", {"class": "ls-questionnaire-question-section-content"}
    ).find_all("tr")
    afsender = info[1].find("td")

    spørgeskemaDict = {
        "titel": info[0].find("td").text.strip(),
        "afstender": {
            "navn": afsender.text.strip(),
            "id": afsender.find("span").get("data-lectiocontextcard"),
        },
        "anonym": info[2].find("td").text.strip() == "Ja",
        "indhold": formatted_spørgeskema,
    }

    return spørgeskemaDict


def besvarSpørgeskema(self, id, besvarelser):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/spoergeskema/spoergeskema_besvar.aspx?id={id}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    payload = generatePayload(soup, "m$Content$answercompletebt")
    _fill_payload(
        "", payload, "__LASTFOCUS", "searchinputfield"
    )
    payload.update(besvarelser)
    payload["LectioPostbackId"] = ""

    payloadEncoded = "&".join(
        f"{urllib.parse.quote(key)}={urllib.parse.quote(value).replace('%20', '+')}"
        for key, value in payload.items()
    )
    resp = self.session.post(
        f"https://www.lectio.dk/lectio/{self.skoleId}/spoergeskema/spoergeskema_besvar.aspx?id={id}&prevurl=spoergeskema%2fspoergeskema_rapport.aspx",
        data=payloadEncoded,
    )
    soup = BeautifulSoup(resp.text, "html.parser")

    payload = generatePayload(soup, "m$Content$answercompletebt")
    payload.update(besvarelser)
    _fill_payload(
        "xxconfirmed_", payload, "m$searchinputfield", "LectioPostbackId"
    )
    payloadEncoded = "&".join(
        f"{urllib.parse.quote(key)}={urllib.parse.quote(value).replace('%20', '+')}"
        for key, value in payload.items()
    )

    resp = self.session.post(
        f"https://www.lectio.dk/lectio/{self.skoleId}/spoergeskema/spoergeskema_besvar.aspx?id={id}&prevurl=spoergeskema%2fspoergeskema_rapport.aspx",
        allow_redirects=False,
        data=payloadEncoded,
    )

    if resp.status_code == 303:
        return {"success": True}


def _fill_payload(arg0, payload, arg2, arg3):
    payload["__EVENTARGUMENT"] = arg0
    payload[arg2] = ""
    payload[arg3] = ""
