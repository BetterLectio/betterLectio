<img src="https://github.com/BetterLectio/betterLectio/blob/main/banner.png?raw=true">

[![Version](https://img.shields.io/github/v/release/BetterLectio/betterlectio?style=for-the-badge)]()
[![GitHub Downloads](https://img.shields.io/github/downloads/BetterLectio/betterlectio/total?style=for-the-badge)]()
[![Issues](https://img.shields.io/github/issues/BetterLectio/betterlectio?style=for-the-badge)]()
[![LICENSE](https://img.shields.io/github/license/BetterLectio/betterlectio?style=for-the-badge)]()

# BetterLectio

Velkommen til BetterLectios mono-repo. Her finder du alt vores kode, som vi har lavet til BetterLectio.
Det inkludere vores API, vores hjemmeside og alt det andet som får det hele til at spille sammen.

## Lectio REST API

_dokumentationen følger snart_

## Sync server og OAuth server

Aka: [auth.betterlectio.dk](https://auth.betterlectio.dk)

Denne server bruges til at auth brugere med google (serverside) så de ikke behøver at logge ind hver gang de ønsker at synkronisere deres kalender. denne server bruges også til at synkronisere kalendere med lectio. og vigtigst af alt så holder denne server den nyeste version af appen så klienterne ved hvornår de skal opdatere.

## Hjemmeside

Hjemmesiden er lavet i SvelteKit og er hostet i Søborg i en docker container på en server. den bruger Shadcn-svelte som UI framework og er skrevet i TypeScript.

[Node.js](https://nodejs.org/en/)

## App (Android og Desktop)

Appen bruger samme kodebase som hjemmesiden men er pakket i en Android app og en desktop app. dette er opnået ved hjælp af Tauri 2.0 som er et rust framework til at lave desktop apps med web teknologier.

Hvis du vil udvikle på appen så skal du installere Rust (og android studio hvis du vil udvikle til android) og så køre `npm run dev` i `apps/frontend` mappen.

[rust](https://www.rust-lang.org/tools/install)  
[android studio](https://developer.android.com/studio)

## Hvordan kan jeg hjælpe?

Følg denne guide for at komme i gang med at bidrage til projektet.
[se wikien](https://github.com/BetterLectio/betterLectio/wiki)
