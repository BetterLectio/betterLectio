import lectio
import base64
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask import Response
from flask_cachecontrol import cache_for
from datetime import datetime, date
from dateutil.relativedelta import relativedelta, MO, TU, WE, TH, FR, SA, SU
import logging
import requests
from bs4 import BeautifulSoup
import traceback

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

app.logger.disabled = True
log = logging.getLogger('werkzeug')
log.disabled = True

dateDict = {
    "ma": MO,
    "ti": TU,
    "on": WE,
    "to": TH,
    "fr": FR,
    "lø": SA,
    "sø": SU
}

@app.route("/")
def index():
    return """
    <!DOCTYPE html>
    <html>
      <head>
        <title>Loading...</title>
        <meta http-equiv="refresh" content="0; url=https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        <script>window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"</script>
      </head>
      <body>
        <p>Not redirected? Go to <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">the link manually</a></p>
      </body>
    </html>
    """
@app.route('/auth') # TODO: Lav en parameter som hedder forbliv logget ind
def auth():
    try:
        brugernavn = request.headers.get('brugernavn')
        adgangskode = request.headers.get('adgangskode')
        skoleId = request.headers.get('skoleid')

        lectioClient = lectio.sdk(brugernavn=brugernavn, adgangskode=adgangskode, skoleId=skoleId)
        resp = make_response(jsonify({"success": True}))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"success": False, "backend_error": traceback.format_exc()}), 500

@app.route('/qr-auth')
def qrAuth():
    try:
        userId = request.headers.get('userId')
        QrId = request.headers.get('QrId')
        skoleId = request.headers.get('skoleid')

        lectioClient = lectio.sdk(userId=userId, QrId=QrId, skoleId=skoleId)
        resp = make_response(jsonify({"success": True}))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"success": False, "backend_error": traceback.format_exc()}), 500

@app.route('/check-cookie')
def checkCookie():
    cookie = request.headers.get("lectio-cookie")

    try:
        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)
        lectioClient.fåElev(lectioClient.elevId)

        resp = make_response(jsonify({"valid": True}))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"valid": False}), 500
    
@app.route('/ha/frontpage')
def haFrontpage():
    try:
        brugernavn = request.headers.get('username')
        adgangskode = request.headers.get('password')
        skoleId = request.headers.get('school')

        lectioClient = lectio.sdk(brugernavn=brugernavn, adgangskode=adgangskode, skoleId=skoleId)
        resp = make_response(jsonify(lectioClient.forside()))

        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route('/mig')
@cache_for(minutes=5)
def mig():
    try:
        cookie = request.headers.get("lectio-cookie")
        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.fåElev(lectioClient.elevId)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500


@app.route('/skema')
@cache_for(minutes=5)
def skema():
    try:
        cookie = request.headers.get("lectio-cookie")

        id = request.args.get("id")

        uge = request.args.get("uge")
        år = request.args.get("år")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.skema(uge=uge, år=år, id=id)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route('/lektier')
@cache_for(minutes=5)
def lektier():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.lektier()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500
@app.route('/opgaver')
@cache_for(minutes=5)
def opgaver():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.opgaver()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500
@app.route('/modul')
def modul():
    try:
        cookie = request.headers.get("lectio-cookie")
        absid = request.args.get("absid")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.modul(absid=absid)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route('/besked')
