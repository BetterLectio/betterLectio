# BetterLectio-Flask-Backend
Backend til BetterLectio

## Endpoints
### Readme
Endpoint: ``/``  
Parameter:
 - ``brugernavn``
 - ``adgangkode``
 - ``skole_id``

Eksempel: ``https://jona799t.pythonanywhere.com/auth?brugernavn=jona799t&adgangskode=1234&skole_id=1``  
Returnere: ``Åbner denne Github med denne dokumentation``

### Auth
Endpoint: ``/auth``  
Returnere: ``Base64 string som kan bruges til verifikation``

### Auth
Endpoint: ``/skema``  
Returnere: Se [python-lectio](https://github.com/jona799t/python-lectio#skema)