// Refer to `ipc/main.ts` for explanation of this file.
import { ipcRenderer } from 'electron';

const ipc = ['createThumbnail', 'runInference'];

function ipcStub(name: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => ipcRenderer.invoke(name, ...args);
}

// Must be called from the renderer process in the preload script.
export default function setupIpcRenderer() {
  const stubs = ipc.map((name) => [name, ipcStub(name)]);
  window.ipc = Object.fromEntries(stubs);
}
