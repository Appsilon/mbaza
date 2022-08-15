/* eslint jest/expect-expect: off, jest/no-test-callback: off */
import { ClientFunction, Selector } from 'testcafe';

const getPageTitle = ClientFunction(() => document.title);
const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages();
  await t.expect(error).eql([]);
};

fixture`Home Page`.page('../../app/app.html').afterEach(assertNoConsoleErrors);

test('e2e', async t => {
  await t.expect(getPageTitle()).eql('Hello Electron React!');
});

test('should open window and contain expected page title', async t => {
  await t.expect(getPageTitle()).eql('Hello Electron React!');
});

test('should not have any logs in console of main window', assertNoConsoleErrors);

test('should back to home if back button clicked', async t => {
  await t
    .click('[data-tid="backButton"] > a')
    .expect(Selector('[data-tid="container"]').visible)
    .ok();
});
