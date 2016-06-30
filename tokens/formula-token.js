"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var token_1 = require('./token');
exports.isToken = function (s, p) { return _.startsWith(s, '#[=', p) && s.indexOf(']', p + 3) >= 0; };
var FormulaToken = (function (_super) {
    __extends(FormulaToken, _super);
    function FormulaToken(parent, str, pos) {
        _super.call(this, parent);
        pos += 3;
        var posEnd = str.indexOf(']', pos);
        this.formula = str.substring(pos, posEnd);
    }
    return FormulaToken;
}(token_1.Token));
exports.FormulaToken = FormulaToken;
