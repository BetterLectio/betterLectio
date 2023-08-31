[![Netlify Status](https://api.netlify.com/api/v1/badges/fe2851de-234e-4d0b-864e-25827514c5a5/deploy-status)](https://app.netlify.com/sites/betlec/deploys)
<img src="https://badgen.net/github/release/BetterLectio/betterlectio" />
![GitHub issues](https://img.shields.io/github/issues-raw/victorDigital/betterLectio)
[![Known Vulnerabilities](https://snyk.io/test/github/BetterLectio/betterLectio/badge.svg)](https://snyk.io/test/github/BetterLectio/betterLectio)

<p align="center">
<a href="https://www.netlify.com"> <img src="https://www.netlify.com/v3/img/components/netlify-light.svg" alt="Deploys by Netlify" /> </a>
</p>

# BetterLectio

BetterLectio er en forbredelse af [Lectio](https://lectio.dk).

Lectio er et dansk webbaseret lektionssystem udviklet af det danske softwarefirma MaCom A/S. 

BetterLectio er et hobbyprojekt der gør det nemmere at bruge og navigere Lectio.

Vi har fokuseret på at gøre det nemmere at finde informationer, og at gøre det nemmere at få overblik over sin skolegang. og vi har lavet en række andre forbedringer som f.eks. at lave en hel ny brugerflade, som både er mere brugervenlig og mere moderne.

BetterLectio er open-source og under aktiv udvikling, og er ikke helt i mål endnu. Derfor hvis du har nogle fede ideér, forslag og forbedringer, så skriv ind med et issue eller åben en pull request.

## Lavet af [os](https://github.com/victorDigital/betterLectio/graphs/contributors)

<a href="https://github.com/BetterLectio/betterlectio/graphs/contributors">
<img src="https://contrib.rocks/image?repo=BetterLectio/betterlectio" />
</a>

---

### Appen er tilgængelig på [betterlectio.dk](https://betterlectio.dk)

### Vores development-miljø er tilgængelig på [dev--betlec.netlify.app](https://dev--betlec.netlify.app/)

<br/>

<details>

<summary>Browser support</summary>

| Chrome | Firefox | Safari | Edge  | Opera |
| :----: | :-----: | :----: | :---: | :---: |
|   ✅    |    ✅    |   ⚠️    |   ✅   |   ✅   |

</details>

<br/>

<details>

<summary>OS support</summary>

| Windows | Mac OS | Linux |       IOS       | Android |
| :-----: | :----: | :---: | :-------------: | :-----: |
|    ✅    |   ✅    |   ✅   | ⚠️ få bugs (PWA) | ✅ (PWA) |

</details>

<br/>

## Work-in-progress

1. Opgaveside

 - [ ] Hvis det er en gruppeopgave, så skal der være en liste over alle gruppemedlemmer og man skal kunne vælge personer fra listen (API) (UI)
 - [ ] Der kan være en måde at uploade filer på (UI) (API)
 - [ ] Der skal være en måde at skrive beskeder på (UI) (API)

1. Skemaside

 - [ ] Kunne skifte til sit ejet skema fra andres (UI)
 - [x] Se skema for lokaler (API) (UI)

2. Værktøjsside (nyttige værktøjer til brugeren)

 - Hvornår møder jeg samme tid / tag hjem som min klassekammerat (elev id / elev navn) (client side med callback til server) (API)
 - [ ] Idé - hvor mange dage til næste prøve (API)
 - [x] Idé - hvor mange moduler kan jeg i teorien pjække før jeg får x% fravær (client side med callback til server) (brug data fra fravær side)
 - Idé - skole community side hvor man kan ved hjælp af Discord OAuth2 lave private Discord servere hvor man kan vælge hvilke klasser/grupper/klubber der kan være med eller hele skolen om hele skolen kan være med (Discord OAuth2, database)
 - [x] Idé - ,an kan højre klikke på en anden bruger og så kommer der en popup lidt som på Discord hvor der står en status som er om de har fri eller om de har time og hvilken time de har og med en knap til at skrive til dem osv.

3. Fraværsside

 - [x] Få grafen til at loade på første pageload

4. Besked-side

 - [ ] Idé - :emojis: (UI)

5. Lektier

 - [ ] Man skal kunne strege sine lektier over

6. Karakterer

 - [ ] Lav standpunkt og årskarakterer

7. Features

 - [ ] Tilføj alerts fra daisyUI i alert.js (UI)

8. Bugs

 - [x] Når man kigger på en side og man så får login siden skal man når man har logget ind blive redirected til den side man originalt var på (client side)

9. Dokumentation

 - [x] Lav dokumentation (UI)
 - [x] Lav en Help side (UI)
 - [ ] Lav en About side (UI)
