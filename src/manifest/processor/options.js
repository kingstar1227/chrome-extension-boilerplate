import html from './lib/html'

export default function(manifest, {buildPath}) {
  const {options_page} = manifest

  // Skip when there is no options_page property
  if(!options_page)
    return

  const scripts = []

  // options page
  scripts.push(html(options_page, buildPath))

  return {manifest, scripts}
}
