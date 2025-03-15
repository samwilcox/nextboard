import { Extension } from './core.js';
import { Blockquote } from './extension-blockquote.js';
import { Bold } from './extension-bold.js';
import { BulletList } from './extension-bullet-list.js';
import { Code } from './extension-code.js';
import { CodeBlock } from './extension-code-block.js';
import { Document } from './extension-document.js';
import { Dropcursor } from './extension-dropcursor.js';
import { Gapcursor } from './extension-gapcursor.js';
import { HardBreak } from './extension-hard-break.js';
import { Heading } from './extension-heading.js';
import { History } from './extension-history.js';
import { HorizontalRule } from './extension-horizontal-rule.js';
import { Italic } from './extension-italic.js';
import { ListItem } from './extension-list-item.js';
import { OrderedList } from './extension-ordered-list.js';
import { Paragraph } from './extension-paragraph.js';
import { Strike } from './extension-strike.js';
import { Text } from './extension-text.js';

/**
 * The starter kit is a collection of essential editor extensions.
 *
 * It’s a good starting point for building your own editor.
 */
const StarterKit = Extension.create({
    name: 'starterKit',
    addExtensions() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const extensions = [];
        if (this.options.bold !== false) {
            extensions.push(Bold.configure((_a = this.options) === null || _a === void 0 ? void 0 : _a.bold));
        }
        if (this.options.blockquote !== false) {
            extensions.push(Blockquote.configure((_b = this.options) === null || _b === void 0 ? void 0 : _b.blockquote));
        }
        if (this.options.bulletList !== false) {
            extensions.push(BulletList.configure((_c = this.options) === null || _c === void 0 ? void 0 : _c.bulletList));
        }
        if (this.options.code !== false) {
            extensions.push(Code.configure((_d = this.options) === null || _d === void 0 ? void 0 : _d.code));
        }
        if (this.options.codeBlock !== false) {
            extensions.push(CodeBlock.configure((_e = this.options) === null || _e === void 0 ? void 0 : _e.codeBlock));
        }
        if (this.options.document !== false) {
            extensions.push(Document.configure((_f = this.options) === null || _f === void 0 ? void 0 : _f.document));
        }
        if (this.options.dropcursor !== false) {
            extensions.push(Dropcursor.configure((_g = this.options) === null || _g === void 0 ? void 0 : _g.dropcursor));
        }
        if (this.options.gapcursor !== false) {
            extensions.push(Gapcursor.configure((_h = this.options) === null || _h === void 0 ? void 0 : _h.gapcursor));
        }
        if (this.options.hardBreak !== false) {
            extensions.push(HardBreak.configure((_j = this.options) === null || _j === void 0 ? void 0 : _j.hardBreak));
        }
        if (this.options.heading !== false) {
            extensions.push(Heading.configure((_k = this.options) === null || _k === void 0 ? void 0 : _k.heading));
        }
        if (this.options.history !== false) {
            extensions.push(History.configure((_l = this.options) === null || _l === void 0 ? void 0 : _l.history));
        }
        if (this.options.horizontalRule !== false) {
            extensions.push(HorizontalRule.configure((_m = this.options) === null || _m === void 0 ? void 0 : _m.horizontalRule));
        }
        if (this.options.italic !== false) {
            extensions.push(Italic.configure((_o = this.options) === null || _o === void 0 ? void 0 : _o.italic));
        }
        if (this.options.listItem !== false) {
            extensions.push(ListItem.configure((_p = this.options) === null || _p === void 0 ? void 0 : _p.listItem));
        }
        if (this.options.orderedList !== false) {
            extensions.push(OrderedList.configure((_q = this.options) === null || _q === void 0 ? void 0 : _q.orderedList));
        }
        if (this.options.paragraph !== false) {
            extensions.push(Paragraph.configure((_r = this.options) === null || _r === void 0 ? void 0 : _r.paragraph));
        }
        if (this.options.strike !== false) {
            extensions.push(Strike.configure((_s = this.options) === null || _s === void 0 ? void 0 : _s.strike));
        }
        if (this.options.text !== false) {
            extensions.push(Text.configure((_t = this.options) === null || _t === void 0 ? void 0 : _t.text));
        }
        return extensions;
    },
});

export { StarterKit, StarterKit as default };
//# sourceMappingURL=index.js.map
