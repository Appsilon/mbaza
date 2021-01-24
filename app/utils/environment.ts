import path from 'path';

export const isDev = process.env.NODE_ENV === 'development';
export const isWin = !isDev && process.platform === 'win32';
export const isLinux = !isDev && process.platform === 'linux';

function getUserDataPath() {
  if (isDev) {
    return path.resolve('.');
  }
  // eslint-disable-next-line global-require
  const { app } = require('electron').remote;
  return app.getPath('userData');
}

export const rootModelsDirectory = path.join(getUserDataPath(), 'models');
