import re

from bs4 import BeautifulSoup


def eksamen(self, absid):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/proevehold.aspx?type=proevehold&ProeveholdId={absid}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")

    soup = BeautifulSoup(resp.text, "html.parser")
    content = soup.find("div", {"id": "m_Content_LectioDetailIslandProevehold_pa"})
    [info_table, participants_table] = content.find_all("table")

    info_dict = {}
    tds = info_table.find_all("td")
    for td in tds:
        if ":" in td.text:
            key = _to_snake_case(td.text.strip().strip(":"))
            next_td = td.find_next_sibling("td")
            if next_td:
                info_dict[key] = next_td.text.strip()

    return {
        "info": info_dict,
        "participants": _extract_participants(participants_table),
    }


def _extract_participants(table):
    rows = table.find_all("tr")
    headers = []
    participants = []
    for i, row in enumerate(rows, start=1):
        cols = row.find_all("td")
        if i == 1:
            # Første række er overskrifter
            headers = [ele.text.strip() for ele in cols]
        else:
            participants.append(
                {
                    _to_snake_case(key): value
                    for key, value in zip(headers, [ele.text.strip() for ele in cols])
                }
            )

    return participants


def _to_snake_case(string):
    return re.sub(r"[\W]+$", "", re.sub(r"[\W]+(?=\w)", "_", string.lower()))


def eksamener(self):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/proevehold.aspx?type=elev&studentid={self.elevId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    div = soup.find("div", {"id": "m_Content_LectioDetailIslandProevehold_pa"})
    tables = div.find_all("table")

    if isinstance(tables, list) and len(tables) == 2:
        return _extract_exams(tables[1])

    return {"headers": [], "exams": []}


def _extract_exams(table):
    rows = table.find_all("tr")
    headers = []
    exams = []
    for i, row in enumerate(rows, start=1):
        cols = row.find_all("td")
        if i == 1:
            # Første række er overskrifter
            headers = [ele.text.strip() for ele in cols]
        else:
            exams.append([ele.text.strip() for ele in cols])

    return {"headers": headers, "exams": exams}
