from bs4 import BeautifulSoup
import urllib

from lectio.utils import generatePayload


def get_grades(soup, mode="type"):
    table = soup.find("table", {"id": "s_m_Content_Content_karakterView_KarakterGV"})

    rows = table.find_all("tr")
    headers = [ele.text.strip() for ele in rows[0].find_all("th")]

    if mode == "type":
        grades = {}

        for ele in rows[0].find_all("th"):
            headers.append(ele.text.strip())
            grades[ele.text.strip()] = []

        for row in rows[1:]:
            grade = dict(
                [
                    detail.lower().split(": ")
                    for detail in row.find("div", {"class": "textCenter"})
                    .get("title")
                    .split("\n")
                ]
            )

            rows = row.find_all("td")
            grade["hold"] = {
                "navn": rows[0].text,
                "id": rows[0].find("span").get("data-lectiocontextcard"),
            }
            grade["fag"] = rows[1].text

            for i in range(len(rows) - 2):
                grade["karakter"] = rows[i + 2].text
                grades[headers[i + 2]].append(grade)

        return grades

    else:  # if type == "table"
        grades = []
        for row in rows[1:]:
            grade = dict(
                [
                    detail.lower().split(": ")
                    for detail in row.find("div", {"class": "textCenter"})
                    .get("title")
                    .split("\n")
                ]
            )

            rows = row.find_all("td")
            grade["hold"] = {
                "navn": rows[0].text,
                "id": rows[0].find("span").get("data-lectiocontextcard"),
            }
            grade["fag"] = rows[1].text
            grade["grades"] = [ele.text.strip() for ele in row.find_all("td")[2:]]

            grades.append(grade)

        return {"headers": headers, "grades": grades}


def get_grade_notes(soup):
    table = soup.find(
        "table", {"id": "s_m_Content_Content_karakterView_KarakterNoterGrid"}
    )
    rows = table.find_all("tr")
    headers = []
    grades = []
    for row in rows:
        if cols := row.find_all("th"):
            headers = [ele.text.strip() for ele in cols]
        elif cols := row.find_all("td"):
            grades.append([ele.text.strip() for ele in cols])

    return {"headers": headers, "notes": grades}


def _karakterer(self, mode):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/grades/grade_report.aspx?elevid={self.elevId}&culture=da-DK"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    header = [
        th.text.replace("\xad", "").lower().replace(" ", "_")
        for th in soup.find("div", {"id": "printareaprotocolgrades"})
        .find("tr")
        .find_all("th")
    ]
    karakterer_list = []
    for tr in soup.find("div", {"id": "printareaprotocolgrades"}).find_all("tr")[1:]:
        karakter = {header[i]: td.text for i, td in enumerate(tr.find_all("td"))}
        karakterer_list.append(karakter)

    grades = get_grades(soup, mode)
    notes = get_grade_notes(soup)

    return {
        "karakterer": grades,
        "notes": notes,
        "protokollinjer": karakterer_list,
    }


