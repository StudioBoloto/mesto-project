export class Card {
    constructor(data, selector, cardClickCallback, cardDeleteCallback, cardLikeCallback, config) {
        this._data = data;
        this._config = config;
        this._template = document.querySelector(selector).content.querySelector(this._config.elementsCardSelector);
        this._cardElement = this._template.cloneNode(true);
        this._elementTitle = this._cardElement.querySelector(this._config.elementsTitleSelector);
        this._elementLikeCount = this._cardElement.querySelector(this._config.elementsLikeCountClass);
        this._elementImage = this._cardElement.querySelector(this._config.elementsImageSelector);
        this._elementLike = this._cardElement.querySelector(this._config.elementsLikeSelector);
        this._elementDelete = this._cardElement.querySelector(this._config.deleteButton);
        this._ownerId = data.owner._id
        this._likes = data.likes
        this._likedUsersId = new Set(this._likes.map(user => user._id));
        this._myId = this._config.id
        this._cardClickCallback = cardClickCallback;
        this._cardDeleteCallback = cardDeleteCallback;
        this._cardLikeCallback = cardLikeCallback;
    }

    _isLiked() {
        return this._likedUsersId.has(this._myId);
    }

    _isNotOwner() {
        return this._myId !== this._ownerId
    }

    _createElements() {
        this._elementTitle.textContent = this._data.name;
        this._elementImage.src = this._data.link;
        this._elementImage.alt = 'Изображение ' + this._data.name;
        this._elementLikeCount.textContent = this._likes.length;
        if (this._isNotOwner()) this._elementDelete.classList.add(this._config.inactiveTrashClass);
        if (this._isLiked()) this._elementLike.classList.add(this._config.elementsLikeActiveClass);
        this._setEventListeners();
        return this._cardElement;
    }

    _setEventListeners() {
        this._elementImage.addEventListener("click", () => {
            this._cardClickCallback(this);
        });

        this._elementDelete.addEventListener("click", () => {
            this._cardDeleteCallback(this);
        });

        this._elementLike.addEventListener('click', () => {
            let method = "PUT";
            if (this._isLiked()) method = "DELETE";
            this._cardLikeCallback(this, method);
        });
    }

    getCardId(){
        return this._data._id;
    }

    addLike(result) {
        this._elementLike.classList.toggle(this._config.elementsLikeActiveClass);
        this._elementLikeCount.textContent = result.likes.length;
        this._likedUsersId = new Set(result.likes.map(user => user._id));
    }

    createCard() {
        return this._createElements();
    }
}
