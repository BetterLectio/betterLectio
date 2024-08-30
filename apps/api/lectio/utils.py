import contextlib
import re
import urllib


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

def payloadEncode(payload):
    return "&".join(
        [
            f"{urllib.parse.quote(key)}={urllib.parse.quote(value).replace('%20', '+')}"
            for key, value in payload.items()
        ]
    )

statusDictionary = {
    "s2brik": "normal",
    "s2cancelled": "aflyst",
    "s2changed": "ændret",
    "s2bgboxeksamen": "eksamen",
}

renameDictionary = {"Lærere": "Lærer", "Lokaler": "Lokale"}


def skemaBrikExtract(skemabrik, modul_id=None):
    if modul_id is None:
        if matches := re.search(r"(absid|ProeveholdId)=([0-9]+)", skemabrik["href"]):
            id_type, absid = matches.groups()
            if id_type == "ProeveholdId":
                absid = f"PH{absid}"
        else:
            absid = skemabrik.get("href")
    else:
        absid = modul_id

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

    if skemabrik is None:
        return modulDict

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


def are_dicts_equal(dict1, dict2):
    return dict1.items() == dict2.items()


def remove_duplicates(input_list):
    unique_dicts = []
    for d in input_list:
        if not any(are_dicts_equal(d, unique_dict) for unique_dict in unique_dicts):
            unique_dicts.append(d)
    return unique_dicts
