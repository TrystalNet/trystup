"use strict";
var Token = (function () {
    function Token(parent) {
        if (parent === void 0) { parent = null; }
        this.parent = parent;
        this.children = [];
    }
    Token.prototype.images = function () {
        var images = [];
        this.children.forEach(function (childToken) { return images.push.apply(images, childToken.images()); });
        return images;
    };
    return Token;
}());
exports.Token = Token;
