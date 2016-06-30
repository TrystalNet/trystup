export declare class Token {
    parent: Token;
    children: Token[];
    endPos: number;
    constructor(parent?: Token);
    images(): string[];
}
