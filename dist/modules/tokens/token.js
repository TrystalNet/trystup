"use strict";
class Token {
    constructor(parent = null) {
        this.parent = parent;
        this.children = [];
    }
    images() {
        let images = [];
        this.children.forEach(childToken => images.push(...childToken.images()));
        return images;
    }
}
exports.Token = Token;
