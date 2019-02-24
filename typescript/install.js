/**
 * Quasar App Extension install script
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */

module.exports = api =>
  new Promise(resolve => {
    api.render('./templates/base', {}, true)
    if (api.prompts.rename) {
      const glob = require('glob')
      const fs = require('fs')
      const path = require('path')

      const quasarConfigPath = api.resolve.app('./quasar.conf.js')
      const replaceRegex = /module\.exports = function \((ctx)?\) {\n\s*return {/
      let quasarConfig = fs.readFileSync(quasarConfigPath, 'utf8')
      if (!replaceRegex.test(quasarConfig)) {
        // TODO: better formatting
        console.log(`Could not automatically update your quasar.conf.js to use typescript. Please add this to your quasar.conf.js: \n// Quasar looks for *.js files by default
sourceFiles: {
  router: 'src/router/index.ts',
  store: 'src/store/index.ts'
}\n`)
      }
      quasarConfig = quasarConfig.replace(
        replaceRegex,
        `module.exports = function (ctx) {
  return {
    // Quasar looks for *.js files by default
    sourceFiles: {
      router: 'src/router/index.ts',
      store: 'src/store/index.ts'
    },`
      )
      fs.writeFileSync(quasarConfigPath, quasarConfig)

      glob(api.resolve.app('src/**/*.js'), (err, files) => {
        if (err) throw err
        files.forEach(file => {
          const newFile = path.parse(file)
          newFile.ext = '.ts'
          delete newFile.base
          fs.renameSync(file, path.format(newFile))
        })
        glob(api.resolve.app('src/**/*.vue'), (err, files) => {
          if (err) throw err
          files.forEach(file => {
            let text = fs.readFileSync(file, 'utf8')
            text = text.replace(/<script.*(lang=".{4}")?.*>/, tag => {
              tag = tag.replace(/lang="js" ?/, '')
              return tag.replace('<script', '<script lang="ts"')
            })
            fs.writeFileSync(file, text)
          })
          resolve()
        })
      })
    }
  })
