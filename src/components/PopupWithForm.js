import {myConfiguration} from "../utils/constants.js";
import {Popup} from "./Popup.js";

export class PopupWithForm extends Popup {
    constructor(selector, submitFormCallback) {
        super(selector);
        this._selector = selector;
        this._submitFormCallback = submitFormCallback;
        this._form = this._element.querySelector(myConfiguration.formSelector);
    }

    async _getInputValues() {
        return new Promise((resolve, reject) => {
            try {
                this._inputList = this._form.querySelectorAll(myConfiguration.inputSelector);
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


    setEventListeners(addButtonSelector) {
        super.setEventListeners(addButtonSelector);
        this._form.addEventListener("submit", evt => {
            evt.preventDefault();
            this._getInputValues().then(formValues => {
                this._submitFormCallback(formValues)
                    .then(() => {
                        this.close();
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
            this._renderLoading(myConfiguration.progressButtonLabel);
        });
    }

    _updatePlaceholders() {
        const inputUserName = document.querySelector(myConfiguration.editProfileAuthorInput);
        const inputUserTitle = document.querySelector(myConfiguration.editProfileAboutInput);
        inputUserName.value = document.querySelector(myConfiguration.profileAuthorSelector).textContent;
        inputUserTitle.value = document.querySelector(myConfiguration.profileAboutSelector).textContent;
    }

    _renderLoading(buttonLabel) {
        this._element.querySelector(myConfiguration.submitButtonClass).textContent = buttonLabel;
    }

    open() {
        (this._selector !== myConfiguration.popupEditForm)?
        this._renderLoading(myConfiguration.createButtonLabel)
        :this._renderLoading(myConfiguration.saveButtonLabel);
        this._updatePlaceholders();
        super.open();
    }

    close() {
        this._form.reset();
        super.close();
    }
}