def besked():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.args.get("id")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.besked(message_id=id)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route('/beskeder')
@cache_for(minutes=5)
def beskeder():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.args.get("id")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)
        resp = make_response(jsonify(lectioClient.beskeder(id=id)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route('/beskeder2')
@cache_for(minutes=5)
def beskeder2():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        beskeder = []
        for id in [-20, -30, -35, -10]:
            for besked in lectioClient.beskeder(id=id)["beskeder"]:
                if besked not in beskeder:
                    beskeder.append(besked)

        for besked in beskeder:
            dato = besked["ændret"]
            if len(besked["ændret"].split(" ")) == 1 and ":" in besked["ændret"]:
                dato = datetime.now().strftime("%d/%m-%Y") + " " + dato
            elif len(besked["ændret"].split(" ")) == 2 and "/" in besked["ændret"]:
                dato = f"{dato.split(' ')[1]}-{datetime.now().year}" + " 12:00"
            elif len(besked["ændret"].split(" ")) == 2 and ":" in besked["ændret"]:
                today = date.today()
                dato = (today + relativedelta(weekday=dateDict[dato.split(" ")[0]](-1))).strftime("%d/%m-%Y") + " " + besked["ændret"].split(" ")[1]
            else:
                dato += " 12:00"

            besked["dato"] = dato

        beskeder.sort(key=lambda x: datetime.strptime(x['dato'], '%d/%m-%Y %H:%M'), reverse=True)

        resp = make_response(jsonify(beskeder))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route('/besvar_besked', methods=['POST'])
def result():
    try:
        cookie = request.headers.get("lectio-cookie")
        data = request.get_json(force=True)

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)
        lectioClient.besvarBesked(data["message_id"], data["id"], data["titel"], data["content"], 1)

        resp = make_response(jsonify({"success": True}))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route('/informationer') 
@cache_for(minutes=10080) # 1 week 
def informationer():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.informationer()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route('/profil_billed')
@cache_for(minutes=20160) # 2 weeks
def profilBilled():
    cookie = request.headers.get("lectio-cookie")
    id = request.args.get("id")
    fullsize = request.args.get("fullsize")

    lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

    if (pictureId := lectioClient.fåBruger(id)['pictureid']) != None:
        url = f"https://www.lectio.dk/lectio/{lectioClient.skoleId}/GetImage.aspx?pictureid={pictureId}"
        if fullsize != None:
            url += f"&fullsize={fullsize}"

        resp = make_response(base64.encodebytes(lectioClient.fåFil(url)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    else:
        return Response(status=400)

@app.route("/opgave")
def opgave():
    try:
        cookie = request.headers.get("lectio-cookie")
        exerciseid = request.args.get("exerciseid")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.opgave(exerciseid=exerciseid)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/fravaer")
@cache_for(minutes=5)
def fravaer():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.fravær()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500
@app.route("/dokumenter")
@cache_for(minutes=5)
def dokumenter():
    try:
        cookie = request.headers.get("lectio-cookie")
        folderid = request.args.get("folderid")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.dokumenter(folderid=folderid)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500
@app.route("/forside")
@cache_for(minutes=5)
def forside():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.forside()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500
@app.route("/ledige_lokaler")
@cache_for(minutes=5)
def ledige_lokaler():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.ledigeLokaler()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/karakterer")
@cache_for(minutes=5)
def karakterer():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.karakterer()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/studieretningspraesentation")
@cache_for(days=1)
def studieretningspræsentation():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.headers.get("id")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.studieretningspræsentation(elevId=id)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/skoler")
@cache_for(days=5)
def skoler():
    resp = requests.get("https://www.lectio.dk/lectio/login_list.aspx?showall=1")

    skoler = []
    for skole in BeautifulSoup(resp.text, "html.parser").find_all("div", {"class": "buttonHeader"}):
        skoler.append({"skole": skole.text, "id": skole.find("a").get("href").split("/")[2]})

    return jsonify(skoler)

@app.route("/spoergeskemaer")
@cache_for(minutes=5)
def spørgeskemaer():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.spørgeskemaer()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/faa_bruger")
@cache_for(minutes=5)
def få_bruger():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.headers.get("id")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.fåBruger(id)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/hold_til_fag")
@cache_for(days=365)
def hold_til_fag():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.args.get("id")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.holdTilFag(id)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/eksamener")
@cache_for(minutes=5)
def eksamener():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.eksamener()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/terminer")
def terminer():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.fåTerminer()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/aendre_termin")
def ændre_termin():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.args.get("id")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.ændreTermin(id)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/spoergeskema")
@cache_for(minutes=5)
def spørgeskema():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.args.get("id")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.spørgeskema(id)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/besvar_spoergeskema", methods=["POST"])
def besvarSpørgeskema():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.args.get("id")
        besvarelser = request.json.get("besvarelser")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.besvarSpørgeskema(id, besvarelser)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/lokale_dagsorden")
@cache_for(minutes=5)
def lokaleDagsorden():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.lokaleDagsorden()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/studieplan")
@cache_for(days=1)
def studieplan():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.studieplan()))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

@app.route("/forloeb")
@cache_for(minutes=5)
def forløb():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.args.get("id")

        lectioClient = lectio.sdk(brugernavn=None, adgangskode=None, skoleId=None, base64Cookie=cookie)

        resp = make_response(jsonify(lectioClient.forløb(id)))
        resp.headers["set-lectio-cookie"] = lectioClient.base64Cookie()
        resp.headers["Access-Control-Expose-Headers"] = "set-lectio-cookie"
        return resp
    except Exception:
        return jsonify({"backend_error": traceback.format_exc()}), 500

if __name__ == '__main__':
    app.run()
