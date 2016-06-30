import * as _ from 'lodash'
import * as Moment from 'moment'
import {Options} from '../interfaces'
import {Token}   from './token'

export const isToken = (str:string, offset:number) => _.startsWith(str, '#[=', offset) && str.indexOf(']', offset + 3) >= 0

export class FormulaToken extends Token {
  
  formula:string
  
  constructor(parent:Token, str:string, offset:number) {
    super(parent)
    offset += 3
    let posEnd = str.indexOf(']', offset)
    this.formula = str.substring(offset, posEnd)
  }

  // #[=abc_
}
