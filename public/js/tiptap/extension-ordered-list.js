import { Node, mergeAttributes, wrappingInputRule } from './core.js';

const ListItemName = 'listItem';
const TextStyleName = 'textStyle';
/**
 * Matches an ordered list to a 1. on input (or any number followed by a dot).
 */
const inputRegex = /^(\d+)\.\s$/;
/**
 * This extension allows you to create ordered lists.
 * This requires the ListItem extension
 * @see https://www.tiptap.dev/api/nodes/ordered-list
 * @see https://www.tiptap.dev/api/nodes/list-item
 */
const OrderedList = Node.create({
    name: 'orderedList',
    addOptions() {
        return {
            itemTypeName: 'listItem',
            HTMLAttributes: {},
            keepMarks: false,
            keepAttributes: false,
        };
    },
    group: 'block list',
    content() {
        return `${this.options.itemTypeName}+`;
    },
    addAttributes() {
        return {
            start: {
                default: 1,
                parseHTML: element => {
                    return element.hasAttribute('start')
                        ? parseInt(element.getAttribute('start') || '', 10)
                        : 1;
                },
            },
            type: {
                default: undefined,
                parseHTML: element => element.getAttribute('type'),
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'ol',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        const { start, ...attributesWithoutStart } = HTMLAttributes;
        return start === 1
            ? ['ol', mergeAttributes(this.options.HTMLAttributes, attributesWithoutStart), 0]
            : ['ol', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
        return {
            toggleOrderedList: () => ({ commands, chain }) => {
                if (this.options.keepAttributes) {
                    return chain().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(ListItemName, this.editor.getAttributes(TextStyleName)).run();
                }
                return commands.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks);
            },
        };
    },
    addKeyboardShortcuts() {
        return {
            'Mod-Shift-7': () => this.editor.commands.toggleOrderedList(),
        };
    },
    addInputRules() {
        let inputRule = wrappingInputRule({
            find: inputRegex,
            type: this.type,
            getAttributes: match => ({ start: +match[1] }),
            joinPredicate: (match, node) => node.childCount + node.attrs.start === +match[1],
        });
        if (this.options.keepMarks || this.options.keepAttributes) {
            inputRule = wrappingInputRule({
                find: inputRegex,
                type: this.type,
                keepMarks: this.options.keepMarks,
                keepAttributes: this.options.keepAttributes,
                getAttributes: match => ({ start: +match[1], ...this.editor.getAttributes(TextStyleName) }),
                joinPredicate: (match, node) => node.childCount + node.attrs.start === +match[1],
                editor: this.editor,
            });
        }
        return [
            inputRule,
        ];
    },
});

export { OrderedList, OrderedList as default, inputRegex };
//# sourceMappingURL=index.js.map
