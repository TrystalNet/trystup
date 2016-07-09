"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var token_1 = require('./token');
exports.isToken = function (str, offset) {
    if (!_.startsWith(str, '#[', offset))
        return false;
    offset += 2;
    var spacePos = str.indexOf(' ', offset) - offset;
    switch (spacePos) {
        case 1: return 'bisu'.indexOf(str[offset]) >= 0;
        case 2:
            switch (str[offset]) {
                case 's': return '12345'.indexOf(str[offset + 1]) >= 0;
                case 'f': return '012'.indexOf(str[offset + 1]) >= 0;
                default: return false;
            }
        case 3:
            if (str[offset + 1] !== 'g')
                return false;
            switch (str[offset]) {
                case 'f': return _.includes(['0', '2', '3', '4', '5'], str[offset + 2]);
                case 'b': return _.includes(['0', '1', '2', '3', '4', '5'], str[offset + 2]);
                default: return false;
            }
    }
    return false;
};
var FormatToken = (function (_super) {
    __extends(FormatToken, _super);
    function FormatToken(parent, str, offset) {
        _super.call(this, parent);
        this.format = str.substring(offset, str.indexOf(' ', offset)).toLowerCase();
    }
    return FormatToken;
}(token_1.Token));
exports.FormatToken = FormatToken;
