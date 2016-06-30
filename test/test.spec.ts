import * as _ from 'lodash'
import {convertToRaw } from 'draft-js'
import {renderHtml, renderDraftJS} from '../src/trystup'

describe('Rendering for DraftJS', function() {
  it('Renders simple text into a contentBlack.', () => {
    const trystup = "Hello there world."
    const {contentState} = renderDraftJS(trystup)
    const raw = convertToRaw(contentState)
    expect(raw.blocks[0].text).toEqual(trystup)
  })
  it('Renders trystup with a bold tag', () => {
    const trystup = "hello #[b world]"
    const {contentState} = renderDraftJS(trystup)
    const raw = convertToRaw(contentState)
    expect(raw.blocks[0].inlineStyleRanges[0].style).toEqual('BOLD')
  })
  it('Renders trystup with a link tag', () => {
    const trystup = "hello #[(LINK) world]"
    const {contentState} = renderDraftJS(trystup)
    const raw = convertToRaw(contentState)
    expect(raw.entityMap[0].data.url).toEqual('LINK')
  })
  it('Renders trystup with a date field', () => {
    const trystup = "hello #[=TODAY]."
    const {contentState} = renderDraftJS(trystup)
    const raw = convertToRaw(contentState)
    console.log(raw)
    expect(raw.entityMap[0].data.formula).toEqual('TODAY')
  })
})

describe('Rendering into HTML', function() {
  it('Renders simple text', () => {
    const trystup = "hello world"
    const {rendered,imageLinks} = renderHtml(trystup, {format:'html', useStylesheets:false, showFields:false})
    expect(rendered).toEqual(trystup)
  }),
  it('Renders trystup with a bold tag', () => {
    const trystup = "hello #[b world]"
    const {rendered,imageLinks} = renderHtml(trystup, {format:'html', useStylesheets:false, showFields:false})
    expect(rendered).toEqual("hello <strong>world</strong>")
  })
  it('Renders text with a link tag', () => {
    const trystup = "hello #[(LINK) world]"
    const {rendered,imageLinks} = renderHtml(trystup, {format:'html', useStylesheets:false, showFields:false})
    expect(rendered).toEqual("hello <a target='_blank' href='LINK'>world</a>")
  })
  it('Renders trystup with a date field tag in showFields', () => {
    const trystup = "hello #[=TODAY]"
    const {rendered,imageLinks} = renderHtml(trystup, {format:'html', useStylesheets:false, showFields:true})
    expect(rendered).toEqual("hello <span class='CELL'>TODAY</span>")
  })
  it('Renders trystup with a date field and showHtml', () => {
    const trystup = "hello #[=TODAY]"
    const {rendered,imageLinks} = renderHtml(trystup, {format:'html', useStylesheets:false, showFields:false})
    expect(rendered.length).toBeGreaterThan(10) // todo: make a more specific test
  })
})


