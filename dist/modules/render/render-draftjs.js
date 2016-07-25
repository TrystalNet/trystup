"use strict";
const _ = require('lodash');
const draft_js_1 = require('draft-js');
const link_token_1 = require('../tokens/link-token');
const formula_token_1 = require('../tokens/formula-token');
const format_token_1 = require('../tokens/format-token');
const str_token_1 = require('../tokens/str-token');
const trystup_1 = require('../../trystup');
const CODES = {
    b: 'BOLD', i: 'ITALIC', u: 'UNDERLINE', s: 'STRIKEOUT',
    bg0: 'BG0', bg1: 'BG1', bg2: 'BG2', bg3: 'BG3', bg4: 'BG4', bg5: 'BG5',
    fg0: 'FG0', fg2: 'FG2', fg3: 'FG3', fg4: 'FG4', fg5: 'FG5',
    f0: 'F0', f1: 'F1', f2: 'F2',
    s1: 'S1', s2: 'S2', s3: 'S3', s4: 'S4', s5: 'S5'
};
const initBlockFromText = (text) => {
    return {
        text,
        type: 'unstyled',
        inlineStyleRanges: [],
        entityRanges: []
    };
};
function reduceBlocks(block1, block2) {
    const oldTextLength = block1.text.length;
    block1.text += block2.text;
    block2.inlineStyleRanges.forEach((isr) => isr.offset += oldTextLength);
    block2.entityRanges.forEach((er) => er.offset += oldTextLength);
    block1.inlineStyleRanges = [...block1.inlineStyleRanges, ...block2.inlineStyleRanges];
    block1.entityRanges = [...block1.entityRanges, ...block2.entityRanges];
    return block1;
}
function appendEntity(entities, entitySpec) {
    entities.push(entitySpec);
    return (entities.length - 1);
}
function renderFormula(token, entities) {
    const { formula } = token;
    const block = initBlockFromText(formula);
    const entitySpec = {
        type: 'FIELD',
        mutability: 'IMMUTABLE',
        data: { formula: formula }
    };
    const key = appendEntity(entities, entitySpec);
    const offset = 0;
    const length = block.text.length;
    const entityRange = { key, offset, length };
    block.entityRanges.push(entityRange);
    return block;
}
function renderFormat(token, entityArray) {
    const block = renderChildren(token.children, entityArray);
    const code = CODES[token.format];
    block.inlineStyleRanges.push({ offset: 0, length: block.text.length, style: code });
    return block;
}
function renderText(token) {
    return initBlockFromText(token.str || '');
}
function renderLink(token, entityArray) {
    const { link, children } = token;
    const block = renderChildren(children, entityArray);
    const key = appendEntity(entityArray, {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { url: link }
    });
    const offset = 0;
    const length = block.text.length;
    block.entityRanges.push({ offset, length, key });
    return block;
}
function renderChildren(childTokens, entities) {
    if (_.isEmpty(childTokens))
        return initBlockFromText('');
    return childTokens
        .map(token => renderToken(token, entities))
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
    const rootTokens = trystup_1.tokenize(trystup).children;
    const entities = [];
    const block = renderChildren(rootTokens, entities);
    const entityMap = entities.reduce((accum, entity, i) => {
        const key = i.toString();
        accum[key] = entity;
        return accum;
    }, {});
    const rawState = {
        blocks: [block],
        entityMap
    };
    const contentState = draft_js_1.convertFromRaw(rawState);
    return { contentState };
}
exports.renderDraftJS = renderDraftJS;
