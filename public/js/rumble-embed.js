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

const RumbleEmbed = Extension.create({
  name: 'rumbleEmbed',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            paste: (view, event) => {
              const url = event.clipboardData.getData('Text');
              if (this.isRumbleUrl(url)) {
                const videoId = this.extractVideoId(url);
                if (videoId) {
                  const embedUrl = `https://rumble.com/embed/${videoId}`;
                  const transaction = view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.embed.create({ src: embedUrl })
                  );
                  view.dispatch(transaction);
                  return true;
                }
              }
              return false;
            },
            drop: (view, event) => {
              const url = event.dataTransfer.getData('Text');
              if (this.isRumbleUrl(url)) {
                const videoId = this.extractVideoId(url);
                if (videoId) {
                  const embedUrl = `https://rumble.com/embed/${videoId}`;
                  const transaction = view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.embed.create({ src: embedUrl })
                  );
                  view.dispatch(transaction);
                  return true;
                }
              }
              return false;
            }
          }
        }
      })
    ]
  },

  isRumbleUrl(url) {
    // Match Rumble URL
    return /rumble\.com\/v\//.test(url);
  },

  extractVideoId(url) {
    const regex = /rumble\.com\/v\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
});

export default RumbleEmbed;