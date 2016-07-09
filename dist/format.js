"use strict";
var BISU = 0, FG = 1, BG = 2, FAMILY = 3, SIZE = 4, MGNBTM = 5;
exports.powerUp = function (n) { return n ? Math.pow(2, n - 1) : 0; };
exports.fgs = ['black', null, 'blue', 'green', 'red', 'gray'];
exports.bgs = [null, 'yellow', 'powderblue', 'palegreen', 'mistyrose', 'lightgray'];
exports.sizes = [null, 10, 13, 18, 24, 32];
exports.faces = ['serif', 'sans-serif', 'monospace'];
exports.toBits = function (format) {
    var _a = format.split('-'), _b = _a[0], bisu = _b === void 0 ? '' : _b, _c = _a[1], fg = _c === void 0 ? '' : _c, _d = _a[2], bg = _d === void 0 ? '' : _d, _e = _a[3], family = _e === void 0 ? '' : _e, _f = _a[4], size = _f === void 0 ? '' : _f, _g = _a[5], mgnbtm = _g === void 0 ? '0' : _g;
    return [bisu, fg, bg, family, size, mgnbtm];
};
exports.toFormat = function (bits) { return bits.join('-'); };
var getBit = function (format, n) { return exports.toBits(format)[n]; };
var getInt = function (format, n) { return parseInt(getBit(format, n)); };
exports.bisu = function (format) { return getBit(format, BISU); };
exports.fg = function (format) { return getInt(format, FG); };
exports.bg = function (format) { return getInt(format, BG); };
exports.family = function (format) { return getInt(format, FAMILY); };
exports.size = function (format) { return getInt(format, SIZE); };
exports.marginBottom = function (format) { return getInt(format, MGNBTM); };
var fmt = function (format, fmt) { return exports.bisu(format).indexOf(fmt) >= 0; };
exports.bold = function (format) { return fmt(format, 'B'); };
exports.italic = function (format) { return fmt(format, 'I'); };
exports.underline = function (format) { return fmt(format, 'S'); };
exports.strikeout = function (format) { return fmt(format, 'U'); };
var set = function (format, index, value) {
    var bits = exports.toBits(format);
    bits[index] = value || '';
    return exports.toFormat(bits);
};
exports.setFG = function (format, value) { return set(format, FG, value); };
exports.setBG = function (format, value) { return set(format, BG, value); };
exports.setFamily = function (format, value) { return set(format, FAMILY, value); };
exports.setSize = function (format, value) { return set(format, SIZE, value); };
exports.setMarginBottom = function (format, value) { return set(format, MGNBTM, value); };
var _unsetBISU = function (bit0, fmt) { return bit0.replace(fmt, ''); };
var _setBISU = function (bit0, fmt) { return bit0.indexOf(fmt) >= 0 ? bit0 : bit0 + fmt; };
var setBISU = function (format, fmt) {
    var bits = exports.toBits(format);
    bits[0] = _setBISU(exports.toBits(format)[0], fmt);
    return exports.toFormat(bits);
};
var unsetBISU = function (format, fmt) {
    var bits = exports.toBits(format);
    bits[0] = _unsetBISU(exports.toBits(format)[0], fmt);
    return exports.toFormat(bits);
};
exports.setBold = function (format) { return setBISU(format, 'B'); };
exports.setItalic = function (format) { return setBISU(format, 'I'); };
exports.setStrikeout = function (format) { return setBISU(format, 'S'); };
exports.setUnderline = function (format) { return setBISU(format, 'U'); };
exports.unsetBold = function (format) { return unsetBISU(format, 'B'); };
exports.unsetItalic = function (format) { return unsetBISU(format, 'I'); };
exports.unsetStrikeout = function (format) { return unsetBISU(format, 'S'); };
exports.unsetUnderline = function (format) { return unsetBISU(format, 'U'); };
exports.combos = (function () {
    var combos = {};
    [0, 1, 2, 3, 4, 5].forEach(function (bg, bgi) {
        [0, 2, 3, 4, 5].forEach(function (fg, fgi) {
            var c = '123456789abcdefghijklmnopqrstu'.charAt(bgi * 5 + fgi);
            combos[c] = { bg: exports.bgs[bg], fg: exports.fgs[fg] };
        });
    });
    return combos;
})();
