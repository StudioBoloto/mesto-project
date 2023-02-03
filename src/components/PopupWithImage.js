import {Popup} from "./Popup.js";

export class PopupWithImage extends Popup {
    constructor(selector, imageLink, imageName) {
        super(selector);
        this._imageLink = imageLink;
        this._imageName = imageName;
    }

    open() {
        super.open();
        this._element.querySelector('.popup__image').src = this._imageLink;
        this._element.querySelector('.popup__image').alt = this._imageName;
        this._element.querySelector('.popup__title-image').textContent = this._imageName;
    }
}