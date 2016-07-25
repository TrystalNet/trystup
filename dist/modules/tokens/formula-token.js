"use strict";
const _ = require('lodash');
const token_1 = require('./token');
exports.isToken = (str, offset) => _.startsWith(str, '#[=', offset) && str.indexOf(']', offset + 3) >= 0;
class FormulaToken extends token_1.Token {
    constructor(parent, str, offset) {
        super(parent);
        offset += 3;
        let posEnd = str.indexOf(']', offset);
        this.formula = str.substring(offset, posEnd);
    }
}
exports.FormulaToken = FormulaToken;
