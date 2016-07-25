import {Options} from '../interfaces'
import {Token}   from './token'

export class StrToken extends Token {

  startPos : number 
  endPos   : number 
  str      : string|null
  
  constructor(parent:Token, offset = 0) {
    super(parent)
    this.startPos = offset
    this.endPos = offset
    this.str = null
  }

  close(str:string) {
    let s = str.substring(this.startPos, this.endPos + 1)
    s = s.replace(/\\([#\\\]])/g, '$1')  // convert escaped pound, backslash, and sqclose into the chars
    this.str = s
  }
  
}
