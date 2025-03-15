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

import { Editor, Extension, Mark, mergeAttributes } from 'https://esm.sh/@tiptap/core'
import StarterKit from 'https://esm.sh/@tiptap/starter-kit'
import Underline from 'https://esm.sh/@tiptap/extension-underline'
import YouTube from 'https://esm.sh/@tiptap/extension-youtube'
import TextStyle from 'https://esm.sh/@tiptap/extension-text-style'
import FontFamily from 'https://esm.sh/@tiptap/extension-font-family'
import FontSize from 'https://esm.sh/@tiptap/extension-font-size'
import Link from 'https://esm.sh/@tiptap/extension-link'
import Subscript from 'https://esm.sh/@tiptap/extension-subscript'
import Superscript from 'https://esm.sh/@tiptap/extension-superscript'
import Image from 'https://esm.sh/@tiptap/extension-image'
import { Color } from 'https://esm.sh/@tiptap/extension-color'
import TextAlign from 'https://esm.sh/@tiptap/extension-text-align'
import { Plugin } from 'https://esm.sh/@tiptap/pm/state';

const editors = {};
const totals = {};

/**
 * Register a new editor.
 * 
 * @param {string} editorId - The editor identifier.
 */
export const registerEditor = (editorId) => {
    if (!editors.hasOwnProperty(editorId)) {
        editors[editorId] = new Editor({
            element: document.querySelector(`#editor-${editorId}`),
            extensions: [
                StarterKit,
                Underline,
                TextStyle,
                FontFamily,
                FontSize,
                Color,
                YouTube,
                RumbleEmbed,
                Link.configure({
                    openOnClick: false,
                    autolink: true,
                    HTMLAttributes: {
                        target: '_blank',
                        rel: "noopener noreferrer",
                    }
                }),
                CustomLink,
                Subscript,
                Superscript,
                TextAlign.configure({
                    types: ['paragraph', 'heading'],
                }),
                CustomImage
            ],
            content: '',
            onUpdate({ editor }) {
                const textContent = editor.getText();
                const words = textContent.split(/\s+/).filter(Boolean);

                if (!totals[editorId]) {
                    totals[editorId] = { words: 0, characters: 0 };
                }

                totals[editorId].words = words.length.toLocaleString();
                totals[editorId].characters = textContent.replace(/\s+/g, '').length.toLocaleString();

                const wordCountElement = document.getElementById(`editor-${editorId}-word-count`);
                const charCountElement = document.getElementById(`editor-${editorId}-char-count`);

                wordCountElement.innerHTML = totals[editorId].words;
                charCountElement.innerHTML = totals[editorId].characters;
            }
        });

        ['bold', 'italic', 'underline', 'strikethrough'].forEach(action => {
            const button = document.getElementById(`editor-${editorId}-${action}`);
            if (button) {
                button.addEventListener('click', () => {
                    const activeEditor = editors[editorId];
                    if (activeEditor) {
                        activeEditor.chain().focus()[`toggle${action.charAt(0).toUpperCase() + action.slice(1)}`]().run();
                    }
                });
            } else {
                console.warn(`Button not found: #editor-${editorId}-${action}`);
            }
        });

        const fonts = fontFamilies;

        fonts.forEach(font => {
            const fontLink = document.getElementById(`editor-${editorId}-${font.identifier}`);

            if (fontLink) {
                fontLink.addEventListener('click', () => {
                    const activeEditor = editors[editorId];

                    if (activeEditor) {
                        activeEditor.chain().focus().setFontFamily(font.name).run();
                    }
                });
            }
        });

        fontSizes.forEach(size => {
            const sizeLink = document.getElementById(`editor-${editorId}-${size.name}`);

            if (sizeLink) {
                sizeLink.addEventListener('click', () => {
                    const activeEditor = editors[editorId];

                    if (activeEditor) {
                        activeEditor.chain().focus().setFontSize(size.size).run();
                    }
                });
            }
        });

        fontColors.forEach(color => {
            const colorLink = document.getElementById(`editor-${editorId}-${color.identifier}`);

            if (colorLink) {
                colorLink.addEventListener('click', () => {
                    const activeEditor = editors[editorId];

                    if (activeEditor) {
                        activeEditor.chain().focus().setColor(color.hex).run();
                    }
                });
            }
        });

        document.getElementById(`editor-${editorId}-customcolor`).addEventListener('click', () => {
            document.getElementById(`editor-${editorId}-colorpicker`).click();
        });

        document.getElementById(`editor-${editorId}-colorpicker`).addEventListener('change', event => {
            const chosenColor = event.target.value;
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().setColor(chosenColor).run();
            }


        });

        document.getElementById(`editor-${editorId}-orderedlist`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().toggleOrderedList().run();
            }
        });

        document.getElementById(`editor-${editorId}-unorderedlist`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().toggleBulletList().run();
            }
        });

        document.getElementById(`editor-${editorId}-horizontalrule`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().setHorizontalRule().run();
            }
        });

        document.getElementById(`editor-${editorId}-quote`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().toggleBlockquote('<p><br></p>').run();
            }
        });

        document.getElementById(`ddm-editor-${editorId}-hyperlink-button`).addEventListener('click', event => {
            insertHyperlink(
                editorId,
                `ddm-editor-${editorId}-hyperlink-titleinput`,
                `ddm-editor-${editorId}-hyperlink-urlinput`,
                `ddm-editor-${editorId}-hyperlink-select`
            );
        });

        document.getElementById(`editor-${editorId}-inlinecode`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().toggleCode().run();
            }
        });

        document.getElementById(`editor-${editorId}-subscript`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().toggleSubscript().run();
            }
        });

        document.getElementById(`editor-${editorId}-superscript`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().toggleSuperscript().run();
            }
        });

        document.getElementById(`editor-${editorId}-alignleft`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().setTextAlign('left').run();
            }
        });

        document.getElementById(`editor-${editorId}-aligncenter`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().setTextAlign('center').run();
            }
        });

        document.getElementById(`editor-${editorId}-alignright`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().setTextAlign('right').run();
            }
        });

        document.getElementById(`editor-${editorId}-alignjustify`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().setTextAlign('justify').run();
            }
        });

        document.getElementById(`editor-${editorId}-undo`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().undo().run();
            }
        });

        document.getElementById(`editor-${editorId}-redo`).addEventListener('click', () => {
            const activeEditor = editors[editorId];

            if (activeEditor) {
                activeEditor.chain().focus().redo().run();
            }
        });

        document.getElementById(`ddm-editor-${editorId}-insertimage-enablecustomdim`).addEventListener('click', event => {
            const element = event.target;
            const aspectRatio = $(`#ddm-editor-${editorId}-insertimage-grid3`);
            const dimensions = $(`#ddm-editor-${editorId}-insertimage-grid4`);

            if (element) {
                if (element.checked) {
                    aspectRatio.fadeIn();
                    dimensions.fadeIn();
                } else {
                    aspectRatio.fadeOut();
                    dimensions.fadeOut();
                }
            }
        });

        document.getElementById(`ddm-editor-${editorId}-insertimage-maintainar`).addEventListener('click', event => {
            const element = event.target;
            const ratio = $(`#ddm-editor-${editorId}-insertimage-columngrid2`);

            if (element.checked) {
                ratio.fadeIn();
            } else {
                ratio.fadeOut();
            }
        });

        [`ddm-editor-${editorId}-insertimage-widthinput`, `ddm-editor-${editorId}-insertimage-heightinput`].forEach(input => {
            const dimension = document.getElementById(input);

            if (dimension) {
                dimension.addEventListener('focusout', event => {
                    const element = event.target;
                    maintainAspectRatio(element);
                });
            }
        });

        document.getElementById(`ddm-editor-${editorId}-insertimage-button`).addEventListener('click', () => {
            const imageUrl = $(`#ddm-editor-${editorId}-insertimage-urlinput`);
            const customDimensions = $(`#ddm-editor-${editorId}-insertimage-enablecustomdim`);
            const width = $(`#ddm-editor-${editorId}-insertimage-widthinput`);
            const height = $(`#ddm-editor-${editorId}-insertimage-heightinput`);
            const ratio = $(`#ddm-editor-${editorId}-insertimage-columngrid2`);
            const aspectRatio = $(`#ddm-editor-${editorId}-insertimage-grid3`);
            const dimensions = $(`#ddm-editor-${editorId}-insertimage-grid4`);
            const activeEditor = editors[editorId];

            if (activeEditor) {
                if (customDimensions.is(":checked")) {
                    activeEditor.chain().focus().setImage({
                        src: imageUrl.val(),
                        width: width.val(),
                        height: height.val(),
                    }).run();
                } else {
                    activeEditor.chain().focus().setImage({
                        src: imageUrl.val(),
                    }).run();
                }
            }

            resetDropDown();

            imageUrl.val('');
            width.val('');
            height.val('');
            ratio.fadeOut();
            aspectRatio.fadeOut();
            dimensions.fadeOut();
        });

        document.getElementById(`ddm-editor-${editorId}-gif-searchinput`).addEventListener('keydown', event => {
            if (event.key === "Enter") {
                event.preventDefault();
                const apiKey = atob(api.giphy.key);
                const searchField = $(`#ddm-editor-${editorId}-gif-searchinput`).val();
                const url = `${api.giphy.url}/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(searchField)}&lang=en`;
                loadGifs(url, `ddm-editor-${editorId}-gif-container`, $(`#ddm-editor-${editorId}-gif-searchinput`).data('editor'), false);
            }
        });
     }
};

