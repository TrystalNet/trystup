"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var token_1 = require('./token');
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
exports.isToken = function (p, s) { return _.startsWith(s, '#[(', p) && s.indexOf(') ', p + 3) > 0; };
var LinkToken = (function (_super) {
    __extends(LinkToken, _super);
    function LinkToken(parent, str, offset) {
        _super.call(this, parent);
        this.link = null;
        this.linkType = null;
        offset += 3;
        var posEnd = str.indexOf(')', offset);
        var link = this.link = str.substring(offset, posEnd);
        if (exports.RGXLINK.INTERNAL.test(link))
            this.linkType = LinkTypes.Internal;
        else if (exports.RGXLINK.TRYSTAL.test(link))
            this.linkType = LinkTypes.Trystal;
        else if (exports.RGXLINK.IMAGE.test(link))
            this.linkType = LinkTypes.Image;
        else
            this.linkType = LinkTypes.Other;
    }
    LinkToken.prototype.images = function () {
        var images = [];
        if (this.linkType === LinkTypes.Image)
            images.push(this.link);
        this.children.forEach(function (token) { return images.push.apply(images, token.images()); });
        return images;
    };
    return LinkToken;
}(token_1.Token));
exports.LinkToken = LinkToken;
