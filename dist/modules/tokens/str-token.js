"use strict";
const token_1 = require('./token');
class StrToken extends token_1.Token {
    constructor(parent, offset = 0) {
        super(parent);
        this.startPos = offset;
        this.endPos = offset;
        this.str = null;
    }
    close(str) {
        let s = str.substring(this.startPos, this.endPos + 1);
        s = s.replace(/\\([#\\\]])/g, '$1');
        this.str = s;
    }
}
exports.StrToken = StrToken;
