import {api, cardTemplate} from "./index.js";
import {PopupWithImage} from "./PopupWithImage.js";
import {myConfiguration} from "./constants.js";


export class Ard {
    constructor(data, selector) {
        this._data = data;
        this._selector = selector;
        this._ownerId = data.owner._id
        this._likes = data.likes
        this._likedUsersId = new Set(this._likes.map(user => user._id));
        this._myId = myConfiguration.id
        this._handleCardClick = this._handleCardClick.bind(this);
    }

    _isLiked() {
        return this._likedUsersId.has(this._myId);
    }

    _isNotOwner() {
        return this._myId !== this._ownerId
    }

    _createElements() {
        const cardElement = cardTemplate.querySelector(this._selector).cloneNode(true);
        cardElement.querySelector(myConfiguration.elementsTitleSelector).textContent = this._data.name;
        cardElement.querySelector(myConfiguration.elementsImageSelector).src = this._data.link;
        cardElement.querySelector(myConfiguration.elementsImageSelector).alt = 'Изображение ' + this._data.name;
        cardElement.querySelector(myConfiguration.elementsLikeCountClass).textContent = this._likes.length;
        if (this._isNotOwner()) cardElement.querySelector(myConfiguration.deleteButtonSelector).classList.add(myConfiguration.inactiveTrashClass);
        if (this._isLiked()) cardElement.querySelector(myConfiguration.elementsLikeSelector).classList.add(myConfiguration.elementsLikeActiveClass);
        cardElement.querySelector(myConfiguration.elementImageSelector).addEventListener("click", this._handleCardClick);
        cardElement.querySelector(myConfiguration.deleteButtonSelector).addEventListener("click", () => {
            this._handleCardDelete(this);
        });

        cardElement.querySelector(myConfiguration.elementsLikeSelector).addEventListener('click', () => {
            this._handleCardLike(this);
        });

        this.cardElement = cardElement;
        return cardElement;
    }

    _handleCardClick() {
        const popupInstance = new PopupWithImage(myConfiguration.popupImageSelector, this._data.link, this._data.name);
        popupInstance.setEventListeners();
        popupInstance.open();
    }

    _handleCardLike(cardInstance) {
        let method = "PUT";
        if (this._isLiked()) method = "DELETE";
        api.toggleLike(cardInstance._data._id, method)
            .then((result) => {
                this.cardElement.querySelector(myConfiguration.elementsLikeSelector).classList.toggle(myConfiguration.elementsLikeActiveClass);
                this.cardElement.querySelector(myConfiguration.elementsLikeCountClass).textContent = result.likes.length;
                this._likedUsersId = new Set(result.likes.map(user => user._id));
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    _handleCardDelete(cardInstance) {
        api.deleteCard(cardInstance._data._id)
            .then(result => {
                this.cardElement.remove();
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    createCard() {
        return this._createElements();
    }
}
