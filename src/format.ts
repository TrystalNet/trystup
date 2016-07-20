import {BackgroundColors, ForegroundColors} from '@trystal/constants'

export type BIUS = 'b' | 'i' | 'u' | 's' 

const BISU = 0, FG=1, BG=2, FAMILY=3, SIZE=4, MGNBTM=5

export const powerUp = (n:number) => n ? Math.pow(2, n-1) : 0

export const toBits = (format:string) => {
  let [bisu='',fg='',bg='',family='',size='',mgnbtm='0'] = format.split('-')
  return [bisu,fg,bg,family,size,mgnbtm]
}
export const toFormat = (bits:string[]) => bits.join('-')

const getBit = (format:string, n:number) => toBits(format)[n]
const getInt = (format:string, n:number) => parseInt(getBit(format, n)) 

export const bisu         = (format:string) => <BIUS>getBit(format, BISU)
export const fg           = (format:string) => getInt(format, FG)
export const bg           = (format:string) => getInt(format, BG)
export const family       = (format:string) => getInt(format, FAMILY)
export const size         = (format:string) => getInt(format, SIZE)
export const marginBottom = (format:string) => getInt(format, MGNBTM)

const fmt = (format:string,fmt:string) => bisu(format).indexOf(fmt) >= 0

export const bold      = (format:string) => fmt(format, 'B')
export const italic    = (format:string) => fmt(format, 'I')
export const underline = (format:string) => fmt(format, 'S')
export const strikeout = (format:string) => fmt(format, 'U')

const set                    = (format:string, index:number, value:string) => {
  const bits =  toBits(format)
  bits[index] = value || ''
  return toFormat(bits)
}
export const setFG           = (format:string, value:string) => set(format, FG,     value)    
export const setBG           = (format:string, value:string) => set(format, BG,     value)    
export const setFamily       = (format:string, value:string) => set(format, FAMILY, value)    
export const setSize         = (format:string, value:string) => set(format, SIZE,   value)    
export const setMarginBottom = (format:string, value:string) => set(format, MGNBTM, value)    

const _unsetBISU = (bit0:string, fmt:string) => bit0.replace(fmt,'')
const _setBISU   = (bit0:string, fmt:string) => bit0.indexOf(fmt) >= 0 ? bit0 : bit0 + fmt
const setBISU    = (format:string, fmt:'B'|'I'|'S'|'U') => { 
  const bits = toBits(format)
  bits[0] = _setBISU(toBits(format)[0], fmt) //   _.set(X, 0, Y)
  return toFormat(bits) 
}
const unsetBISU  = (format:string, fmt:string) => { 
  const bits = toBits(format)
  bits[0] = _unsetBISU(toBits(format)[0], fmt)
  return toFormat(bits) 
}

export const setBold       = (format:string) => setBISU(format, 'B') 
export const setItalic     = (format:string) => setBISU(format, 'I') 
export const setStrikeout  = (format:string) => setBISU(format, 'S') 
export const setUnderline  = (format:string) => setBISU(format, 'U') 

export const unsetBold       = (format:string) => unsetBISU(format, 'B') 
export const unsetItalic     = (format:string) => unsetBISU(format, 'I') 
export const unsetStrikeout  = (format:string) => unsetBISU(format, 'S') 
export const unsetUnderline  = (format:string) => unsetBISU(format, 'U') 

export const combos = (() => {
  const combos = {}

  ;[0, 1, 2, 3, 4, 5].forEach((bg, bgi) => {
    [0, 2, 3, 4, 5].forEach((fg, fgi) => {
      const c = '123456789abcdefghijklmnopqrstu'.charAt(bgi * 5 + fgi)
      combos[c] = { 
        bg: BackgroundColors[bg], 
        fg: ForegroundColors[fg] }
    })
  })
  return combos
})()



