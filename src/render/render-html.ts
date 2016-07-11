import * as Moment                  from 'moment'
import * as _                       from 'lodash'
import {optionFormatNames, Options} from '../interfaces'
import {Token}                      from '../tokens/token'
import {FormulaToken}               from '../tokens/formula-token'
import {StrToken}                   from '../tokens/str-token'
import {FormatToken}                from '../tokens/format-token'
import {LinkToken, LinkTypes}       from '../tokens/link-token'
import {sizes,faces,bgs,fgs,combos} from '../format'
import {tokenize}                   from '../trystup'

const spanIt = (csstag:string, value:string, content:string) => `<span style='${csstag}:${value}'>${content}</span>`

function renderFormatAsHtml(format:string, content:string, options:Options) {
  const {useStylesheets} = options
  switch (format) {
    case 'b': return `<strong>${content}</strong>`
    case 'i': return `<em>${content}</em>`
    case 's': return `<del>${content}</del>`
    case 'u': return `<ins>${content}</ins>`
  }
  if (useStylesheets) return `<span class='${format}'>${content}</span>`
  if (/^s[1-5]$/i.test(format)) return spanIt('font-size', sizes[format[1]] + 'px', content)
  if (/^f[0-2]$/i.test(format)) return spanIt('font-family', faces[format[1]], content)
  if (/^bg[0-5]$/i.test(format)) return spanIt('background-color', bgs[format[2]], content)
  if (/^fg[02345]$/i.test(format)) return spanIt('color', fgs[format[2]], content)
  if (/^c[0-9a-z]$/i.test(format)) {
    const {fg, bg} = combos[format[1]]
    return `<span style='background-color:${bg},color:${fg}'>${content}</span>`
  }
  return content
}

function renderText(token:StrToken, options:Options) {
  const {str} = token
  if(!str) return ''
  if (options && options.format === 'draftjs') return _.escape(token.str)
  return _.escape(token.str)
}

function renderFormat(token:FormatToken, options:Options) {
  const content = token.children.map(child => render(child, options)).join('')
  switch (options.format) {
    case 'html': return renderFormatAsHtml(token.format, content, options)
    case 'text': return content
    default: return content
  }
}

function renderFormula(token:FormulaToken, options:Options) {
  let {showFields} = options
  let {formula} = token
  if (showFields) return `<span class='CELL'>${formula}</span>`
  switch (formula.toUpperCase()) {
    case 'TODAY': return Moment().format('dddd, MMM Do')
    case 'NOW': return Moment().format('h:mma')
    default: return formula
  }
}

function renderLink(token:LinkToken, options:Options) {
  const {format} = options
  const {link, linkType, children} = token
  const content = children.map((token:Token) => render(token, options)).join('')
  if (format === 'text') return `[${content}](${link})`
  switch (linkType) {
    case LinkTypes.Internal:
    case LinkTypes.Trystal: return `<a href='${link}'>${content}</a>`
    case LinkTypes.Image:
    case LinkTypes.Other: return `<a target='_blank' href='${link}'>${content}</a>`
  }
  return content
}

function render(token:Token, options:Options) : string {
  if(token instanceof FormulaToken) return renderFormula(token, options)
  if(token instanceof LinkToken)    return renderLink(token, options)
  if(token instanceof FormatToken)  return renderFormat(token, options)
  if(token instanceof StrToken)     return renderText(token, options)
  return ''
}

const fixOptions = ({showFields=false,format=<optionFormatNames>'html', useStyleSheets=true})  => ({showFields, format, useStyleSheets})

export function renderHtml(trystup:string, options:Options):{rendered:string, imageLinks:string[]} {
  const root = tokenize(trystup)
  options = fixOptions(options)
  const rendered =  root.children.reduce((ACC, token) =>  ACC + render(token, options), '')
  const imageLinks = root.images()
  return { rendered, imageLinks }
}
