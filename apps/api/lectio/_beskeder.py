import contextlib
import re
from bs4 import BeautifulSoup
import urllib
import markdownify
from lectio.utils import generatePayload


def beskeder(self, id=None):
    if id is not None:
        url = f"https://www.lectio.dk/lectio/{self.skoleId}/beskeder2.aspx?mappeid={id}"
    else:
        url = f"https://www.lectio.dk/lectio/{self.skoleId}/beskeder2.aspx"

    resp = self.session.get(url)
    if url not in resp.url:
        raise Exception("lectio-cookie udløbet")

    soup = BeautifulSoup(resp.text, "html.parser")

    beskederHtml = soup.find_all("tr")

    if (sideInddeling := soup.find("tr", {"class": "paging heavy"})) is not None:
        payload = {}
        for _input in soup.find("form", {"id": "aspnetForm"}).find_all(
            "input", {"type": "hidden"}
        ):
            id = _input.get("id")
            if id is None:
                id = _input.get("name")
            payload[id] = _input.get("value")
        payload["__EVENTTARGET"] = (
            sideInddeling.find_all("td")[-1]
            .find("a")
            .get("href")
            .split('"')[1]
            .split('"')[0]
        )

        resp = self.session.post(url, data=payload)
        soup = BeautifulSoup(resp.text, "html.parser")

        beskederHtml = soup.find_all("tr")[:-2]

    options = []
    for div in soup.find(
        "div", {"id": "s_m_Content_Content_ListGridSelectionTree"}
    ).find_all("div", {"lec-role": "treeviewnodecontainer"}):
        if "-" in div.get("lec-node-id"):
            name = div.text.rstrip()
            option = {
                "name": None,
                "id": div.get("lec-node-id"),
                "selected": False,
                "content": [],
            }
            if div.find("a", {"class": "selectedFolder"}) is not None:
                option["selected"] = True

            if len(name.split("\n")) == 1:
                option["name"] = name
            else:
                name = div.text.rstrip().split("\n")[0]
                option["name"] = name
                for item in div.find_all("div", {"lec-role": "treeviewnodecontainer"}):
                    option["content"].append(
                        {"name": item.text.rstrip(), "id": item.get("lec-node-id")}
                    )

            options.append(option)
    beskedHeader = []
    for th in beskederHtml[0].find_all("th"):
        if len(header := th.text.rstrip()) != 0:
            header = header.lower().title().replace(" ", "")
            header = header[0].lower() + header[1:]
            beskedHeader.append(header)

    beskeder = []
    for beskedHtml in beskederHtml[1:]:
        besked = {}

        for i, td in enumerate(beskedHtml.find_all("td")[3:-2]):
            if beskedHeader[i] == "modtagere":
                besked[beskedHeader[i]] = td.find("span").get("title").split("\r\n")
            else:
                try:
                    besked[beskedHeader[i]] = td.find("span").get("title")
                except Exception:
                    besked[beskedHeader[i]] = td.text.lstrip().rstrip()

                if beskedHeader[i] == "emne":
                    besked["message_id"] = re.findall(
                        "\$_\d+", td.find("a").get("onclick")
                    )[0].replace("$_", "")

        beskeder.append(besked)

    return {"besked_muligheder": options, "beskeder": beskeder}


def calculateSpacing(besked, beskedOversigt, spacing=0):
    if beskedOversigt[besked] is not None:
        return calculateSpacing(beskedOversigt[besked], beskedOversigt, spacing + 1)
    else:
        return spacing


