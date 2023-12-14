from bs4 import BeautifulSoup


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