def karakterer(self):
    karaktererDict = {
        "oversigt": {
            "karakterblad": {
                "gennemsnit": None,
                "karakterer": None,
            },
            "protokollinjer": {
                "gennemsnit": None,
                "karakterer": None,
            },
        },
        "karakterblad": [],
        "karakternoter": [],
        "protokollinjer": [],
        "informationer": {},
    }

    # FÅ HTML FRA LECTIO
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/grades/grade_report.aspx?elevid={self.elevId}&culture=da-DK"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    oversigtSoup = BeautifulSoup(resp.text, "html.parser")

    # VÆGTNING
    vægtning = {}
    for row in oversigtSoup.find(
        "div", {"id": "s_m_Content_Content_karakterView_LectioDetailIsland1_pa"}
    ).find_all("tr")[1:]:
        vægtning[row.find_all("td")[1].text.replace("SAM", "Samlet vurdering")] = (
            row.find("div", {"class": "textCenter"})
            .get("title")
            .split("\n")[2]
            .split(": ")[1]
        )  # Håber det er standardized på alle skoler

    _terminer = oversigtSoup.find("select", {"name": "s$m$ChooseTerm$term"})
    selected = _terminer.find("option", {"selected": "selected"}).get("value")
    terminer = dict(
        [[termin.get("value"), termin.text] for termin in _terminer.find_all("option")]
    )
    del terminer[selected]

    payload = generatePayload(oversigtSoup, "s$m$ChooseTerm$term")
    payload["__EVENTARGUMENT"] = ""
    payload["__LASTFOCUS"] = ""
    payload["m$searchinputfield"] = ""
    payload["LectioPostbackId"] = ""

    for termin in terminer:
        payload = generatePayload(oversigtSoup, "s$m$ChooseTerm$term")
        payload["__EVENTARGUMENT"] = ""
        payload["__LASTFOCUS"] = ""
        payload["m$searchinputfield"] = ""
        payload["LectioPostbackId"] = ""
        payload["s$m$ChooseTerm$term"] = str(termin)
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
        oversigtSoup = BeautifulSoup(resp.text, "html.parser")
        for row in oversigtSoup.find(
            "div", {"id": "s_m_Content_Content_karakterView_LectioDetailIsland1_pa"}
        ).find_all("tr")[1:]:
            vægtning[row.find_all("td")[1].text.replace("SAM", "Samlet vurdering")] = (
                row.find("div", {"class": "textCenter"})
                .get("title")
                .split("\n")[2]
                .split(": ")[1]
            )  # Håber det er standardized på alle skoler

    payload = generatePayload(oversigtSoup, "s$m$ChooseTerm$term")
    payload["__EVENTARGUMENT"] = ""
    payload["__LASTFOCUS"] = ""
    payload["m$searchinputfield"] = ""
    payload["LectioPostbackId"] = ""
    payload["s$m$ChooseTerm$term"] = str(selected)
    self.session.post(
        url,
        data="&".join(
            [
                f"{urllib.parse.quote(key)}={urllib.parse.quote(value)}"
                for key, value in payload.items()
            ]
        ),
        allow_redirects=False,
    )

    url = f"https://www.lectio.dk/lectio/{self.skoleId}/grades/grade_karakterblad.aspx?elevid={self.elevId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    karakterbladSoup = BeautifulSoup(resp.text, "html.parser")

    karaktermeddelelse = karakterbladSoup.find(
        "div", {"id": "s_m_Content_Content_karaktermeddelseIsland_pa"}
    ).find_all("table")

    # INFORMATIONER
    karaktererDict["informationer"] = dict(
        [
            (row.find("th").text.split(":")[0].lower(), row.find("td").text)
            for row in karaktermeddelelse[0].find_all("tr")
        ]
    )

    # KARAKTERER
    rows = karaktermeddelelse[1].find_all("tr")
    headers = [header.text.lower() for header in rows[0].find_all("th")]
    karakterSum = 0
    vægtningSum = 0
    for row in rows[2:]:
        td = row.find_all("td")
        karakter = dict([(headers[i], td[i].text.strip()) for i in range(len(td))])
        karakter["vægtning"] = vægtning[
            f"{karakter['fag']}{' ' + karakter['niveau'] if karakter['niveau'] != '-' else ''}, {karakter['evalueringsform']}"
        ]  # Håber det er standardized på alle skoler
        karaktererDict["karakterblad"].append(karakter)

        karakterSum += float(karakter["karakter"]) * float(
            karakter["vægtning"].replace(",", ".")
        )
        vægtningSum += float(karakter["vægtning"].replace(",", "."))

    karaktererDict["oversigt"]["karakterblad"]["gennemsnit"] = karakterSum / vægtningSum
    karaktererDict["oversigt"]["karakterblad"]["karakterer"] = len(rows[2:])

    # PROTOKOLLINJER
    rows = oversigtSoup.find("div", {"id": "printareaprotocolgrades"}).find_all("tr")
    headers = [
        header.text.lower().replace(" ", "_").replace("\xad", "")
        for header in rows[0].find_all("th")
    ]
    karakterSum = 0
    vægtningSum = 0
    for row in rows[1:]:
        td = row.find_all("td")
        karakter = {}
        for i in range(len(td)):
            if headers[i] in ["xprs_fag", "hold"]:
                span = td[i].find("span")
                karakter[headers[i]] = {
                    "navn": span.text,
                    "id": span.get("data-lectiocontextcard"),
                }
            else:
                karakter[headers[i]] = td[i].text

        karaktererDict["protokollinjer"].append(karakter)
        karakterSum += float(karakter["karakter"]) * float(
            karakter["vægt"].replace(",", ".")
        )
        vægtningSum += float(karakter["vægt"].replace(",", "."))

    karaktererDict["oversigt"]["protokollinjer"]["gennemsnit"] = (
        karakterSum / vægtningSum
    )
    karaktererDict["oversigt"]["protokollinjer"]["karakterer"] = len(rows[1:])

    # KARAKTERNOTER
    rows = oversigtSoup.find(
        "div", {"id": "s_m_Content_Content_karakterView_LectioDetailIsland2_pa"}
    ).find_all("tr")
    headers = [header.text.lower().strip() for header in rows[0].find_all("th")]
    for row in rows[1:]:
        td = row.find_all("td")
        noter = {}
        for i in range(len(td)):
            if headers[i] == "hold":
                span = td[i].find("span")
                noter[headers[i]] = {
                    "navn": span.text,
                    "id": span.get("data-lectiocontextcard"),
                }
            else:
                noter[headers[i]] = td[i].text.strip()

        karaktererDict["karakternoter"].append(noter)

    return karaktererDict
