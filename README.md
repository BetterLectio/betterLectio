# BetterLectio NEXT

En bedre Lectio oplevelse!

## Bidrage til projektet

Hvis du vil bidrage til projektet, så er du velkommen til at lave en pull request. Du kan også lave en issue, hvis du har en idé til et feature eller har fundet en bug. Herunder er der en guide til hvordan du sætter et dev environment op.

### Opsætning af Dev Environment

1. Installer [node.js](https://nodejs.org/en/) og [rust](https://www.rust-lang.org/tools/install)
2. Klon dette repo
3. Installer deps (både rust og node)
4. For bedste udviklingsoplevelse, installer [vscode](https://code.visualstudio.com/) og installer anbefalede extensions
5. Åben repoet i vscode
6. Start programmet med `npm run tauri dev` (i terminalen)
7. Husk af skift til dev branchen da main branchen er til releases

### CI/CD info

CI/CD er sat op med github actions. Når der bliver pushed til main branchen, så bliver der automatisk lavet en release. Et nyt commit på dev branchen vil automatisk inkrementelle versionen.

## Support

| OS      | Support |
| ------- | ------- |
| Windows | ✅      |
| MacOS   | ❌      |
| Linux   | ❌      |
| Web     | ❌      |

# TODO

- [x] Login
- [ ] Skema
- [x] Opgaver
- [ ] Opgave aflevering
- [ ] Noter
- [x] Beskeder
- [ ] Besked
