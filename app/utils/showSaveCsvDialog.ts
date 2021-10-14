import { join } from 'path';
import { remote } from 'electron';

export default async function showSaveCsvDialog(
  defaultFilaneme: string
): Promise<string | undefined> {
  const defaultPath = join(remote.app.getPath('documents'), defaultFilaneme);
  const dialog = await remote.dialog.showSaveDialog({
    defaultPath,
    filters: [
      { name: 'CSV', extensions: ['csv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (!dialog.canceled) {
    return dialog.filePath;
  }
  return undefined;
}
