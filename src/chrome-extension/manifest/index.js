import fs from 'fs'
import path from 'path'
// import chokidar from 'chokidar'
import rimraf from 'rimraf';
import mkdirp from 'mkdirp'

import processors from './processors'
import * as log from './log'

export default class Manifest {
  constructor(options) {
    this.path  = options.manifest
    this.src   = path.dirname(this.path)
    this.buildPath = options.output
  }

  run() {
    this.prepareBuildDir()
    this.processManifest()
    this.writeManifest()
  }

  // watch() {
  //   chokidar.watch(this.path).on('change', this.onChange)
  // }

  // onChange = (event, path) => {
  //   this.processManifest()
  // }

  prepareBuildDir() {
    // Prepare clear build
    rimraf.sync(this.buildPath)
    fs.mkdirSync(this.buildPath)
  }

  writeManifest() {
    const manifestPath = path.join(this.buildPath, "manifest.json");
    log.pending(`Making 'build/manifest.json'`)
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2), {encoding: 'utf8'})
    log.done()
  }

  loadManifest() {
    return JSON.parse(fs.readFileSync(this.path, 'utf8'))
  }

  processManifest() {
    this.scripts = []
    this.manifest = this.loadManifest()

    // Iterate over each processor and process manifest with it
    processors.forEach((processor) => {
      this.applyProcessorResult(
        processor(this.manifest, this)
      )
    })

    return true
  }

  applyProcessorResult({manifest, scripts} = {}) {
    if(manifest)
      this.manifest = manifest

    if(scripts) {
      // TODO validace na skripty
      // const pushScriptName = function(scriptName) {
      //   const scriptPath = path.join(paths.src, scriptName)
      //
      //   if(!fs.existsSync(scriptPath)) {
      //     console.warn(colorred(`Missing script ${scriptPath}`))
      //
      //     return
      //   }
      //
      //   if(~scripts.indexOf(scriptName))
      //     return
      //
      //   scripts.push(scriptName)
      // }

      scripts.forEach((script) => {
        this.scripts.push(script)
      })
    }
  }
}
