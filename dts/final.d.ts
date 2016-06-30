declare module "trystup" {
    export type optionFormatNames = 'text' | 'html'

    export interface Options {
        format: optionFormatNames;
        showFields?: boolean;
        useStylesheets? : boolean;  
    }

    export class Token {
        parent: Token;
        children: Token[];
        endPos: number;
        constructor(parent?: Token);
        images(): string[];
    }

    export const isFormatToken: (str: string, offset: number) => boolean;
    export class FormatToken extends Token {
        format: string;
        constructor(parent: Token, str: string, offset: number);
    }

    export const isFormulaToken: (str: string, offset: number) => boolean;
    export class FormulaToken extends Token {
        formula: string;
        constructor(parent: Token, str: string, offset: number);
    }

    export enum LinkTypes {
        Internal = 0,
        Trystal = 1,
        Image = 2,
        Other = 3,
    }
    export const RGXLINK: {
        INTERNAL: RegExp;
        TRYSTAL: RegExp;
        IMAGE: RegExp;
    };
    export const isLinkToken: (offset: number, str: string) => boolean;
    export class LinkToken extends Token {
        link: string;
        linkType: LinkTypes;
        constructor(parent: Token, str: string, offset: number);
        images(): string[];
    }

    export class StrToken extends Token {
        startPos: number;
        endPos: number;
        str: string | null;
        constructor(parent: Token, offset?: number);
        close(str: string): void;
    }

  export function tokenize(str: string): Token;

  export namespace Format {
    export const powerUp: (n: number) => number;
    export const fgs: string[];
    export const bgs: string[];
    export const sizes: number[];
    export const faces: string[];
    export const toBits: (format: string) => string[];
    export const toFormat: (bits: string[]) => string;
    export const bisu: (format: string) => string;
    export const fg: (format: string) => number;
    export const bg: (format: string) => number;
    export const family: (format: string) => number;
    export const size: (format: string) => number;
    export const marginBottom: (format: string) => number;
    export const bold: (format: string) => boolean;
    export const italic: (format: string) => boolean;
    export const underline: (format: string) => boolean;
    export const strikeout: (format: string) => boolean;
    export const setFG: (format: string, value: string) => string;
    export const setBG: (format: string, value: string) => string;
    export const setFamily: (format: string, value: string) => string;
    export const setSize: (format: string, value: string) => string;
    export const setMarginBottom: (format: string, value: string) => string;
    export const setBold: (format: string) => string;
    export const setItalic: (format: string) => string;
    export const setStrikeout: (format: string) => string;
    export const setUnderline: (format: string) => string;
    export const unsetBold: (format: string) => string;
    export const unsetItalic: (format: string) => string;
    export const unsetStrikeout: (format: string) => string;
    export const unsetUnderline: (format: string) => string;
    export const combos: {};
  }
}
