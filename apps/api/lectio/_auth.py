import base64
import json
from bs4 import BeautifulSoup


def login(self):
    headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-DK,en;q=0.9",
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36",
    }
    resp = self.session.get(
        f"https://www.lectio.dk/lectio/{self.skoleId}/login.aspx", headers=headers
    )
    soup = BeautifulSoup(resp.text, "html.parser")
    payload = {
        payloadItem.get("name"): payloadItem.get("value")
        for payloadItem in soup.find_all({"input": {"type": "hidden"}})
    }
    del payload["query"]
    del payload["m$defaultformbtn"]

    payload["__EVENTTARGET"] = "m$Content$submitbtn2"
    payload["m$Content$username"] = self.brugernavn
    payload["m$Content$password"] = self.adgangskode
    payload["m$Content$AutologinCbx"] = "on"
    payload["LectioPostbackId"] = ""

    headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-DK,en;q=0.9",
        "cache-control": "max-age=0",
        "content-length": str(len(json.dumps(payload, separators=(",", ":")))),
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://www.lectio.dk",
        "referer": f"https://www.lectio.dk/lectio/{self.skoleId}/login.aspx",
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36",
    }
    resp = self.session.post(
        f"https://www.lectio.dk/lectio/{self.skoleId}/login.aspx",
        data=payload,
        headers=headers,
    )
    soup = BeautifulSoup(resp.text, "html.parser")

    successful = False
    for meta in soup.find_all({"meta": {"name": "msapplication-starturl"}}):
        if f"/lectio/{self.skoleId}/forside.aspx?" in str(meta.get("content")):
            self.elevId = meta.get("content").split("?elevid=")[1]
            successful = True
            break
    if not successful:
        raise Exception("Kunne ikke finde elev id. Rapporter venligst dette på Github")


def base64Cookie(self):
    # cookie = self.session.cookies.get_dict()
    cookie = []
    for _cookie in self.session.cookies:
        __cookie = (
            str(_cookie)
            .replace("<Cookie ", "")
            .replace("/>", "")
            .replace(">", "")
            .split(" for ")
        )
        cookie.append(
            {
                "name": __cookie[0].split("=")[0],
                "value": __cookie[0].split("=")[1],
                "for": __cookie[1],
            }
        )

    cookie.extend(
        (
            {
                "name": "LastLoginElevId",
                "value": self.elevId,
                "for": "www.lectio.dk/",
            },
            {
                "name": "LastLoginExamno",
                "value": self.skoleId,
                "for": "www.lectio.dk/",
            },
        )
    )
    return base64.b64encode(json.dumps(cookie).encode()).decode()


def qrLogin(self, userId, QrId):
    resp = self.session.get(
        f"https://www.lectio.dk/lectio/{self.skoleId}/LandingPageQrCode.aspx?userId={userId}&QrId={QrId}"
    )
    soup = BeautifulSoup(resp.text, "html.parser")
    if "Fejl: Der opstod en fejl" in resp.text:
        raise Exception(
            "Den scannede QR kode er ikke valid. En QR kode er kun gyldig i 90 sekunder og kan kun bruges én gang. - Generér en ny og prøv igen eller log ind manuelt."
        )

    successful = False
    for meta in soup.find_all({"meta": {"name": "msapplication-starturl"}}):
        if f"/lectio/{self.skoleId}/forside.aspx?" in str(meta.get("content")):
            self.elevId = meta.get("content").split("?elevid=")[1]
            successful = True
            break
    if not successful:
        raise Exception("Kunne ikke finde elev id. Rapporter venligst dette på Github")
