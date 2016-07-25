"use strict";
const Moment = require('moment');
const _ = require('lodash');
const constants_1 = require('@trystal/constants');
const formula_token_1 = require('../tokens/formula-token');
const str_token_1 = require('../tokens/str-token');
const format_token_1 = require('../tokens/format-token');
const link_token_1 = require('../tokens/link-token');
const format_1 = require('../format');
const trystup_1 = require('../../trystup');
const spanIt = (csstag, value, content) => `<span style='${csstag}:${value}'>${content}</span>`;
function renderFormat(token, options) {
    const { format } = token;
    const content = token.children.map(child => render(child, options)).join('');
    const { useStylesheets } = options;
    switch (format) {
        case 'b': return `<strong>${content}</strong>`;
        case 'i': return `<em>${content}</em>`;
        case 's': return `<del>${content}</del>`;
        case 'u': return `<ins>${content}</ins>`;
    }
    if (useStylesheets)
        return `<span class='${format}'>${content}</span>`;
    if (/^s[1-5]$/i.test(format))
        return spanIt('font-size', constants_1.SIZES[format[1]] + 'px', content);
    if (/^f[0-2]$/i.test(format))
        return spanIt('font-family', constants_1.FACES[format[1]], content);
    if (/^bg[0-5]$/i.test(format))
        return spanIt('background-color', constants_1.BackgroundColors[format[2]], content);
    if (/^fg[02345]$/i.test(format))
        return spanIt('color', constants_1.ForegroundColors[format[2]], content);
    if (/^c[0-9a-z]$/i.test(format)) {
        const { fg, bg } = format_1.combos[format[1]];
        return `<span style='background-color:${bg},color:${fg}'>${content}</span>`;
    }
    return content;
}
function renderFormula(token, options) {
    let { showFields } = options;
    let { formula } = token;
    if (showFields)
        return `<span class='CELL'>${formula}</span>`;
    switch (formula.toUpperCase()) {
        case 'TODAY': return Moment().format('dddd, MMM Do');
        case 'NOW': return Moment().format('h:mma');
        default: return formula;
    }
}
function renderLink(token, options) {
    const { link, linkType, children } = token;
    const content = children.map((token) => render(token, options)).join('');
    switch (linkType) {
        case link_token_1.LinkTypes.Internal:
        case link_token_1.LinkTypes.Trystal: return `<a href='${link}'>${content}</a>`;
        case link_token_1.LinkTypes.Image:
        case link_token_1.LinkTypes.Other: return `<a target='_blank' href='${link}'>${content}</a>`;
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
        return _.escape(token.str || '');
    return '';
}
const fixOptions = ({ showFields = false, useStylesheets = true }) => ({ showFields, useStylesheets });
function renderHtml(trystup, options) {
    options = fixOptions(options);
    const root = trystup_1.tokenize(trystup);
    const rendered = root.children.reduce((ACC, token) => ACC + render(token, options), '');
    const imageLinks = root.images();
    return { rendered, imageLinks };
}
exports.renderHtml = renderHtml;
