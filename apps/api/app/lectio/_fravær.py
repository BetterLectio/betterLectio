from bs4 import BeautifulSoup

from lectio.utils import skemaBrikExtract


renameDictionary = {"Lærere": "Lærer", "Lokaler": "Lokale"}


def fravær(self):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/subnav/fravaerelev.aspx?elevid={self.elevId}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    fravær = {
        "generalt": [],
        "moduler": {"manglende_fraværsårsager": [], "oversigt": []},
        "grafisk_oversigt": "https://www.lectio.dk"
        + soup.find("img", {"class": "fravaer_billede"}).get("src"),
    }

    for hold in soup.find(
        "table", {"id": "s_m_Content_Content_SFTabStudentAbsenceDataTable"}
    ).find_all("tr"):
        if hold.get("id") is None:
            row = hold.find_all("td")
            fravær["generalt"].append(
                {
                    "hold": row[0].text,
                    "opgjort_fravær_procent": row[1].text,
                    "opgjort_fravær_moduler": row[2].text,
                    "heleåret_fravær_procent": row[3].text,
                    "heleåret_fravær_moduler": row[4].text,
                }
            )

    resp = self.session.get(
        f"https://www.lectio.dk/lectio/{self.skoleId}/subnav/fravaerelev_fravaersaarsager.aspx?elevid={self.elevId}"
    )
    soup = BeautifulSoup(resp.text, "html.parser")

    manglende = soup.find("table", {"id": "s_m_Content_Content_FatabMissingAarsagerGV"})
    if "Der er ingen manglende fraværsårsager..." not in str(manglende):
        for tr in manglende.find_all("tr")[1:]:
            modul = tr.find("a", class_="s2skemabrik")
            tds = tr.find_all("td")
            registreretLærer = tds[4].text.lstrip().split("\n\t\t\t\t\t\t")
            årsagÅrsagsnote = tds[6].text.lstrip().split("\n\t\t\t\t\t\t")
            if len(årsagÅrsagsnote) == 1:
                årsagÅrsagsnote.append("")

            fravær["moduler"]["manglende_fraværsårsager"].append(
                {
                    "type": "Lektion",  # De har fjernet det fra tabellen, måske skal vi også gøre det samme.
                    "uge": tds[0].text.lstrip(),
                    "aktivitet": skemaBrikExtract(modul),
                    "fravær": tds[2].text.lstrip(),
                    "fraværstype": tds[3].text.lstrip(),
                    "registreret": registreretLærer[0].rstrip(),
                    "lærer": registreretLærer[1],
                    "bemærkning": tds[5].text.lstrip(),
                }
            )

    oversigt = soup.find("table", {"id": "s_m_Content_Content_FatabAbsenceFravaerGV"})
    if "Der er ikke indtastet nogen fraværsårsager" not in str(oversigt):
        for tr in oversigt.find_all("tr")[1:]:
            modul = tr.find("a", class_="s2skemabrik")
            tds = tr.find_all("td")
            registreretLærer = tds[4].text.lstrip().split("\n\t\t\t\t\t\t")
            årsagÅrsagsnote = tds[6].text.lstrip().split("\n\t\t\t\t\t\t")
            if len(årsagÅrsagsnote) == 1:
                årsagÅrsagsnote.append("")

            fravær["moduler"]["oversigt"].append(
                {
                    "type": "Lektion",  # De har fjernet det fra tabellen, måske skal vi også gøre det samme.
                    "uge": tds[0].text.lstrip(),
                    "aktivitet": skemaBrikExtract(modul),
                    "fravær": tds[2].text.lstrip(),
                    "fraværstype": tds[3].text.lstrip(),
                    "registreret": registreretLærer[0].rstrip(),
                    "lærer": registreretLærer[1],
                    "bemærkning": tds[5].text.lstrip(),
                    "årsag": årsagÅrsagsnote[0].rstrip(),
                    "årsagsnote": årsagÅrsagsnote[1],
                }
            )

    return fravær
