// The IPC implementation is split into two separate files:
// one consumed by the main process build, and another by the renderer.
// This way dependencies which only work in the main process won't be bundled into the renderer.
import { ipcMain } from 'electron';

import runInference from '../inference';

// To expose a function via the `window.ipc` object in the renderer process:
// 1. Ensure it returns a promise (otherwise typings will be incorrect).
// 2. Add it to the object below.
// 3. Add its name to the corresponding object in `ipc/renderer.ts`.
const ipc = { runInference };

declare global {
  interface Window {
    ipc: typeof ipc;
  }
}

// Must be called from the main process.
export default function setupIpcMain() {
  for (const [name, func] of Object.entries(ipc)) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    ipcMain.handle(name, (_event, ...args) => (func as Function)(...args));
  }
}
