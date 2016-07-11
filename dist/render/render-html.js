"use strict";
var Moment = require('moment');
var _ = require('lodash');
var formula_token_1 = require('../tokens/formula-token');
var str_token_1 = require('../tokens/str-token');
var format_token_1 = require('../tokens/format-token');
var link_token_1 = require('../tokens/link-token');
var format_1 = require('../format');
var trystup_1 = require('../trystup');
var spanIt = function (csstag, value, content) { return ("<span style='" + csstag + ":" + value + "'>" + content + "</span>"); };
function renderFormat(token, options) {
    var format = token.format;
    var content = token.children.map(function (child) { return render(child, options); }).join('');
    var useStylesheets = options.useStylesheets;
    switch (format) {
        case 'b': return "<strong>" + content + "</strong>";
        case 'i': return "<em>" + content + "</em>";
        case 's': return "<del>" + content + "</del>";
        case 'u': return "<ins>" + content + "</ins>";
    }
    if (useStylesheets)
        return "<span class='" + format + "'>" + content + "</span>";
    if (/^s[1-5]$/i.test(format))
        return spanIt('font-size', format_1.sizes[format[1]] + 'px', content);
    if (/^f[0-2]$/i.test(format))
        return spanIt('font-family', format_1.faces[format[1]], content);
    if (/^bg[0-5]$/i.test(format))
        return spanIt('background-color', format_1.bgs[format[2]], content);
    if (/^fg[02345]$/i.test(format))
        return spanIt('color', format_1.fgs[format[2]], content);
    if (/^c[0-9a-z]$/i.test(format)) {
        var _a = format_1.combos[format[1]], fg = _a.fg, bg = _a.bg;
        return "<span style='background-color:" + bg + ",color:" + fg + "'>" + content + "</span>";
    }
    return content;
}
function renderFormula(token, options) {
    var showFields = options.showFields;
    var formula = token.formula;
    if (showFields)
        return "<span class='CELL'>" + formula + "</span>";
    switch (formula.toUpperCase()) {
        case 'TODAY': return Moment().format('dddd, MMM Do');
        case 'NOW': return Moment().format('h:mma');
        default: return formula;
    }
}
function renderLink(token, options) {
    var link = token.link, linkType = token.linkType, children = token.children;
    var content = children.map(function (token) { return render(token, options); }).join('');
    switch (linkType) {
        case link_token_1.LinkTypes.Internal:
        case link_token_1.LinkTypes.Trystal: return "<a href='" + link + "'>" + content + "</a>";
        case link_token_1.LinkTypes.Image:
        case link_token_1.LinkTypes.Other: return "<a target='_blank' href='" + link + "'>" + content + "</a>";
    }
    return content;
}
function render(token, options) {
    if (token instanceof formula_token_1.FormulaToken)
        return renderFormula(token, options);
    if (token instanceof link_token_1.LinkToken)
        return renderLink(token, options);
    if (token instanceof format_token_1.FormatToken)
        return renderFormat(token, options);
    if (token instanceof str_token_1.StrToken)
        return _.escape(token.str);
    return '';
}
var fixOptions = function (_a) {
    var _b = _a.showFields, showFields = _b === void 0 ? false : _b, _c = _a.useStylesheets, useStylesheets = _c === void 0 ? true : _c;
    return ({ showFields: showFields, useStylesheets: useStylesheets });
};
function renderHtml(trystup, options) {
    options = fixOptions(options);
    var root = trystup_1.tokenize(trystup);
    var rendered = root.children.reduce(function (ACC, token) { return ACC + render(token, options); }, '');
    var imageLinks = root.images();
    return { rendered: rendered, imageLinks: imageLinks };
}
exports.renderHtml = renderHtml;
