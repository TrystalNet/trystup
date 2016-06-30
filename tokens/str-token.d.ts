import { Token } from './token';
export declare class StrToken extends Token {
    startPos: number;
    endPos: number;
    str: string | null;
    constructor(parent: Token, startPos?: number);
    close(str: string): void;
}
