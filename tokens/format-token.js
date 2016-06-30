"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var token_1 = require('./token');
exports.isToken = function (s, p) {
    if (!_.startsWith(s, '#[', p))
        return false;
    p += 2;
    var spacePos = s.indexOf(' ', p) - p;
    switch (spacePos) {
        case 1: return 'bisu'.indexOf(s[p]) >= 0;
        case 2:
            switch (s[p]) {
                case 's': return '12345'.indexOf(s[p + 1]) >= 0;
                case 'f': return '012'.indexOf(s[p + 1]) >= 0;
                default: return false;
            }
        case 3:
            if (s[p + 1] !== 'g')
                return false;
            switch (s[p]) {
                case 'f': return _.includes(['0', '2', '3', '4', '5'], s[p + 2]);
                case 'b': return _.includes(['0', '1', '2', '3', '4', '5'], s[p + 2]);
                default: return false;
            }
    }
    return false;
};
var FormatToken = (function (_super) {
    __extends(FormatToken, _super);
    function FormatToken(parent, str, p) {
        _super.call(this, parent);
        this.format = str.substring(p, str.indexOf(' ', p)).toLowerCase();
    }
    return FormatToken;
}(token_1.Token));
exports.FormatToken = FormatToken;
