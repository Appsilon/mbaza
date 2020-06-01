# Wildlife Explorer

A desktop application that allows bioconservation researchers to classify camera trap animal images and analyze the results.

The application is multi-platform. We support MacOS, Linux and Windows 10. Primary focus is on Windows 10.

## Maintainers

- [Marek Rogala](https://github.com/marekrogala)
- [Tomasz Dziopa](https://github.com/tomecki)
- [Wojciech Dziwulski](https://github.com/wojdziw)

## Development

### Basic information

- We're using Electron. The app is based on https://github.com/electron-react-boilerplate/electron-react-boilerplate], which internally uses https://github.com/electron-userland/electron-builder.

### Dev environment setup

- Install Yarn (on Ubuntu: https://linuxize.com/post/how-to-install-yarn-on-ubuntu-18-04/) -- for node packages management, we will use https://yarnpkg.com/. This is recommended by Electron Builder (npm can lead to errors).
- Editor configuration: https://electron-react-boilerplate.js.org/docs/editor-configuration
- To test on Windows use virtual machine image from https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/ (install VirtualBox 6 on Ubuntu following this guide: https://tecadmin.net/install-virtualbox-on-ubuntu-18-04/)

### Linting

We check for appropriate linting before each commit. You will be able to fix some lint errors automatically using `yarn lint-fix`.

### Running the app

- `yarn` installs dependencies
- `yarn dev` runs the app
- `yarn test` tests the app

### Packaging for production

`yarn package` packages the app for install. We run it with GitHub actions and store artifacts, so you can simply download an artifact from there.
Model packaging: go to `models_runner` and follow the README there (both for Windows and Linux).

## License

TO BE DEFINED ~MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)~
