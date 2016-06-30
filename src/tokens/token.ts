import {Options} from '../interfaces'

export class Token {
  parent:Token
  children:Token[]
  endPos:number

  constructor(parent:Token = null) {
    this.parent = parent
    this.children = []
  }

  images() {
    let images = <string[]>[]
    this.children.forEach(childToken => images.push(...childToken.images()))
    return images
  }
}
