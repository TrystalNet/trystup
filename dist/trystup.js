"use strict";
console.log('16-06-29A');
var Format = require('./format');
exports.Format = Format;
var token_1 = require('./tokens/token');
exports.Token = token_1.Token;
var str_token_1 = require('./tokens/str-token');
exports.StrToken = str_token_1.StrToken;
var formula_token_1 = require('./tokens/formula-token');
exports.FormulaToken = formula_token_1.FormulaToken;
exports.isFormulaToken = formula_token_1.isToken;
var format_token_1 = require('./tokens/format-token');
exports.FormatToken = format_token_1.FormatToken;
exports.isFormatToken = format_token_1.isToken;
var link_token_1 = require('./tokens/link-token');
exports.LinkToken = link_token_1.LinkToken;
exports.isLinkToken = link_token_1.isToken;
var render_draftjs_1 = require('./render/render-draftjs');
exports.renderDraftJS = render_draftjs_1.renderDraftJS;
var render_html_1 = require('./render/render-html');
exports.renderHtml = render_html_1.renderHtml;
function tokenize(str) {
    var ROOT = new token_1.Token();
    var STRTOKENS = [];
    var posMax = str.length;
    var pos = 0, TOKEN = ROOT;
    while (pos < posMax) {
        var oldpos = pos;
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
            var FORMAT = new format_token_1.FormatToken(TOKEN, str, pos + 2);
            TOKEN.children.push(FORMAT);
            TOKEN = FORMAT;
            pos += (FORMAT.format.length + 3);
        }
        else if (link_token_1.isToken(pos, str)) {
            if (TOKEN instanceof str_token_1.StrToken)
                TOKEN = TOKEN.parent;
            var LINK = new link_token_1.LinkToken(TOKEN, str, pos);
            TOKEN.children.push(LINK);
            TOKEN = LINK;
            pos += LINK.link.length + 5;
        }
        else if (formula_token_1.isToken(str, pos)) {
            if (TOKEN instanceof str_token_1.StrToken)
                TOKEN = TOKEN.parent;
            var FORMULA = new formula_token_1.FormulaToken(TOKEN, str, pos);
            TOKEN.children.push(FORMULA);
            pos += FORMULA.formula.length + 4;
        }
        else {
            if (!(TOKEN instanceof str_token_1.StrToken)) {
                var RAW = new str_token_1.StrToken(TOKEN, pos);
                TOKEN.children.push(RAW);
                TOKEN = RAW;
                STRTOKENS.push(RAW);
            }
            var strToken = TOKEN;
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
    STRTOKENS.forEach(function (token) { return token.close(str); });
    return ROOT;
}
exports.tokenize = tokenize;
var defaultOptions = {
    showFields: false,
    format: 'html',
    useStyleSheets: true
};
