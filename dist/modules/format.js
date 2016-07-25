"use strict";
const constants_1 = require('@trystal/constants');
const BISU = 0, FG = 1, BG = 2, FAMILY = 3, SIZE = 4, MGNBTM = 5;
exports.powerUp = (n) => n ? Math.pow(2, n - 1) : 0;
exports.toBits = (format) => {
    let [bisu = '', fg = '', bg = '', family = '', size = '', mgnbtm = '0'] = format.split('-');
    return [bisu, fg, bg, family, size, mgnbtm];
};
exports.toFormat = (bits) => bits.join('-');
const getBit = (format, n) => exports.toBits(format)[n];
const getInt = (format, n) => parseInt(getBit(format, n));
exports.bisu = (format) => getBit(format, BISU);
exports.fg = (format) => getInt(format, FG);
exports.bg = (format) => getInt(format, BG);
exports.family = (format) => getInt(format, FAMILY);
exports.size = (format) => getInt(format, SIZE);
exports.marginBottom = (format) => getInt(format, MGNBTM);
const fmt = (format, fmt) => exports.bisu(format).indexOf(fmt) >= 0;
exports.bold = (format) => fmt(format, 'B');
exports.italic = (format) => fmt(format, 'I');
exports.underline = (format) => fmt(format, 'S');
exports.strikeout = (format) => fmt(format, 'U');
const set = (format, index, value) => {
    const bits = exports.toBits(format);
    bits[index] = value || '';
    return exports.toFormat(bits);
};
exports.setFG = (format, value) => set(format, FG, value);
exports.setBG = (format, value) => set(format, BG, value);
exports.setFamily = (format, value) => set(format, FAMILY, value);
exports.setSize = (format, value) => set(format, SIZE, value);
exports.setMarginBottom = (format, value) => set(format, MGNBTM, value);
const _unsetBISU = (bit0, fmt) => bit0.replace(fmt, '');
const _setBISU = (bit0, fmt) => bit0.indexOf(fmt) >= 0 ? bit0 : bit0 + fmt;
const setBISU = (format, fmt) => {
    const bits = exports.toBits(format);
    bits[0] = _setBISU(exports.toBits(format)[0], fmt);
    return exports.toFormat(bits);
};
const unsetBISU = (format, fmt) => {
    const bits = exports.toBits(format);
    bits[0] = _unsetBISU(exports.toBits(format)[0], fmt);
    return exports.toFormat(bits);
};
exports.setBold = (format) => setBISU(format, 'B');
exports.setItalic = (format) => setBISU(format, 'I');
exports.setStrikeout = (format) => setBISU(format, 'S');
exports.setUnderline = (format) => setBISU(format, 'U');
exports.unsetBold = (format) => unsetBISU(format, 'B');
exports.unsetItalic = (format) => unsetBISU(format, 'I');
exports.unsetStrikeout = (format) => unsetBISU(format, 'S');
exports.unsetUnderline = (format) => unsetBISU(format, 'U');
exports.combos = (() => {
    const combos = {};
    [0, 1, 2, 3, 4, 5].forEach((bg, bgi) => {
        [0, 2, 3, 4, 5].forEach((fg, fgi) => {
            const c = '123456789abcdefghijklmnopqrstu'.charAt(bgi * 5 + fgi);
            combos[c] = {
                bg: constants_1.BackgroundColors[bg],
                fg: constants_1.ForegroundColors[fg] };
        });
    });
    return combos;
})();
