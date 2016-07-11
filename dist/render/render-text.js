"use strict";
var Moment = require('moment');
var _ = require('lodash');
var formula_token_1 = require('../tokens/formula-token');
var str_token_1 = require('../tokens/str-token');
var format_token_1 = require('../tokens/format-token');
var link_token_1 = require('../tokens/link-token');
var trystup_1 = require('../trystup');
function renderFormula(token, options) {
    var showFields = options.showFields;
    var formula = token.formula;
    if (showFields)
        return "[" + formula + "]";
    switch (formula.toUpperCase()) {
        case 'TODAY': return Moment().format('dddd, MMM Do');
        case 'NOW': return Moment().format('h:mma');
        default: return formula;
    }
}
function renderLink(token, options) {
    var link = token.link, linkType = token.linkType, children = token.children;
    var content = children.map(function (token) { return render(token, options); }).join('');
    return "[" + content + "](" + link + ")";
}
function render(token, options) {
    if (token instanceof formula_token_1.FormulaToken)
        return renderFormula(token, options);
    if (token instanceof link_token_1.LinkToken)
        return renderLink(token, options);
    if (token instanceof format_token_1.FormatToken)
        return token.children.map(function (child) { return render(child, options); }).join('');
    if (token instanceof str_token_1.StrToken)
        return _.escape(token.str || '');
    return '';
}
var fixOptions = function (_a) {
    var _b = _a.showFields, showFields = _b === void 0 ? false : _b;
    return ({ showFields: showFields });
};
function renderText(trystup, options) {
    var root = trystup_1.tokenize(trystup);
    options = fixOptions(options);
    var rendered = root.children.reduce(function (ACC, token) { return ACC + render(token, options); }, '');
    var imageLinks = root.images();
    return { rendered: rendered, imageLinks: imageLinks };
}
exports.renderText = renderText;
