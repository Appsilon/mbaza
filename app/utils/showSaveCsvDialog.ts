import format from 'date-fns/format';
import { remote } from 'electron';
import { join } from 'path';

export default async function showSaveCsvDialog(name: string): Promise<string | undefined> {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH:mm:ss');
  const filename = `${name}_${timestamp}.csv`;
  const defaultPath = join(remote.app.getPath('documents'), filename);
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
