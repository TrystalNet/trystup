import { Token } from './token';
export declare enum LinkTypes {
    Internal = 0,
    Trystal = 1,
    Image = 2,
    Other = 3,
}
export declare const RGXLINK: {
    INTERNAL: RegExp;
    TRYSTAL: RegExp;
    IMAGE: RegExp;
};
export declare const isToken: (p: number, s: string) => boolean;
export declare class LinkToken extends Token {
    link: string;
    linkType: LinkTypes;
    constructor(parent: Token, str: string, pos: number);
    images(): any[];
}
