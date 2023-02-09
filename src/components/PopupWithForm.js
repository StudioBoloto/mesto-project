import {myConfiguration} from "../utils/constants.js";
import {Popup} from "./Popup.js";

export class PopupWithForm extends Popup {
    constructor(selector, submitFormCallback) {
        super(selector);
        this._submitFormCallback = submitFormCallback;
        this._form = this._element.querySelector(myConfiguration.formSelector);
        this._inputList = this._form.querySelectorAll(myConfiguration.inputSelector);
        this._submitButton = this._element.querySelector(myConfiguration.submitButtonClass);
    }

    async _getInputValues() {
        return new Promise((resolve, reject) => {
            try {
                this._formValues = {};
                this._inputList.forEach(input => {
                    this._formValues[input.name] = input.value;
                });
                resolve(this._formValues);
            } catch (error) {
                reject(error);
            }
        });
    }

    setEventListeners() {
        super.setEventListeners();

        this._form.addEventListener('submit', evt => {
            evt.preventDefault();
            const initialText = this._submitButton.textContent;
            this._submitButton.textContent = 'Сохранение...';
            this._getInputValues().then(formValues => {
                this._submitFormCallback(formValues)
                    .then(() => {
                        this.close();
                    })
                    .finally(() => {
                        this._submitButton.textContent = initialText;
                    })
            });
        })
    }

    open() {
        super.open();
    }

    close() {
        this._form.reset();
        super.close();
    }
}