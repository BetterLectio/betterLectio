from bs4 import BeautifulSoup


def studieretningspræsentation(self, elevId=None):
    if elevId is None:
        elevId = self.elevId
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/studieretningValgfag.aspx?elevid={elevId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    tabel = soup.find("div", {"id": "krop"})
    studieretningspræsentationDict = {
        "studieretning": tabel.find(
            "span",
            {
                "id": "s_m_Content_Content_StudieretningPresentationCtrl1_retningsnavnlbl"
            },
        ).text,
        "fag": {},
    }
    for tr in tabel.find_all("tr"):
        if tr.get("class") is None:
            for td in tr.find_all("td"):
                if (
                    td.get("align") != "center"
                    and "notchosensubject" not in td.get("class")
                    and "timer" not in td.get("class")
                    and "timerTop" not in td.get("class")
                    and td.text != ""
                    and td.get("class")[0] != "studieretningTekst"
                ):
                    if td.text in studieretningspræsentationDict["fag"]:
                        studieretningspræsentationDict["fag"][td.text].append(
                            td.get("class")[-1]
                        )
                    else:
                        studieretningspræsentationDict["fag"][td.text] = [
                            td.get("class")[-1]
                        ]

    return studieretningspræsentationDict
