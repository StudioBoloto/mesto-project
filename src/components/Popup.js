import {myConfiguration} from "../utils/constants.js";


export class Popup {
    constructor(selector) {
        this._element = document.querySelector(selector);
        this._handleEscClose = this._handleEscClose.bind(this);
    }

    open() {
        this._element.classList.add(myConfiguration.openedPopupClass);
        document.addEventListener('keydown', this._handleEscClose);
    }

    close() {
        this._element.classList.remove(myConfiguration.openedPopupClass);
        document.removeEventListener('keydown', this._handleEscClose);
    }

    setEventListeners(addButtonSelector=null) {
        if (addButtonSelector) {
            document.querySelector(addButtonSelector).addEventListener('click', () => this.open());
        }
        this._element.addEventListener("mousedown", evt => {
            if (evt.target.classList.contains(myConfiguration.openedPopupClass)) {
                this.close();
            }
            if (evt.target.classList.contains(myConfiguration.closeButtonClass)) {
                this.close();
            }
        });
    }

    _handleEscClose(evt) {
        if (evt.key === 'Escape') {
            this.close();
        }
    }
}
