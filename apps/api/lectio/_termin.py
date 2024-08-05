from bs4 import BeautifulSoup
import urllib

from lectio.utils import generatePayload


def fåTerminer(self):
    url = (
        f"https://www.lectio.dk/lectio/681/SkemaNy.aspx?type=elev&elevid={self.elevId}"
    )
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    _terminer = soup.find("select", {"name": "s$m$ChooseTerm$term"})
    selected = _terminer.find("option", {"selected": "selected"}).get("value")
    terminer = dict(
        [[termin.get("value"), termin.text] for termin in _terminer.find_all("option")]
    )

    return {"selected": selected, "terminer": terminer}


def ændreTermin(self, terminId):
    url = (
        f"https://www.lectio.dk/lectio/681/SkemaNy.aspx?type=elev&elevid={self.elevId}"
    )
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    payload = generatePayload(soup, "s$m$ChooseTerm$term")
    payload["__EVENTARGUMENT"] = ""
    payload["__LASTFOCUS"] = ""
    payload["m$searchinputfield"] = ""
    payload["LectioPostbackId"] = ""
    payload["s$m$ChooseTerm$term"] = str(terminId)

    resp = self.session.post(
        url,
        data="&".join(
            [
                f"{urllib.parse.quote(key)}={urllib.parse.quote(value)}"
                for key, value in payload.items()
            ]
        ),
        allow_redirects=False,
    )
    soup = BeautifulSoup(resp.text, "html.parser")

    _terminer = soup.find("select", {"name": "s$m$ChooseTerm$term"})
    selected = _terminer.find("option", {"selected": "selected"}).get("value")

    if selected == str(terminId):
        return {"success": True}
    else:
        raise Exception("Termin ændringen var ikke succesfuld")