const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        width: {
          default: 'auto',
          parseHTML: element => element.getAttribute('width') || 'auto',
          renderHTML: attributes => {
            return attributes.width ? { width: attributes.width } : {};
          },
        },
        height: {
          default: 'auto',
          parseHTML: element => element.getAttribute('height') || 'auto',
          renderHTML: attributes => {
            return attributes.height ? { height: attributes.height } : {};
          },
        },
      };
    },
  });

const RumbleEmbed = Extension.create({
    name: "rumbleEmbed",

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleDOMEvents: {
                        paste: (view, event) => {
                            const clipboardText = event.clipboardData.getData("text/plain");
                            if (!clipboardText) return false;

                            const match = clipboardText.match(/rumble\.com\/v([a-zA-Z0-9]+)-([^\/]+)\.html/);
                            if (!match) return false;

                            const videoId = `v${match[1]}`;
                            const documentId = `${match[2]}.html`
                            let embedId, embedUrl;

                            ajaxGet('rumbleproxy', {
                                id: videoId,
                                documentid: documentId
                            }, response => {
                                if (response.success) {
                                    embedUrl = `https://rumble.com/embed/${response.data.id}`;

                                    const { schema, tr } = view.state;
                            
                                    if (!schema.nodes.embed) {
                                        console.error("Embed node is missing in schema.");
                                        return false;
                                    }
                                    
                                    const embedNode = schema.nodes.embed.create({ src: embedUrl });
                                    view.dispatch(tr.replaceSelectionWith(embedNode));
                                    return true;
                                }
                            });
                        },
                    },
                },
            }),
        ];
    },
});

