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

const FontFamily = Extension.create({
  name: 'fontFamily',

  addCommands() {
    return {
      setFontFamily: (font) => ({ chain }) => {
        return chain().setMark('textStyle', { fontFamily: font }).run();
      },
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: null,
            rendered: false,
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    return [];
  }
});

export default FontFamily;