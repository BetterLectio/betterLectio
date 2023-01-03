[![Netlify Status](https://api.netlify.com/api/v1/badges/fe2851de-234e-4d0b-864e-25827514c5a5/deploy-status)](https://app.netlify.com/sites/betlec/deploys)
![GitHub issues](https://img.shields.io/github/issues-raw/victorDigital/betterLectio)
[![Known Vulnerabilities](https://snyk.io/test/github/BetterLectio/betterLectio/badge.svg)](https://snyk.io/test/github/BetterLectio/betterLectio)

# BetterLectio

Better Lectio er en forbredelse af [Lectio](https://lectio.dk). Lectio er et dansk webbaseret lektionssystem udviklet af det danske softwarefirma MaCom A/S. [vi](https://github.com/victorDigital/betterLectio/graphs/contributors) har udviklet Better Lectio for at gøre det nemmere at bruge Lectio. Vi har fokuseret på at gøre det nemmere at finde informationer, og at gøre det nemmere at få overblik over sin skolegang. og vi har lavet en række andre forbedringer som f.eks. at lave en hel ny brugerflade, som både er mere brugervenlig og mere moderne.  
læs hvordan systemet fungerer [HER](https://betlec.netlify.app/help)

Better lectio er et open source projekt, hvilket betyder at alle kan se koden, og alle kan bidrage til projektet. Better lectio er på nuværende tidspunkt under udvikling, hvis du har nogle forslag til forbedringer, eller hvis du har fundet en fejl, så er du meget velkommen til åbne en issue, eller lave en pull request.

Lavet af [os](https://github.com/victorDigital/betterLectio/graphs/contributors)  
<img src="https://contrib.rocks/image?repo=victorDigital/betterLectio" />

### siden er tilgængelig på [betterlectio.dk](https://betterlectio.dk)

### vores dev side er tilgængelig på [dev--betlec.netlify.app](https://dev--betlec.netlify.app/)

## TODO

1. opgave side
   - hvis det er en gruppeopgave, så skal der være en liste over alle gruppemedlemmer og man skal kunne vælge personer fra listen (API) (UI)
   - der kan være en måde at uploade filer på (UI) (API)
   - der skal være en måde at skrive beskeder på (UI) (API)

2. skema side
   - kunne se andre elevers skema (API) (UI)

3. værktøjs side (nyttige værktøjer til brugeren)
   - IDÉ - hvornår møder jeg samme tid / tag hjem som min klassekammerat (elev id / elev navn) (client side med callback til server) (API)
   - IDÉ - hvor mange dage til næste prøve (API)
   - IDÉ - hvor mange moduler kan jeg i teorien pjekke før jeg får x% fravær (client side med callback til server) (brug data fra fravær side)
   - IDÉ - Skole community side hvor man kan ved hjælp af Discord OAuth2 lave private Discord servere hvor man kan vælge hvilke klasser/grupper/klubber der kan være med eller hele skolen om hele skolen kan være med (Discord OAuth2, database)
   - IDÉ - Man kan højre klikke på en anden bruger og så kommer der en popup lidt som på Discord hvor der står en status som er om de har fri eller om de har time og hvilken time de har og med en knap til at skrive til dem osv.

4. fravær side
   - få grafen til at loade på første pageload

5. beskeder side
   - IDÉ - :emojis: (UI)

6. features
   - Tilføj alerts fra daisy ui i alert.js (UI)

7. bugs
   - Når man kigger på en side og man så får login siden skal man når man har logget ind blive redirected til den side man originalt var på (client side)

8. dokumentation
   - lav en dokumentation (UI)
   - lav en help side (UI)
   - lav en about side (UI)
