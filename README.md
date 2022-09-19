# Mbaza

[![DOI:10.1101/2020.09.12.294538](https://zenodo.org/badge/DOI/10.1101/2020.09.12.294538.svg)](https://doi.org/10.1101/2020.09.12.294538)

A desktop application that allows bioconservation researchers
to classify camera trap animal images and analyze the results.

Application landing page: https://appsilon.com/data-for-good/mbaza-ai/

### Useful files

* [Windows installer](https://github.com/Appsilon/mbaza/releases/download/v1.3.1/Mbaza.AI.Setup.1.3.1.exe) (v1.3.1)
* [User Guide](https://github.com/Appsilon/mbaza/releases/download/v1.2.1/Mbaza.AI.user.guide.v1-2-1.EN.pdf)
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
    2. Installed app works well on Windows and Linux.
    3. The app can handle sample data available on our
    [Drive](https://drive.google.com/drive/folders/1eQWuf5WCT429xogQ2HiZqapehvweAtxP).
5. The code adheres to
[Airbnb style guide](https://github.com/airbnb/javascript) for JavaScript code
and to [PEP 8](https://www.python.org/dev/peps/pep-0008/) for Python.
