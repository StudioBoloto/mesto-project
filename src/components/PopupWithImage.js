import {Popup} from "./Popup.js";

export class PopupWithImage extends Popup {
    constructor(selector) {
        super(selector);
        this._popupImage = this._element.querySelector('.popup__image');
        this._popupImageTitle = this._element.querySelector('.popup__title-image')
    }

    open(imageLink, imageName) {
        this._imageLink = imageLink;
        this._imageName = imageName;
        super.open();
        this._popupImage.src = this._imageLink;
        this._popupImage.alt = this._imageName;
        this._popupImageTitle.textContent = this._imageName;
    }
}