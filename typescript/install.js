/**
 * Quasar App Extension install script
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */

module.exports = function (api) {
  api.render('./templates', {}, true)
  if (api.prompts.installType === 'full') {
    api.render('./full', {}, true)
    console.log('here we would move component stuff over.')
  }
}
