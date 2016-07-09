"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var token_1 = require('./token');
var StrToken = (function (_super) {
    __extends(StrToken, _super);
    function StrToken(parent, offset) {
        if (offset === void 0) { offset = 0; }
        _super.call(this, parent);
        this.startPos = offset;
        this.endPos = offset;
        this.str = null;
    }
    StrToken.prototype.close = function (str) {
        var s = str.substring(this.startPos, this.endPos + 1);
        s = s.replace(/\\([#\\\]])/g, '$1');
        this.str = s;
    };
    return StrToken;
}(token_1.Token));
exports.StrToken = StrToken;