const FacebookEmbed = Extension.create({
    name: 'facebookEmbed',
  
    addProseMirrorPlugins() {
      return [
        new Plugin({
          props: {
            handleDOMEvents: {
              paste: (view, event) => {
                const url = event.clipboardData.getData('Text')
                if (this.isFacebookUrl(url)) {
                  const videoId = this.extractVideoId(url)
                  if (videoId) {
                    const embedUrl = `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch?v=${videoId}`
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
  
    isFacebookUrl(url) {
      return /facebook\.com/.test(url)
    },
  
    extractVideoId(url) {
      const regex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:[^\/\n\s]+\/)?(videos\/|watch\/)[^\/]+\/(\d+)/
      const match = url.match(regex)
      return match ? match[2] : null
    },
  })

const TikTokEmbed = Extension.create({
    name: 'tiktokEmbed',
  
    addProseMirrorPlugins() {
      return [
        new Plugin({
          props: {
            handleDOMEvents: {
              paste: (view, event) => {
                const url = event.clipboardData.getData('Text')
                if (this.isTikTokUrl(url)) {
                  const videoId = this.extractVideoId(url)
                  if (videoId) {
                    const embedUrl = `https://www.tiktok.com/embed/${videoId}`
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
  
    isTikTokUrl(url) {
      return /tiktok\.com/.test(url)
    },
  
    extractVideoId(url) {
      const regex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^\/]+\/video\/(\d+)/
      const match = url.match(regex)
      return match ? match[1] : null
    },
  })

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
  });

const CustomLink = Mark.create({
    name: 'customLink',

    addAttributes() {
        return {
            href: {
              default: null,
              parseHTML: (element) => element.getAttribute("href"),
              renderHTML: (attributes) => ({ href: attributes.href }),
            },
            target: {
              default: "_self",
              parseHTML: (element) => element.getAttribute("target") || "_self",
              renderHTML: (attributes) => ({ target: attributes.target }),
            },
            rel: {
              default: "noopener noreferrer",
              parseHTML: (element) => element.getAttribute("rel"),
              renderHTML: (attributes) => ({ rel: attributes.rel }),
            },
            title: {
              default: null,
              parseHTML: (element) => element.getAttribute("title"),
              renderHTML: (attributes) => (attributes.title ? { title: attributes.title } : {}),
            },
          };
    },

    parseHTML() {
        return [{ tag: "a[href]" }];
      },
    
      renderHTML({ HTMLAttributes }) {
        return ["a", mergeAttributes(HTMLAttributes), 0];
      },
    
      addCommands() {
        return {
            setCustomLink:
                ({ href, target = "_self", rel = "noopener noreferrer", title = "" }) =>
                ({ chain, editor }) => {
                    const selection = editor.state.selection;
                    const selectedText = selection.empty ? "" : editor.state.doc.textBetween(selection.from, selection.to);
    
                    if (!editor.state.selection.empty) {
                        return chain()
                            .extendMarkRange("customLink") // Ensures the entire selected text is linked
                            .setMark("customLink", { href, target, rel, title })
                            .run();
                    } else {
                        return chain()
                            .insertContent(`<a href="${href}" target="${target}" rel="${rel}">${selectedText || title || href}</a>`)
                            .run();
                    }
                },
            unsetCustomLink:
                () =>
                ({ chain }) => {
                    return chain().unsetMark("customLink").run();
                },
        };
    },
});

/**
 * Change the text font.
 * 
 * @param {string} editorId - The editor identifier.
 * @param {string} fontName - The name of the font to set.
 */
export const changeFont = (editorId, fontName) => {
    editors[editorId].chain().focus().setFontFamily(fontName).run();
};

/**
 * Insert a hyperlink using the given parameters.
 * 
 * @param {string} editorId - The editor identifier.
 * @param {string} titleId - The title identifier.
 * @param {string} urlId - The URL identifier.
 * @param {string} windowId - The window identifier.
 */
const insertHyperlink = (editorId, titleId, urlId, windowId) => {
    const titleInput = document.getElementById(titleId);
    const urlInput = document.getElementById(urlId);
    const windowSelect = document.getElementById(windowId);
    const activeEditor = editors[editorId];

    if (activeEditor) {
        if (titleInput.value.length > 0 && urlInput.value.length > 0) {
            activeEditor.chain().focus().setCustomLink({
                href: urlInput.value,
                target: windowSelect.value,
                rel: "noopener noreferrer",
                title: titleInput.value,
            }).run();
        } else if (titleInput.value.length === 0 && urlInput.value.length > 0) {
            activeEditor.chain().focus().setCustomLink({
                href: urlInput.value,
                target: windowSelect.value,
                rel: "noopener noreferer"
            }).run();
        }
    }

    resetDropDown();
};

/**
 * Loads the emoticons.
 * 
 * @param {string} editorId - The editor identifier.
 */
export const loadEmoticons = (editorId) => {
    const emoticonContainer = $(`#editor-${editorId}-emoticons-container`);
    const categoryHeader = $(`#editor-${editorId}-emoticon-category-header`);
    const categoryContent = $(`#editor-${editorId}-emoticon-category-content`);

    ajaxGet('emoticons', response => {
        if (response.success) {
            const data = response.data;

            data.forEach(category => {
                const clonedCategoryHeader = categoryHeader.clone(true);
                const header = clonedCategoryHeader.find('#category-header');
                header.text(category.category);
                emoticonContainer.append(header);

                const clonedCategoryContent = categoryContent.clone(true);
                const content = clonedCategoryContent.find('#category-content');

                category.unicodes.forEach(unicode => {                    
                    const a = document.createElement('a');
                    a.setAttribute('data-emoticon', unicode.unicode);
                    a.setAttribute('data-editorid', editorId);
                    a.href = "javascript:void(0);";
                    a.onclick = () => {
                        insertEmoticon(unicode.unicode, editorId);
                        return false;
                    };
                    a.text = unicode.unicode;
                    a.style.marginRight = '5px';
                    a.style.fontSize = '20px';

                    content.append(a);
                });

                emoticonContainer.append(content);
            });
        }
    });
};

/**
 * Insert an emoticon.
 * 
 * @param {string} unicode - The unicode to insert.
 * @param {string} editorId - The editor identifier. 
 */
const insertEmoticon = (unicode, editorId) => {
    const activeEditor = editors[editorId];

    if (activeEditor) {
        activeEditor.chain().focus().insertContent(unicode).run();
    }
};

/**
 * Calculate the aspect ratio for an image.
 * 
 * @param {string} ratio - The ratio string (e.g., 16:9).
 * @param {number} width - The width if known (null if not known). 
 * @param {number} height - The height if known (null if not known).
 * @returns {number} The missing dimension value. 
 */
const calculateAspectRatio = (ratio, width = null, height = null) => {
    if (!ratio || (width === null && height === null)) {
        throw new Error('You must provide a valid ratio and at least one dimension');
    }

    const [ratioWidth, ratioHeight] = ratio.split(':').map(Number);

    if (isNaN(ratioWidth) || isNaN(ratioHeight)) {
        throw new Error('Invalid ratio format. Please provide a valid ratio like 16:9');
    }

    if (width !== null) {
        return Math.round((width / ratioWidth) * ratioHeight);
    }

    if (height !== null) {
        return Math.round((height / ratioHeight) * ratioWidth);
    }

    throw new Error('Unable to calculate ratio. Provide at least one dimension');
};

/**
 * Maintains the aspect ratio for an image.
 * 
 * @param {Object} element - The element object instance.
 */
const maintainAspectRatio = (element) => {
    const width = $("#" + $(element).data('width'));
    const height = $("#" + $(element).data('height'));
    const enabled = $("#" + $(element).data('enabled'));
    const ratio = $("#" + $(element).data('ratio')).val();
    let newWidth = -1;
    let newHeight = -1;

    if (enabled.is(":checked")) {
        if (width.val() > 0) {
            newHeight = calculateAspectRatio(ratio, width.val());
        }

        if (height.val() > 0) {
            newWidth = calculateAspectRatio(ratio, null, height.val());
        }

        if (newWidth > 0) {
            width.val(newWidth);
        }

        if (newHeight) {
            height.val(newHeight);
        }
    }
};

/**
 * Loads the GIFs into the container.
 * 
 * @param {string} url - The GIPHY API URL.
 * @param {string} container - The container identifier.
 * @param {string} editor - The editor identifier. 
 * @param {boolean} [append=true] - True to append, false to overwrite. 
 */
const loadGifs = (url, container, editor, append = true) => {
    const activeEditor = editors[editor];
    const gifContainer = $(`#${container}`);

    if (activeEditor) {
        if (!append) gifContainer.html('');

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const gifs = data.data;

                gifs.forEach(gif => {
                    const a = document.createElement('a');
                    a.href = "javascript:void(0);";
                    a.onclick = () => {
                        insertGif(gif.images.fixed_height.url, activeEditor);
                        return false;
                    };

                    const img = document.createElement('img');
                    img.src = gif.images.fixed_height.url;

                    a.appendChild(img);
                    gifContainer.append(a);
                });
            })
            .catch(error => {
                console.error(`Failed to load GIFs from API URL [${url}]:`, error);
            });
    }
};

/**
 * Insert a GIF into the editor.
 * 
 * @param {string} img - The image source.
 * @param {jQuery} activeEditor - The active editor.
 */
const insertGif = (img, activeEditor) => {
    const gif = document.createElement('img');
    gif.src = img;
    
    if (activeEditor) {
        activeEditor.chain().focus().setImage({ src: img }).run();
    }
};

/**
 * Loads the "Trending" GIFs.
 * 
 * @param {string} container - The container identifier.
 * @param {string} editor - The editor identifier.
 */
export const loadTrendingGifs = (container, editor) => {
    const apiKey = atob(api.giphy.key);
    const url = `${api.giphy.url}/gifs/trending?api_key=${apiKey}&limit=${api.giphy.trendLimit}&offset=0&rating=g&bundle=messaging_non_clips`;
    loadGifs(url, container, editor);
};

/**
 * Get the text editor by its identifier.
 * 
 * @param {string} id - The editor identifier.
 * @returns {Editor} - The editor.
 */
export const getEditorById = (id) => {
    if (editors.hasOwnProperty(id)) {
        return editors[id];
    }
};