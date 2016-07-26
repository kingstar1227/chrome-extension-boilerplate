import SingleEntryPlugin from "webpack/lib/SingleEntryPlugin"
import MultiEntryPlugin from "webpack/lib/MultiEntryPlugin"
import * as Remove from '../remove'

export default class ManifestPlugin {
  constructor(Manifest, isDevelopment) {
    this.Manifest = Manifest
    this.isDevelopment = typeof(isDevelopment) == "undefined" ? true : isDevelopment
  }

  apply(compiler) {
    this.Manifest.run()

    this.Manifest.scripts.forEach((script) => {
      // name
      const name = Remove.extension(script)

      // item
      let item
      if(this.isDevelopment) {
        item = [
          'webpack-dev-server/client?https://localhost:3001',
          'webpack/hot/only-dev-server',
          script
        ]
      } else {
        item = script
      }

      const entryClass = this.itemToPlugin(item, name)

      compiler.apply(entryClass)
    })
  }

  itemToPlugin(item, name) {
    if(Array.isArray(item)) {
      return new MultiEntryPlugin(null, item, name);
    } else {
      return new SingleEntryPlugin(null, item, name);
    }
  }
}
