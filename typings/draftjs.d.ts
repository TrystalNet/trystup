declare module "draft-js" {
  export type KETCHUP = 'ABC' | 'DEF'
  export type DraftBlockType = 'unstyled' |
    'paragraph' |
    'header-one' |
    'header-two' |
    'header-three' |
    'header-four' |
    'header-five' |
    'header-six' |
    'unordered-list-item' |
    'ordered-list-item' |
    'blockquote' |
    'code-block' |
    'atomic'
  // -------------------
  export interface InlineStyleRange {
    offset:number
    length:number
    style:string
  }

  export interface Entity {xx:string}
  export interface EntityRange {
    key : number 
    offset : number
    length : number
  }
  export interface ContentState{xx:string }
  // export interface EditorState { xx:string }

  export interface RawDraftContentBlock {
    key?:string
    type: DraftBlockType,
    text: string,
    depth?: number,
    inlineStyleRanges?: InlineStyleRange[],
    entityRanges?: EntityRange[],
    data?: Object
  }
  export function convertFromRaw(rawState:{blocks:RawDraftContentBlock[], entityMap:{}}):ContentState
}