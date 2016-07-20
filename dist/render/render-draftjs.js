"use strict";
var _ = require('lodash');
var draft_js_1 = require('draft-js');
var link_token_1 = require('../tokens/link-token');
var formula_token_1 = require('../tokens/formula-token');
var format_token_1 = require('../tokens/format-token');
var str_token_1 = require('../tokens/str-token');
var trystup_1 = require('../trystup');
var CODES = {
    b: 'BOLD', i: 'ITALIC', u: 'UNDERLINE', s: 'STRIKEOUT',
    bg0: 'BG0', bg1: 'BG1', bg2: 'BG2', bg3: 'BG3', bg4: 'BG4', bg5: 'BG5',
    fg0: 'FG0', fg2: 'FG2', fg3: 'FG3', fg4: 'FG4', fg5: 'FG5',
    f0: 'F0', f1: 'F1', f2: 'F2',
    s1: 'S1', s2: 'S2', s3: 'S3', s4: 'S4', s5: 'S5'
};
var initBlockFromText = function (text) {
    return {
        text: text,
        type: 'unstyled',
        inlineStyleRanges: [],
        entityRanges: []
    };
};
function reduceBlocks(block1, block2) {
    var oldTextLength = block1.text.length;
    block1.text += block2.text;
    block2.inlineStyleRanges.forEach(function (isr) { return isr.offset += oldTextLength; });
    block2.entityRanges.forEach(function (er) { return er.offset += oldTextLength; });
    block1.inlineStyleRanges = block1.inlineStyleRanges.concat(block2.inlineStyleRanges);
    block1.entityRanges = block1.entityRanges.concat(block2.entityRanges);
    return block1;
}
function appendEntity(entities, entitySpec) {
    entities.push(entitySpec);
    return (entities.length - 1);
}
function renderFormula(token, entities) {
    var formula = token.formula;
    var block = initBlockFromText(formula);
    var entitySpec = {
        type: 'FIELD',
        mutability: 'IMMUTABLE',
        data: { formula: formula }
    };
    var key = appendEntity(entities, entitySpec);
    var offset = 0;
    var length = block.text.length;
    var entityRange = { key: key, offset: offset, length: length };
    block.entityRanges.push(entityRange);
    return block;
}
function renderFormat(token, entityArray) {
    var block = renderChildren(token.children, entityArray);
    var code = CODES[token.format];
    block.inlineStyleRanges.push({ offset: 0, length: block.text.length, style: code });
    return block;
}
function renderText(token) {
    return initBlockFromText(token.str || '');
}
function renderLink(token, entityArray) {
    var link = token.link, children = token.children;
    var block = renderChildren(children, entityArray);
    var key = appendEntity(entityArray, {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { url: link }
    });
    var offset = 0;
    var length = block.text.length;
    block.entityRanges.push({ offset: offset, length: length, key: key });
    return block;
}
function renderChildren(childTokens, entities) {
    if (_.isEmpty(childTokens))
        return initBlockFromText('');
    return childTokens
        .map(function (token) { return renderToken(token, entities); })
        .reduce(reduceBlocks);
}
function renderToken(token, entityArray) {
    if (token instanceof str_token_1.StrToken)
        return renderText(token);
    if (token instanceof format_token_1.FormatToken)
        return renderFormat(token, entityArray);
    if (token instanceof formula_token_1.FormulaToken)
        return renderFormula(token, entityArray);
    if (token instanceof link_token_1.LinkToken)
        return renderLink(token, entityArray);
    return renderChildren(token.children, entityArray);
}
function renderDraftJS(trystup) {
    var rootTokens = trystup_1.tokenize(trystup).children;
    var entities = [];
    var block = renderChildren(rootTokens, entities);
    var entityMap = entities.reduce(function (accum, entity, i) {
        var key = i.toString();
        accum[key] = entity;
        return accum;
    }, {});
    var rawState = {
        blocks: [block],
        entityMap: entityMap
    };
    var contentState = draft_js_1.convertFromRaw(rawState);
    return { contentState: contentState };
}
exports.renderDraftJS = renderDraftJS;
