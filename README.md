# BetterLectio-Flask-Backend
Backend til BetterLectio

## Endpoints
### Readme
Endpoint: ``/``  
Returnere: ``Åbner denne Github med denne dokumentation``

### Auth
Endpoint: ``/auth``  
Parameter:
 - ``brugernavn``
 - ``adgangkode``
 - ``skole_id``

Eksempel:  
``https://better-lectio-flask-backend.vercel.app/auth?brugernavn=jona799t&adgangskode=1234&skole_id=1``  
Returnere: ``Base64 cookie string som kan bruges til at tilgå de andre endpoints``

### Skema
Endpoint: ``/skema``  
Eksempel: ``https://better-lectio-flask-backend.vercel.app/skema?cookie=ey...``  
Returnere: Se [python-lectio](https://github.com/jona799t/python-lectio#skema)

### Mig
Endpoint: ``/mig``  
Eksempel: ``https://better-lectio-flask-backend.vercel.app/mig?cookie=ey...``  
Returnere: ``json med navn og billede``