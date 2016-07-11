import * as Moment                  from 'moment'
import * as _                       from 'lodash'
import {Options}                    from '../interfaces'
import {Token}                      from '../tokens/token'
import {FormulaToken}               from '../tokens/formula-token'
import {StrToken}                   from '../tokens/str-token'
import {FormatToken}                from '../tokens/format-token'
import {LinkToken}                  from '../tokens/link-token'
import {tokenize}                   from '../trystup'

function renderFormula(token:FormulaToken, options:Options) {
  let {showFields} = options
  let {formula} = token
  if (showFields) return `[${formula}]`
  switch (formula.toUpperCase()) {
    case 'TODAY': return Moment().format('dddd, MMM Do')
    case 'NOW': return Moment().format('h:mma')
    default: return formula
  }
}

function renderLink(token:LinkToken, options:Options) {
  const {link, linkType, children} = token
  const content = children.map((token:Token) => render(token, options)).join('')
  return `[${content}](${link})`
}

function render(token:Token, options:Options) : string {
  if(token instanceof FormulaToken) return renderFormula(token, options)
  if(token instanceof LinkToken)    return renderLink(token, options)
  if(token instanceof FormatToken)  return token.children.map(child => render(child, options)).join('') 
  if(token instanceof StrToken)     return  _.escape(token.str || '')
  return ''
}

const fixOptions = ({showFields=false})  => ({showFields})

export function renderText(trystup:string, options:Options):{rendered:string, imageLinks:string[]} {
  const root = tokenize(trystup)
  options = fixOptions(options)
  const rendered =  root.children.reduce((ACC, token) =>  ACC + render(token, options), '')
  const imageLinks = root.images()
  return { rendered, imageLinks }
}
