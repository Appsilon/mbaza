# Mbaza

[![DOI:10.1101/2020.09.12.294538](https://zenodo.org/badge/DOI/10.1101/2020.09.12.294538.svg)](https://doi.org/10.1101/2020.09.12.294538)

A desktop application which allows bioconservation researchers
to classify camera trap animal images and analyze the results.

### Links

* [Latest release](https://github.com/Appsilon/mbaza/releases/latest): installers for
    * [Windows](https://github.com/Appsilon/mbaza/releases/download/v2.0.0/Mbaza.AI.Setup.2.0.0.exe)
    * [macOS](https://github.com/Appsilon/mbaza/releases/download/v2.0.0/Mbaza.AI-2.0.0-arm64.dmg)
    * [Linux](https://github.com/Appsilon/mbaza/releases/download/v2.0.0/Mbaza.AI-2.0.0.AppImage)
* [Landing page](https://appsilon.com/data-for-good/mbaza-ai/):
information, testimonials, news.
* [User guide](https://github.com/Appsilon/mbaza/releases/download/v1.2.1/Mbaza.AI.user.guide.v1-2-1.EN.pdf)
/ [Mode d’emploi](https://github.com/Appsilon/mbaza/releases/download/v1.2.1/Mbaza.AI.user.guide.v1-2-1.FR.pdf) (v1.2.1)

## Development

Mbaza is based on [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate),
which uses
[Electron](https://electron.atom.io/),
[React](https://facebook.github.io/react/),
[React Router](https://github.com/reactjs/react-router),
[Webpack](https://webpack.js.org/),
[React Fast Refresh](https://www.npmjs.com/package/react-refresh).

Useful files (sample data, biomonitoring stations, icons)
can be found on our [Drive](https://drive.google.com/drive/folders/1eQWuf5WCT429xogQ2HiZqapehvweAtxP) (Appsilon internal).

To be able to run inference,
download the ONNX models and place them in the `assets/models` directory:
* [Central African forests](https://drive.google.com/uc?export=download&id=1HHmUdq5kUib2e05YgtBQGyS-146-Q5S5)
* [East African savannas](https://drive.google.com/uc?export=download&id=1UeJ4nIv_uORhmYqRGAKRjmcG39gTcBKn)

### Commands

You can run the following commands from the project root.
You'll need [Node.js](https://nodejs.org/en/) 16 or later on your system.

* `npm install`: Install dependencies.
* `npm start`: Start the app in development mode.
* `npm run lint`: Lint sources.
* `npm run lint -- --fix`: Lint sources and fix errors automatically.
* `npm run package`: Package the app for the local platform.
* `npx cross-env DEBUG_PROD=true npm run package`: Package the app with developer tools enabled.

## License

AGPLv3

## Definition of Done

1. All changes are introduced in pull requests,
which must be peer-reviewed before being merged.
2. Tasks, design decisions, etc. are described in GitHub issues and pull requests.
3. README and code comments are updated.
4. Changes are tested (manually or with automated tests):
    1. No existing functionality is broken.
    2. Installed app works well on all systems.
    3. The app can handle sample data available on our
    [Drive](https://drive.google.com/drive/folders/1eQWuf5WCT429xogQ2HiZqapehvweAtxP).
5. The code adheres to the [Airbnb style guide](https://github.com/airbnb/javascript).
