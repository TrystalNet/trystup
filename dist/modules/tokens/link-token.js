"use strict";
const token_1 = require('./token');
(function (LinkTypes) {
    LinkTypes[LinkTypes["Internal"] = 0] = "Internal";
    LinkTypes[LinkTypes["Trystal"] = 1] = "Trystal";
    LinkTypes[LinkTypes["Image"] = 2] = "Image";
    LinkTypes[LinkTypes["Other"] = 3] = "Other";
})(exports.LinkTypes || (exports.LinkTypes = {}));
var LinkTypes = exports.LinkTypes;
exports.RGXLINK = {
    INTERNAL: /^#[a-z0-9]+$/i,
    TRYSTAL: /^trystal:/i,
    IMAGE: /\.(gif|png|jpe?g)$/i
};
exports.isToken = (p, s) => _.startsWith(s, '#[(', p) && s.indexOf(') ', p + 3) > 0;
class LinkToken extends token_1.Token {
    constructor(parent, str, offset) {
        super(parent);
        this.link = null;
        this.linkType = null;
        offset += 3;
        let posEnd = str.indexOf(')', offset);
        let link = this.link = str.substring(offset, posEnd);
        if (exports.RGXLINK.INTERNAL.test(link))
            this.linkType = LinkTypes.Internal;
        else if (exports.RGXLINK.TRYSTAL.test(link))
            this.linkType = LinkTypes.Trystal;
        else if (exports.RGXLINK.IMAGE.test(link))
            this.linkType = LinkTypes.Image;
        else
            this.linkType = LinkTypes.Other;
    }
    images() {
        let images = [];
        if (this.linkType === LinkTypes.Image && this.link)
            images.push(this.link);
        this.children.forEach(token => images.push(...token.images()));
        return images;
    }
}
exports.LinkToken = LinkToken;
