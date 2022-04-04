# Mbaza

[![DOI:10.1101/2020.09.12.294538](https://zenodo.org/badge/DOI/10.1101/2020.09.12.294538.svg)](https://doi.org/10.1101/2020.09.12.294538)

A desktop application that allows bioconservation researchers to classify camera trap animal images and analyze the results.

### Useful files

* [Windows installer](https://github.com/Appsilon/mbaza/releases/download/v1.3.1/Mbaza.AI.Setup.1.3.1.exe) (v1.3.1)
* [Models zip](https://drive.google.com/file/d/14piQssz64jlgS31FtMy9x0L3soJAiZ5T/view?usp=sharing) (v1.3.0)
* [User Guide](https://github.com/Appsilon/mbaza/releases/download/v1.2.1/Mbaza.AI.user.guide.v1-2-1.EN.pdf)
  / [Mode d’emploi](https://github.com/Appsilon/mbaza/releases/download/v1.2.1/Mbaza.AI.user.guide.v1-2-1.FR.pdf) (v1.2.1)

## Maintainers

- [Marek Rogala](https://github.com/marekrogala)
- [Kamil Żyła](https://github.com/kamilzyla)
- [Tomasz Dziopa](https://github.com/tomecki)
- [Wojciech Dziwulski](https://github.com/wojdziw)

## Development

### Basic information

- We're using Electron. The app is based on https://github.com/electron-react-boilerplate/electron-react-boilerplate], which internally uses https://github.com/electron-userland/electron-builder.
- Useful files (sample data, biomonitoring stations, icons) can be found on our [Drive](https://drive.google.com/drive/folders/1eQWuf5WCT429xogQ2HiZqapehvweAtxP) (Appsilon internal).

### Dev environment setup

- Install Yarn (on Ubuntu: https://linuxize.com/post/how-to-install-yarn-on-ubuntu-18-04/) -- for node packages management, we will use https://yarnpkg.com/. This is recommended by Electron Builder (npm can lead to errors).
- Editor configuration: https://electron-react-boilerplate.js.org/docs/editor-configuration
- To test on Windows use virtual machine image from https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/ (install VirtualBox 6 on Ubuntu following this guide: https://tecadmin.net/install-virtualbox-on-ubuntu-18-04/)

### Linting

We check for appropriate linting before each commit. You will be able to fix some lint errors automatically using `yarn lint-fix`.

### Running the app

- `yarn` installs dependencies.
- `yarn dev` runs the app in development mode (with developer tools, hot swapping, ...).
- `yarn start` runs the app in production mode (bundled and optimized).

Prepend `yarn cross-env DEBUG_PROD=true` to a command to enable debugging in production.
For example: `yarn cross-env DEBUG_PROD=true yarn package`.

### Packaging for production

`yarn package` packages the app for install. We run it with GitHub actions and store artifacts, so you can simply download an artifact from there.
Model packaging: go to `models_runner` and follow the README there (both for Windows and Linux).

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
