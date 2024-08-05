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
        "karakternoter": [],
        "protokollinjer": [],
        "karakterer": {},
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

    # PROTOKOLLINJER
    rows = oversigtSoup.find("div", {"id": "printareaprotocolgrades"}).find_all("tr")
    headers = [
        header.text.lower().replace(" ", "_").replace("\xad", "")
        for header in rows[0].find_all("th")
    ]
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

    # KARAKTERER
    rows = oversigtSoup.find(
        "table", {"id": "s_m_Content_Content_karakterView_KarakterGV"}
    ).find_all("tr")
    headers = [header.text.lower().strip().replace("\n", "") for header in rows[0].find_all("th")]
    datarows = rows[1:]
    for row in datarows:
        tds = row.find_all("td")
        hold = tds[0].find("span").text
        karakter = {}
        for i in range(len(tds)):
            if headers[i] == "hold":
                continue
            elif headers[i] == "fag":
                fag_ = tds[i].text.strip().replace("SAM", "Samlet vurdering")
                fag, evalueringsform = fag_.split(", ")
                niveau = fag[-1:] if fag[-1].isupper() else "-"
                fag = fag[:-2] if fag[-1].isupper() else fag
                karakter["fag"] = fag
                karakter["niveau"] = niveau
                karakter["evalueringsform"] = evalueringsform
                karakter["vægtning"] = vægtning[fag_]
                hold = f"{hold}_{evalueringsform.lower()[:3]}"
            else:
                value = tds[i].text.strip()
                karakter[headers[i]] = value if value != "" and value != "--" else ""
        karaktererDict["karakterer"][hold] = karakter

    return karaktererDict
