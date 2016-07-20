import * as _ from 'lodash'
import {
  RawDraftContentBlock, EntityRange,
  Entity, ContentState, convertFromRaw/*, EditorState */
} from 'draft-js'

import {Token} from '../tokens/token'
import {RGXLINK, LinkTypes, LinkToken, isToken as LINKTEST} from '../tokens/link-token'
import {FormulaToken, isToken as FORMULATEST} from '../tokens/formula-token'
import {FormatToken, isToken as FORMATTEST} from '../tokens/format-token'
import {StrToken as TextToken} from '../tokens/str-token'
import {tokenize} from '../trystup'

interface JSEntity {
  type: 'LINK' | 'FIELD'
  mutability: 'MUTABLE' | 'IMMUTABLE'
  data: any
}

// interface JSBlock {
//   key?:string
//   text:string 
//   type: 'unstyled' | 'whatever' 
//   inlineStyleRanges: any[]
//   entityRanges: any[]
// }

const CODES = {
  b: 'BOLD', i: 'ITALIC', u: 'UNDERLINE', s: 'STRIKEOUT',
  bg0: 'BG0', bg1: 'BG1', bg2: 'BG2', bg3: 'BG3', bg4: 'BG4', bg5: 'BG5',
  fg0: 'FG0', fg2: 'FG2', fg3: 'FG3', fg4: 'FG4', fg5: 'FG5',
  f0: 'F0', f1: 'F1', f2: 'F2',
  s1: 'S1', s2: 'S2', s3: 'S3', s4: 'S4', s5: 'S5'
}

const initBlockFromText = (text:string):RawDraftContentBlock => { 
  return { 
    text, 
    type: 'unstyled', 
    inlineStyleRanges: <any[]>[], 
    entityRanges: <any[]>[] 
  }
}

function reduceBlocks(block1:RawDraftContentBlock, block2:RawDraftContentBlock):RawDraftContentBlock {
  const oldTextLength = block1.text.length
  block1.text += block2.text
  block2.inlineStyleRanges.forEach((isr:any) => isr.offset += oldTextLength)
  block2.entityRanges.forEach((er:any) => er.offset += oldTextLength)
  block1.inlineStyleRanges = [...block1.inlineStyleRanges, ...block2.inlineStyleRanges]
  block1.entityRanges = [...block1.entityRanges, ...block2.entityRanges]
  return block1
}

function appendEntity(entities:JSEntity[], entitySpec:JSEntity):number {
  entities.push(entitySpec)
  return (entities.length - 1)
}
function renderFormula(token:FormulaToken, entities:JSEntity[]) {
  const {formula} = token
  const block = initBlockFromText(formula) //  renderChildren(children, entityArray)

  const entitySpec : JSEntity = {
    type: 'FIELD',
    mutability: 'IMMUTABLE',
    data: { formula: formula }
  }

  const key = appendEntity(entities, entitySpec)
  const offset = 0
  const length = block.text.length
  const entityRange:EntityRange = { key, offset, length }
  block.entityRanges.push(entityRange)   // <==== what are we doing here
  return block
}
function renderFormat(token: FormatToken, entityArray:JSEntity[]) {
  const block = renderChildren(token.children, entityArray)
  const code = CODES[token.format]
  block.inlineStyleRanges.push({ offset: 0, length: block.text.length, style: code })
  return block
}
function renderText(token:TextToken) {
  return initBlockFromText(token.str || '')
}
function renderLink(token:LinkToken, entityArray:any[]) {
  const {link, children} = token
  const block = renderChildren(children, entityArray)
  const key = appendEntity(entityArray, {
    type: 'LINK',
    mutability: 'MUTABLE',
    data: { url: link }
  })
  const offset = 0
  const length = block.text.length
  block.entityRanges.push({ offset, length, key })   // <==== what are we doing here
  return block
}
function renderChildren(childTokens:Token[], entities:JSEntity[]) : RawDraftContentBlock {
  if (_.isEmpty(childTokens)) return initBlockFromText('')
  return childTokens
    .map(token => renderToken(token, entities))
    .reduce(reduceBlocks)
}
function renderToken(token:Token, entityArray:JSEntity[]) {
  if(token instanceof TextToken)    return renderText(token)
  if(token instanceof FormatToken)  return renderFormat(token, entityArray)
  if(token instanceof FormulaToken) return renderFormula(token, entityArray)
  if(token instanceof LinkToken)    return renderLink(token, entityArray)
  return renderChildren(token.children, entityArray)
}

export function renderDraftJS(trystup:string) : { contentState:ContentState } {
  const rootTokens = tokenize(trystup).children
  const entities = <JSEntity[]>[]
  const block = renderChildren(rootTokens, entities)
  const entityMap = entities.reduce((accum, entity, i) => {
    const key = i.toString()
    accum[key] = entity
    return accum
  }, {})

  // the block doesn't have a 'key' property
  // what is the key supposed to be?

  const rawState = {
    blocks: [block],
    entityMap
  }
  // const contentBlocks = convertFromRaw(rawState)  // merges the entities and raw blocks into contentBlocks
  // const contentState = ContentState.createFromBlockArray(contentBlocks)
  const contentState : ContentState = convertFromRaw(rawState)  // merges the entities and raw blocks into contentBlocks
  // const imageLinks = root.images()
  return { contentState /*, imageLinks*/ }
}


