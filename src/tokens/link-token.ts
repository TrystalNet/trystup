import { Options } from '../interfaces'
import { Token }   from './token'

export enum LinkTypes {
  Internal,
  Trystal,
  Image,
  Other
}

export const RGXLINK = {
  INTERNAL: /^#[a-z0-9]+$/i,
  TRYSTAL: /^trystal:/i,
  IMAGE: /\.(gif|png|jpe?g)$/i
}

export const isToken = (p:number, s:string) => _.startsWith(s, '#[(', p) && s.indexOf(') ', p + 3) > 0

export class LinkToken extends Token {
  
  link     : string
  linkType : LinkTypes
  
  constructor(parent:Token, str:string, offset:number) {
    super(parent)
    this.link = null
    this.linkType = null
    offset += 3
    let posEnd = str.indexOf(')', offset)
    let link = this.link = str.substring(offset, posEnd)

    if (RGXLINK.INTERNAL.test(link)) this.linkType = LinkTypes.Internal
    else if (RGXLINK.TRYSTAL.test(link)) this.linkType = LinkTypes.Trystal
    else if (RGXLINK.IMAGE.test(link)) this.linkType = LinkTypes.Image
    else this.linkType = LinkTypes.Other
  }

  images() {
    let images = <string[]>[]
    if (this.linkType === LinkTypes.Image) images.push(this.link)
    this.children.forEach(token => images.push(...token.images()))
    return images
  }

  // #[(abc)_
}
