"use strict";
const Moment = require('moment');
const _ = require('lodash');
const formula_token_1 = require('../tokens/formula-token');
const str_token_1 = require('../tokens/str-token');
const format_token_1 = require('../tokens/format-token');
const link_token_1 = require('../tokens/link-token');
const trystup_1 = require('../../trystup');
function renderFormula(token, options) {
    let { showFields } = options;
    let { formula } = token;
    if (showFields)
        return `[${formula}]`;
    switch (formula.toUpperCase()) {
        case 'TODAY': return Moment().format('dddd, MMM Do');
        case 'NOW': return Moment().format('h:mma');
        default: return formula;
    }
}
function renderLink(token, options) {
    const { link, linkType, children } = token;
    const content = children.map((token) => render(token, options)).join('');
    return `[${content}](${link})`;
}
function render(token, options) {
    if (token instanceof formula_token_1.FormulaToken)
        return renderFormula(token, options);
    if (token instanceof link_token_1.LinkToken)
        return renderLink(token, options);
    if (token instanceof format_token_1.FormatToken)
        return token.children.map(child => render(child, options)).join('');
    if (token instanceof str_token_1.StrToken)
        return _.escape(token.str || '');
    return '';
}
const fixOptions = ({ showFields = false }) => ({ showFields });
function renderText(trystup, options) {
    const root = trystup_1.tokenize(trystup);
    options = fixOptions(options);
    const rendered = root.children.reduce((ACC, token) => ACC + render(token, options), '');
    const imageLinks = root.images();
    return { rendered, imageLinks };
}
exports.renderText = renderText;
