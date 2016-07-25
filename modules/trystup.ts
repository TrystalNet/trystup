console.log('16-07-11A')
import * as Format    from './format'
import {Options}      from './interfaces'
import {Token}        from './tokens/token'
import {StrToken}     from './tokens/str-token'
import {FormulaToken, isToken as isFormulaToken} from './tokens/formula-token'
import {FormatToken,  isToken as isFormatToken}  from './tokens/format-token'
import {LinkToken,    isToken as isLinkToken}    from './tokens/link-token'

import {renderDraftJS} from './render/render-draftjs'
import {renderHtml}    from './render/render-html'
import {renderText}    from './render/render-text'

export const ALOHA = 'HOLA' 

export {Options}
export {Token, StrToken, FormulaToken, FormatToken, LinkToken}
export {isFormulaToken,isFormatToken,isLinkToken}
export {Format}
export {renderDraftJS,renderHtml,renderText}

export function tokenize(str:string) {
  const ROOT = new Token()
  const STRTOKENS = <any[]>[] // keep a list of these so we can easily post process the content at the end
  const posMax = str.length
  let pos = 0
  let TOKEN = ROOT
  while (pos < posMax) {
    const oldpos = pos
    if (str[pos] === ']') {
      if (TOKEN instanceof StrToken) TOKEN = <Token>TOKEN.parent
      if (TOKEN.parent) TOKEN = TOKEN.parent
      pos++
    }
    else if (isFormatToken(str, pos)) {
      if (TOKEN instanceof StrToken) TOKEN = <Token>TOKEN.parent
      const FORMAT = new FormatToken(TOKEN, str, pos + 2)
      TOKEN.children.push(FORMAT)
      TOKEN = FORMAT
      pos += (FORMAT.format.length + 3)
    }
    else if (isLinkToken(pos, str)) {
      if (TOKEN instanceof StrToken) TOKEN = <Token>TOKEN.parent
      let LINK = new LinkToken(TOKEN, str, pos)
      TOKEN.children.push(LINK)
      TOKEN = LINK
      pos += LINK.link!.length + 5
    }
    else if (isFormulaToken(str, pos)) {
      if (TOKEN instanceof StrToken) TOKEN = <Token>TOKEN.parent
      let FORMULA = new FormulaToken(TOKEN, str, pos)
      TOKEN.children.push(FORMULA)
      pos += FORMULA.formula.length + 4  // #[=TODAY]
    }
    else {
      if (!(TOKEN instanceof StrToken)) {
        let RAW = new StrToken(TOKEN, pos)
        TOKEN.children.push(RAW)
        TOKEN = RAW
        STRTOKENS.push(RAW)
      }
      let strToken = TOKEN
      if (str[pos] === '\\' && pos < posMax - 1) {
        strToken.endPos = pos + 1
        pos += 2
      }
      else {
        strToken.endPos = pos
        pos++
      }
    }
    if (pos === oldpos) pos++
  }
  STRTOKENS.forEach((token:any) => token.close(str))
  return ROOT
}

const defaultOptions:Options = {
  showFields:false,
  useStylesheets:true
}


