/**
 * NextBoard - A Modern Bulletin Board System
 * "Where discussions take the next step."
 * 
 * Author: Sam Wilcox
 * Email: sam@nextboard.org
 * Website: https://www.nextboard.org
 * GitHub: https://github.com/samwilcox/nextboard
 * 
 * License: GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
 * For full license details, visit: https://license.nextboard.org
 */

import { Extension } from 'https://cdn.jsdelivr.net/npm/@tiptap/core@2.11.5/+esm';
import { Plugin } from 'https://cdn.jsdelivr.net/npm/prosemirror-state@1.4.2/+esm';

const VimeoEmbed = Extension.create({
    name: 'vimeoEmbed',
  
    addProseMirrorPlugins() {
      return [
        new Plugin({
          props: {
            handleDOMEvents: {
              paste: (view, event) => {
                const url = event.clipboardData.getData('Text')
                if (this.isVimeoUrl(url)) {
                  const videoId = this.extractVideoId(url)
                  if (videoId) {
                    const embedUrl = `https://player.vimeo.com/video/${videoId}`
                    const transaction = view.state.tr.replaceSelectionWith(
                      schema.nodes.embed.create({ src: embedUrl })
                    )
                    view.dispatch(transaction)
                    return true
                  }
                }
                return false
              },
            },
          },
        }),
      ]
    },
  
    isVimeoUrl(url) {
      return /vimeo\.com/.test(url)
    },
  
    extractVideoId(url) {
      const regex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:[a-zA-Z0-9]+\/)?(\d+)/
      const match = url.match(regex)
      return match ? match[1] : null
    },
  })
  
  export default VimeoEmbed