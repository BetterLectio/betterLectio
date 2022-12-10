import lectio
import json
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import Response
from flask_cachecontrol import cache, cache_for, dont_cache, Always, ResponseIsSuccessfulOrRedirect
from datetime import datetime, date, timedelta
from functools import wraps
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
    try:
        brugernavn = request.headers.get('brugernavn')
        adgangskode = request.headers.get('adgangskode')
        skoleId = request.headers.get('skole_id')

        lectioClient = lectio.sdk(brugernavn=brugernavn, adgangskode=adgangskode, skoleId=skoleId)

        return lectioClient.base64Cookie()
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500

@app.route('/check-cookie')
def checkCookie():
    cookie = request.headers.get("lectio-cookie")

    try:
        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        lectioClient.fåElev(lectioClient.elevId)
        return jsonify({"valid": True})
    except Exception:
        return jsonify({"valid": False})
#
@app.route('/mig')
@cache_for(minutes=5)
def mig():
    try:
        cookie = request.headers.get("lectio-cookie")
        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        return jsonify(lectioClient.fåElev(lectioClient.elevId))
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500


@app.route('/skema')
@cache_for(minutes=5)
def skema():
    try:
        cookie = request.headers.get("lectio-cookie")

        uge = request.args.get("uge")
        år = request.args.get("år")

        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        return jsonify(lectioClient.skema(uge=uge, år=år))
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500

@app.route('/lektier')
@cache_for(minutes=5)
def lektier():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        return jsonify(lectioClient.lektier())
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500
@app.route('/opgaver')
@cache_for(minutes=5)
def opgaver():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        return jsonify(lectioClient.opgaver())
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500
@app.route('/modul')
def modul():
    try:
        cookie = request.headers.get("lectio-cookie")
        absid = request.args.get("absid")

        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        return jsonify(lectioClient.modul(absid=absid))
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500

@app.route('/besked')
def besked():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.args.get("id")

        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        return jsonify(lectioClient.besked(message_id=id))
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500

@app.route('/beskeder')
@cache_for(minutes=5)
def beskeder():
    try:
        cookie = request.headers.get("lectio-cookie")
        id = request.args.get("id")

        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        return jsonify(lectioClient.beskeder(id=id))
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500

@app.route('/informationer') 
@cache_for(minutes=10080) # 1 week 
def informationer():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)
        return jsonify(lectioClient.informationer())
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500

@app.route('/profil_billed')
@cache_for(minutes=20160) # 2 weeks
def profilBilled():
    cookie = request.headers.get("lectio-cookie")
    id = request.args.get("id")
    fullsize = request.args.get("fullsize")

    lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)

    if (pictureId := lectioClient.fåBruger(id)['pictureid']) != None:
        url = f"https://www.lectio.dk/lectio/{lectioClient.skoleId}/GetImage.aspx?pictureid={pictureId}"
        if fullsize != None:
            url += f"&fullsize={fullsize}"

        return Response(base64.encodebytes(lectioClient.fåFil(url)), status=200)
        #return Response(lectioClient.fåFil(url), status=200, mimetype="image/gif")
    else:
        return Response(status=400)
        #return Response(lectioClient.session.get("https://www.lectio.dk/lectio/img/defaultfoto_small.jpg").content, mimetype="image/gif")

@app.route("/opgave")
def opgave():
    try:
        cookie = request.headers.get("lectio-cookie")
        exerciseid = request.args.get("exerciseid")

        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)

        return lectioClient.opgave(exerciseid=exerciseid)
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500

@app.route("/fravaer")
@cache_for(minutes=5)
def fravaer():
    try:
        cookie = request.headers.get("lectio-cookie")

        lectioClient = lectio.sdk(brugernavn="", adgangskode="", skoleId="", base64Cookie=cookie)

        return lectioClient.fravær()
    except Exception as e:
        return jsonify({"backend_error": str(e)}), 500

if __name__ == '__main__':
    app.run()
