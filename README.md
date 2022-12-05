# BetterLectio-Flask-Backend
Backend til BetterLectio

## Vigtigt
Selve serveren køre ikke fra denne repo men fra https://github.com/jona799t/BetterLectio-Flask-Backend  
Det er fordi at vercel ikke tillader at man benytter sig af en organisation uden at opgradere.

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
Parameter:
 - ``uge``
 - ``år``
Eksempel: ``https://better-lectio-flask-backend.vercel.app/skema?uge=1&år=2023&cookie=ey...``  
Returnere: Se [python-lectio](https://github.com/jona799t/python-lectio#skema)

### Mig
Endpoint: ``/mig``  
Eksempel: ``https://better-lectio-flask-backend.vercel.app/mig?cookie=ey...``  
Returnere: ``json med navn og billede``

### Lektier
Endpoint: ``/lektier``  
Eksempel: ``https://better-lectio-flask-backend.vercel.app/mig?cookie=ey...``  
Returnere: Se [python-lectio](https://github.com/jona799t/python-lectio#lektier)
