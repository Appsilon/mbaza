import format from 'date-fns/format';
import { join } from 'path';

const remote = require('@electron/remote');

const csvFilters = [
  { name: 'CSV', extensions: ['csv'] },
  { name: 'All Files', extensions: ['*'] }
];

export async function openCsvDialog(): Promise<string | undefined> {
  const dialog = await remote.dialog.showOpenDialog({
    properties: ['openFile'],
    filters: csvFilters
  });
  if (!dialog.canceled) {
    return dialog.filePaths[0];
  }
  return undefined;
}

export async function saveCsvDialog(name: string): Promise<string | undefined> {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  const filename = `${name}_${timestamp}.csv`;
  const defaultPath = join(remote.app.getPath('documents'), filename);
  const dialog = await remote.dialog.showSaveDialog({
    defaultPath,
    filters: csvFilters
  });
  if (!dialog.canceled) {
    return dialog.filePath;
  }
  return undefined;
}

export async function openDirectoryDialog(): Promise<string | undefined> {
  const dialog = await remote.dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (!dialog.canceled) {
    return dialog.filePaths[0];
  }
  return undefined;
}
