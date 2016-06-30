import { Token } from './token';
export declare const isToken: (s: string, p: number) => boolean;
export declare class FormulaToken extends Token {
    formula: string;
    constructor(parent: Token, str: string, pos: number);
}
