import {Options} from '../interfaces'
import {Token}   from './token'

export const isToken = (str:string, offset:number) => {
  if (!_.startsWith(str, '#[', offset)) return false
  offset += 2
  let spacePos = str.indexOf(' ', offset) - offset
  switch (spacePos) {
    case 1: return 'bisu'.indexOf(str[offset]) >= 0
    case 2:
      switch (str[offset]) {
        case 's': return '12345'.indexOf(str[offset + 1]) >= 0
        case 'f': return '012'.indexOf(str[offset + 1]) >= 0
        default: return false
      }
    case 3:
      if (str[offset + 1] !== 'g') return false
      switch (str[offset]) {
        case 'f': return _.includes(['0', '2', '3', '4', '5'], str[offset + 2])
        case 'b': return _.includes(['0', '1', '2', '3', '4', '5'], str[offset + 2])
        default: return false
      }
  }
  return false
}

export class FormatToken extends Token {

  format:string
  
  constructor(parent:Token, str:string, offset:number) {
    super(parent)
    this.format = str.substring(offset, str.indexOf(' ', offset)).toLowerCase()
  }
}
