export default function showSaveCsvDialog(
  defaultFilaneme: string,
  callback: (path: string) => void
) {
  // eslint-disable-next-line global-require
  const { dialog, app } = require('electron').remote;
  dialog
    .showSaveDialog({
      defaultPath: `${app.getPath('documents')}/${defaultFilaneme}`,
      filters: [
        { name: 'CSV', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    .then(result => {
      if (!result.canceled) {
        // eslint-disable-next-line promise/no-callback-in-promise
        callback(result.filePath || '');
      }
      return null;
    })
    .catch(error => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
}
