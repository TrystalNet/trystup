"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var token_1 = require('./token');
exports.isToken = function (str, offset) { return _.startsWith(str, '#[=', offset) && str.indexOf(']', offset + 3) >= 0; };
var FormulaToken = (function (_super) {
    __extends(FormulaToken, _super);
    function FormulaToken(parent, str, offset) {
        _super.call(this, parent);
        offset += 3;
        var posEnd = str.indexOf(']', offset);
        this.formula = str.substring(offset, posEnd);
    }
    return FormulaToken;
}(token_1.Token));
exports.FormulaToken = FormulaToken;
