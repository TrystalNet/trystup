"use strict";
console.log('16-07-11A');
const Format = require('./modules/format');
exports.Format = Format;
const token_1 = require('./modules/tokens/token');
exports.Token = token_1.Token;
const str_token_1 = require('./modules/tokens/str-token');
exports.StrToken = str_token_1.StrToken;
const formula_token_1 = require('./modules/tokens/formula-token');
exports.FormulaToken = formula_token_1.FormulaToken;
exports.isFormulaToken = formula_token_1.isToken;
const format_token_1 = require('./modules/tokens/format-token');
exports.FormatToken = format_token_1.FormatToken;
exports.isFormatToken = format_token_1.isToken;
const link_token_1 = require('./modules/tokens/link-token');
exports.LinkToken = link_token_1.LinkToken;
exports.isLinkToken = link_token_1.isToken;
const render_draftjs_1 = require('./modules/render/render-draftjs');
exports.renderDraftJS = render_draftjs_1.renderDraftJS;
const render_html_1 = require('./modules/render/render-html');
exports.renderHtml = render_html_1.renderHtml;
const render_text_1 = require('./modules/render/render-text');
exports.renderText = render_text_1.renderText;
function tokenize(str) {
    const ROOT = new token_1.Token();
    const STRTOKENS = [];
    const posMax = str.length;
    let pos = 0;
    let TOKEN = ROOT;
    while (pos < posMax) {
        const oldpos = pos;
        if (str[pos] === ']') {
            if (TOKEN instanceof str_token_1.StrToken)
                TOKEN = TOKEN.parent;
            if (TOKEN.parent)
                TOKEN = TOKEN.parent;
            pos++;
        }
        else if (format_token_1.isToken(str, pos)) {
            if (TOKEN instanceof str_token_1.StrToken)
                TOKEN = TOKEN.parent;
            const FORMAT = new format_token_1.FormatToken(TOKEN, str, pos + 2);
            TOKEN.children.push(FORMAT);
            TOKEN = FORMAT;
            pos += (FORMAT.format.length + 3);
        }
        else if (link_token_1.isToken(pos, str)) {
            if (TOKEN instanceof str_token_1.StrToken)
                TOKEN = TOKEN.parent;
            let LINK = new link_token_1.LinkToken(TOKEN, str, pos);
            TOKEN.children.push(LINK);
            TOKEN = LINK;
            pos += LINK.link.length + 5;
        }
        else if (formula_token_1.isToken(str, pos)) {
            if (TOKEN instanceof str_token_1.StrToken)
                TOKEN = TOKEN.parent;
            let FORMULA = new formula_token_1.FormulaToken(TOKEN, str, pos);
            TOKEN.children.push(FORMULA);
            pos += FORMULA.formula.length + 4;
        }
        else {
            if (!(TOKEN instanceof str_token_1.StrToken)) {
                let RAW = new str_token_1.StrToken(TOKEN, pos);
                TOKEN.children.push(RAW);
                TOKEN = RAW;
                STRTOKENS.push(RAW);
            }
            let strToken = TOKEN;
            if (str[pos] === '\\' && pos < posMax - 1) {
                strToken.endPos = pos + 1;
                pos += 2;
            }
            else {
                strToken.endPos = pos;
                pos++;
            }
        }
        if (pos === oldpos)
            pos++;
    }
    STRTOKENS.forEach((token) => token.close(str));
    return ROOT;
}
exports.tokenize = tokenize;
const defaultOptions = {
    showFields: false,
    useStylesheets: true
};
