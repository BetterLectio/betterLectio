import lectio
import json

from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/auth')
def auth():
    brugernavn = request.args.get('brugernavn')
    adgangskode = request.args.get('adgangskode')
    skoleId = request.args.get('skole_id')

    lectioClient = lectio.sdk(brugernavn=brugernavn, adgangskode=adgangskode, skoleId=skoleId)

    return json.dumps(lectioClient.session.cookies.get_dict())


@app.route('/skema')
def skema():
    cookie = request.args.get("cookie")

    return jsonify({"error": "not supported yet"})

if __name__ == '__main__':
   app.run()

