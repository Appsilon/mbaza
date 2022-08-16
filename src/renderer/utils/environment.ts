import path from 'path';

const remote = require('@electron/remote');

export const isDev = process.env.NODE_ENV === 'development';
export const isWin = !isDev && process.platform === 'win32';
export const isLinux = !isDev && process.platform === 'linux';

function getUserDataPath() {
  if (isDev) {
    return path.resolve('.');
  }
  return remote.app.getPath('userData');
}

export const userDataPath = getUserDataPath();
export const rootModelsDirectory = path.join(userDataPath, 'models');
