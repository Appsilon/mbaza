# Mbaza

[![DOI:10.1101/2020.09.12.294538](https://zenodo.org/badge/DOI/10.1101/2020.09.12.294538.svg)](https://doi.org/10.1101/2020.09.12.294538)

A desktop application which allows bioconservation researchers
to classify camera trap animal images and analyze the results.

## Installation

Visit the [latest release page](https://github.com/Appsilon/mbaza/releases/latest)
and download Mbaza installer for your system
(`X.Y.Z` will be the version number, e.g. `2.0.0`):
* Windows: `Mbaza.AI.Setup.X.Y.Z.exe`
* Linux: `Mbaza.AI-X.Y.Z.AppImage`
* macOS:
    * :warning: Mbaza requires additional setup to run on macOS. Read the instructions below.
    * x86-64 (Intel): `Mbaza.AI-X.Y.Z-mac.zip`
    * ARM64 (Apple M1): `Mbaza.AI-X.Y.Z-arm64-mac.zip`

### macOS

By default macOS doesn't allow running app files downloaded from the Internet
and it will display a "file is damaged" error.
To fix it:
1. Extract the app from the ZIP archive.
2. Open a terminal in the directory with the extracted app.
3. Run the following command: `xattr -cr 'Mbaza AI.app'`.

## Links

* [Landing page](https://appsilon.com/data-for-good/mbaza-ai/):
information, testimonials, news.
* [User guide](https://github.com/Appsilon/mbaza/releases/download/v1.2.1/Mbaza.AI.user.guide.v1-2-1.EN.pdf)
/ [Mode d’emploi](https://github.com/Appsilon/mbaza/releases/download/v1.2.1/Mbaza.AI.user.guide.v1-2-1.FR.pdf) (v1.2.1)

## Development

If you are seeking to get involved in the development of Mbaza,
take a look at our [contributing guidelines](CONTRIBUTING.md).
There you'll find useful technical information about
app architecture, ML models, `npm` commands, release process, and more.

## License

AGPLv3
