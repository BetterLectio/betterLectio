import contextlib
import re


def generatePayload(soup, eventTarget):
    payload = {}
    for _input in soup.find("form", {"id": "aspnetForm"}).find_all(
        "input", {"type": "hidden"}
    ):
        id = _input.get("name")
        if id is None:
            id = _input.get("id")
        payload[id] = _input.get("value")
        if payload[id] is None:
            payload[id] = ""
    payload["__EVENTTARGET"] = eventTarget

    return payload


statusDictionary = {
    "s2brik": "normal",
    "s2cancelled": "aflyst",
    "s2changed": "ændret",
    "s2bgboxeksamen": "eksamen",
}

renameDictionary = {"Lærere": "Lærer", "Lokaler": "Lokale"}


def skemaBrikExtract(skemabrik):
    if matches := re.search(
        "(?:absid|ProeveholdId)=([0-9]+)", skemabrik["href"]
    ):
        absid = matches[1]
    else:
        absid = skemabrik.get("href")

    modulDict = {
        "navn": None,
        "tidspunkt": None,
        "hold": None,
        "hold_id": None,
        "lærer": None,
        "lokale": None,
        "status": "normal",
        "absid": absid,
        "andet": None,
    }

    modulDetaljer = skemabrik
    statusClass = modulDetaljer.get("class")[2]
    if statusClass in statusDictionary:
        modulDict["status"] = statusDictionary[modulDetaljer.get("class")[2]]
    else:
        modulDict["status"] = modulDetaljer.get("class")[2]

    modulDetaljer = modulDetaljer["data-tooltip"].split("\n\n")[0].split("\n")

    for modulDetalje in modulDetaljer:
        if (value := ": ".join(modulDetalje.split(": ")[1:])) != "":
            if (navn := modulDetalje.split(": ")[0]) in renameDictionary:
                navn = renameDictionary[navn]

            modulDict[navn.lower()] = value
        elif re.search(
            r"((?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til( (?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d)? ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))",
            modulDetalje,
        ):
            modulDict["tidspunkt"] = modulDetalje
        else:
            modulDict["navn"] = modulDetalje

    with contextlib.suppress(Exception):
        modulDict["hold_id"] = (
            re.search('data-lectiocontextcard="HE[0-9]+', str(skemabrik))
            .group()
            .replace('data-lectiocontextcard="', "")
        )
    with contextlib.suppress(Exception):
        modulDict["andet"] = skemabrik["data-tooltip"].split("\n\n")[1]
    return modulDict
