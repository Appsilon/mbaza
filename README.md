# Mbaza

[![DOI:10.1101/2020.09.12.294538](https://zenodo.org/badge/DOI/10.1101/2020.09.12.294538.svg)](https://doi.org/10.1101/2020.09.12.294538)

A desktop application which allows bioconservation researchers
to classify camera trap animal images and analyze the results.

### Installation

Download Mbaza installer for your system:
* [Windows](https://github.com/Appsilon/mbaza/releases/download/v2.1.0/Mbaza.AI.Setup.2.1.0.exe)
* [macOS x86-64 (Intel)](https://github.com/Appsilon/mbaza/releases/download/v2.1.0/Mbaza.AI-2.1.0-mac.zip)
* [macOS ARM64 (Apple M1)](https://github.com/Appsilon/mbaza/releases/download/v2.1.0/Mbaza.AI-2.1.0-arm64-mac.zip)
* [Linux](https://github.com/Appsilon/mbaza/releases/download/v2.1.0/Mbaza.AI-2.1.0.AppImage)

### macOS

By default macOS doesn't allow running app files downloaded from the Internet
and it will display a "file is damaged" error.
To fix it:
1. Extract the app from the ZIP archive.
2. Open a terminal in the directory with the extracted app.
3. Run the following command: `xattr -cr 'Mbaza AI.app'`.

### Links

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
can be found on our Drive (Appsilon-internal; see bookmarks on the Slack channel)

To be able to run inference,
download the ONNX models and place them in the `assets/models` directory:
* [Central African forests](https://drive.google.com/uc?export=download&id=1HHmUdq5kUib2e05YgtBQGyS-146-Q5S5)
* [East African savannas](https://drive.google.com/uc?export=download&id=1UeJ4nIv_uORhmYqRGAKRjmcG39gTcBKn)
* [Ol Pejeta](https://drive.google.com/uc?export=download&id=1YpRLde9t2OL-60a0M3vNeoem5tK6JjXJ)

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
    3. The app can handle our sample data.
5. The code adheres to the [Airbnb style guide](https://github.com/airbnb/javascript).
