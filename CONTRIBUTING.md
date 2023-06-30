# Development

Mbaza is based on [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate),
which uses
[Electron](https://electron.atom.io/),
[React](https://facebook.github.io/react/),
[React Router](https://github.com/reactjs/react-router),
[Webpack](https://webpack.js.org/),
[React Fast Refresh](https://www.npmjs.com/package/react-refresh).

Useful files (sample data, biomonitoring stations, icons)
can be found on our Drive (Appsilon-internal; see bookmarks on the Slack channel)

## Models

To run inference in development mode (`npm start`) or to build the installers (`npm run package`),
you will need to download the ONNX models and place them in the `assets/models` directory:
* [Central African forests (Gabon)](https://drive.google.com/uc?export=download&id=1HHmUdq5kUib2e05YgtBQGyS-146-Q5S5)
* [East African savannas (Serengeti)](https://drive.google.com/uc?export=download&id=1UeJ4nIv_uORhmYqRGAKRjmcG39gTcBKn)
* [East African savannas (Ol Pejeta Conservancy)](https://drive.google.com/uc?export=download&id=1YpRLde9t2OL-60a0M3vNeoem5tK6JjXJ)

The model file names should match the entries in `src/common/models.ts`.

## Commands

You can run the following commands from the project root.
You'll need [Node.js](https://nodejs.org/en/) 16 or later on your system.

* `npm install`: Install dependencies.
* `npm start`: Start the app in development mode.
* `npm run lint`: Lint sources.
* `npm run lint -- --fix`: Lint sources and fix errors automatically.
* `npm run package`: Package the app for the local platform.
* `npx cross-env DEBUG_PROD=true npm run package`: Package the app with developer tools enabled.

## Release instructions

1. Choose a new version number according to [SemVer](https://semver.org/).
2. Update the version in the repo:
    1. Edit the `release/app/package.json` file.
    2. Update `release/app/package-lock.json` by running `npm install` in the project root.
    3. Make sure these changes are on the `main` branch before proceeding.
3. [Create a new release](https://github.com/Appsilon/mbaza/releases/new) on GitHub.
4. Build installers for the 3 operating systems:
    1. Each one needs to be built on the target system.
    2. Download the models and put them in the `assets/models` directory
    (refer to the [Models](#models) section above).
    3. Run `npm install` followed by `npm run package`.
    4. The installer will be placed in the `release/build` directory.
5. Sign the Windows installer using the code signing certificate stored in our 1Password.
6. Upload the installers to the release.

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