def besked(self, message_id):
    url = f"https://www.lectio.dk/lectio/{self.skoleId}/beskeder2.aspx?type=visbesked&id={message_id}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    beskeder = []
    beskederHtml = soup.find(
        "table", {"id": "s_m_Content_Content_MessageThreadCtrl_MessagesGV"}
    ).find_all("tr")
    if (
        soup.find("span", {"class": "grayed-out"}).text
        != "Denne tråd kan ikke besvares"
    ):
        beskederHtml = beskederHtml[:-1]

    beskedOversigt = {}
    for besked in beskederHtml:
        try:
            beskedOversigt[
                besked.find(
                    "div", {"class": "message-thread-message-sender"}
                ).text.strip()
            ] = (
                besked.find("div", {"class": "message-reply-summary"})
                .text.replace("Er svar på besked af ", "")
                .strip()
            )
        except Exception:
            beskedOversigt[
                besked.find(
                    "div", {"class": "message-thread-message-sender"}
                ).text.strip()
            ] = None

    for besked in beskederHtml:
        bruger = {
            "navn": besked.find("div", {"class": "message-thread-message-sender"})
            .find("span")
            .text,
            "id": besked.find("div", {"class": "message-thread-message-sender"})
            .find("span")
            .get("data-lectiocontextcard"),
        }
        try:
            besvarelse = (
                besked.find("div", {"class": "message-reply-summary"})
                .text.replace("Er svar på besked af ", "")
                .strip()
            )
        except Exception:
            besvarelse = None
        try:
            vedhæftninger = besked.find(
                "div", {"class": "message-attachements"}
            ).find_all("a")
        except Exception:
            vedhæftninger = []

        beskedTekst = markdownify.markdownify(
            re.sub(
                r"^[\n\r]+|^\.|[\n\r]+$",
                "",
                str(besked.find("div", {"class": "message-thread-message-content"})),
                0,
                re.MULTILINE,
            )
        )
        with contextlib.suppress(Exception):
            vedhæftningTekst = markdownify.markdownify(
                re.sub(
                    r"^[\n\r]+|^\.|[\n\r]+$",
                    "",
                    str(besked.find("div", {"class": "message-attachements"})),
                    0,
                    re.MULTILINE,
                )
            )
            beskedTekst = beskedTekst.replace(vedhæftningTekst, "")
        beskedDict = {
            "bruger": bruger,
            "titel": besked.find(
                "div", {"class": "message-thread-message-header"}
            ).text.strip(),
            "dato": besked.find("div", {"class": "message-thread-message-sender"})
            .text.replace(bruger["navn"], "")
            .strip()[2:],
            "padding_left": 0,
            "besked": beskedTekst,
            "vedhæftninger": [
                {
                    "navn": vedhæft.text,
                    "href": "https://www.lectio.dk" + vedhæft.get("href"),
                }
                for vedhæft in vedhæftninger
            ],
            "besvarelse": besvarelse,
            "id": None,
        }

        with contextlib.suppress(Exception):
            beskedDict["id"] = re.search(
                "ctl\d+", str(besked.find("div", {"class": "lec-context-menu"}))
            ).group()
        if besvarelse is not None:
            beskedDict["padding_left"] = calculateSpacing(
                f"{bruger['navn']}, {beskedDict['dato']}", beskedOversigt
            )

        beskeder.append(beskedDict)
    beskeder[0]["id"] = None
    sortedBeskeder = []
    for besked in beskeder:
        if besked["besvarelse"]:
            sortedBeskeder.insert(
                [
                    i
                    for i, _besked in enumerate(sortedBeskeder)
                    if besked["besvarelse"]
                    == f"{_besked['bruger']['navn']}, {_besked['dato']}"
                ][0]
                + 1,
                besked,
            )
        else:
            sortedBeskeder.append(besked)

    beskedDict = {
        "modtagere": ", ".join(
            [
                str(modtager.text)
                for modtager in soup.find(
                    "div",
                    {"id": "s_m_Content_Content_MessageThreadCtrl_RecipientsReadMode"},
                )
                if len(modtager.text.strip().replace(",", "")) > 0
            ]
        ).strip(),
        "beskeder": sortedBeskeder,
    }

    return beskedDict


def besvarBesked(self, message_id, id, titel, content, _from):
    content = (
        content
        + "\n\n"
        + [
            "Sendt fra [url=github.com/JohnnyJTH/python-lectio] python-lectio [/url]",
            "Sendt fra [url=betterlectio.dk] betterlectio [/url]",
        ][_from]
    )

    url = f"https://www.lectio.dk/lectio/{self.skoleId}/beskeder2.aspx?type=visbesked&id={message_id}"
    resp = self.session.get(url)
    if resp.url != url:
        raise Exception("lectio-cookie udløbet")
    soup = BeautifulSoup(resp.text, "html.parser")

    if id is not None:
        payload = generatePayload(
            soup,
            f"s$m$Content$Content$MessageThreadCtrl$MessagesGV${id}$ReplyToMessage",
        )
        payload["__EVENTARGUMENT"] = ""
        payload["__LASTFOCUS"] = ""
        payload[
            "s$m$Content$Content$MessageThreadCtrl$MessagesGV$ctl12$EditModeHeaderTitleTB$tb"
        ] = titel
        payload[
            "s$m$Content$Content$MessageThreadCtrl$MessagesGV$ctl12$EditModeContentBBTB$TbxNAME$tb"
        ] = content
        payloadEncoded = "&".join(
            f"{urllib.parse.quote(key)}={urllib.parse.quote(value).replace('%20', '+')}"
            for key, value in payload.items()
        )
        resp = self.session.post(url, data=payloadEncoded)
        soup = BeautifulSoup(resp.text, "html.parser")

    sendMessageId = re.search(
        "ctl\d+",
        str(soup.find("a", {"title": "Genvej: Alt+S / Shift+Alt+S / Ctrl+Alt+S"})),
    ).group()

    payload = generatePayload(
        soup,
        f"s$m$Content$Content$MessageThreadCtrl$MessagesGV${sendMessageId}$SendMessageBtn",
    )
    payload["__EVENTARGUMENT"] = ""
    payload["__LASTFOCUS"] = ""
    payload["__SCROLLPOSITIONX"] = "0"
    payload["__SCROLLPOSITIONY"] = "0"
    payload["__SCROLLPOSITIONY"] = "0"
    payload[
        f"s$m$Content$Content$MessageThreadCtrl$MessagesGV${sendMessageId}$EditModeHeaderTitleTB$tb"
    ] = titel
    payload[
        f"s$m$Content$Content$MessageThreadCtrl$MessagesGV${sendMessageId}$EditModeContentBBTB$TbxNAME$tb"
    ] = content
    payloadEncoded = "&".join(
        f"{urllib.parse.quote(key)}={urllib.parse.quote(value).replace('%20', '+')}"
        for key, value in payload.items()
    )

    resp = self.session.post(url, data=payloadEncoded)
    if resp.status_code == 200:
        return {"success": True}
    else:
        raise Exception("Levering af besvarelsen var ikke succesfuld")
