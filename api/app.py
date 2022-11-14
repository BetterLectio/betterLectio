import lectio
import json
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import Response
import logging
import re

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

app.logger.disabled = True
log = logging.getLogger('werkzeug')
log.disabled = True

@app.route("/")
def index():
    return """
    <!DOCTYPE html>
    <html>
      <head>
        <title>Loading...</title>
        <meta http-equiv="refresh" content="0; url=https://github.com/jona799t/BetterLectio-Flask-Backend">
        <script>window.location.href = "https://github.com/jona799t/BetterLectio-Flask-Backend"</script>
      </head>
      <body>
        <p>Not redirected? Go to <a href="https://github.com/jona799t/BetterLectio-Flask-Backend">github.com/jona799t/BetterLectio-Flask-Backend</a></p>
      </body>
    </html>
    """
@app.route('/auth') # TODO: Lav en parameter som hedder forbliv logget ind
def auth():
    brugernavn = request.args.get('brugernavn')
    adgangskode = request.args.get('adgangskode')
    skoleId = request.args.get('skole_id')

    lectioClient = lectio.sdk(brugernavn=brugernavn, adgangskode=adgangskode, skoleId=skoleId)

    return lectioClient.base64Cookie()

@app.route('/check-cookie')
def checkCookie():
    cookie = request.args.get("cookie")

    try:
        lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        return jsonify({"valid": True})
    except Exception:
        return jsonify({"valid": False})

@app.route('/mig')
def mig():
    cookie = request.args.get("cookie")
    lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
    return jsonify(lectioClient.fåElev(lectioClient.elevId))


@app.route('/skema')
def skema():
    cookie = request.args.get("cookie")

    uge = request.args.get("uge")
    år = request.args.get("år")

    lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
    return jsonify(lectioClient.skema(uge=uge, år=år))

@app.route('/lektier')
def lektier():
    cookie = request.args.get("cookie")

    lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
    return jsonify(lectioClient.lektier())
@app.route('/opgaver')
def opgaver():
    cookie = request.args.get("cookie")

    lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
    return jsonify(lectioClient.opgaver())
@app.route('/modul')
def modul():
    cookie = request.args.get("cookie")
    absid = request.args.get("absid")

    lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
    return jsonify(lectioClient.modul(absid=absid))

@app.route('/beskeder')
def beskeder():
    cookie = request.args.get("cookie")
    id = request.args.get("id")

    lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
    return jsonify(lectioClient.beskeder(id=id))

@app.route('/informationer')
def informationer():
    cookie = request.args.get("cookie")

    lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
    return jsonify(lectioClient.informationer())


@app.route('/profil_billed')
def profilBilled():
    cookie = request.args.get("cookie")
    id = request.args.get("id")
    fullsize = request.args.get("fullsize")

    lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)

    if (pictureId := lectioClient.fåBruger(id)['pictureid']) != None:
        url = f"https://www.lectio.dk/lectio/{lectioClient.skoleId}/GetImage.aspx?pictureid={pictureId}&fullsize=1"
        if fullsize != None:
            url += f"&fullsize={fullsize}"

        return Response(lectioClient.fåFil(url), status=200, mimetype="image/gif")
    else:
        return Response(status=400)
        #return Response(lectioClient.session.get("https://www.lectio.dk/lectio/img/defaultfoto_small.jpg").content, mimetype="image/gif")


if __name__ == '__main__':
    app.run()