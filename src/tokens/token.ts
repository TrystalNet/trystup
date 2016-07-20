import {Options} from '../interfaces'

export class Token {
  parent:Token | null
  children:Token[]
  endPos:number

  constructor(parent:Token|null = null) {
    this.parent = parent
    this.children = []
  }

  images() {
    let images = <string[]>[]
    this.children.forEach(childToken => images.push(...childToken.images()))
    return images
  }
}
