import {myConfiguration} from "./constants.js";
import {Popup} from "./Popup.js";

export class PopupWithForm extends Popup {
    constructor(selector, submitFormCallback) {
        super(selector);
        this._submitFormCallback = submitFormCallback;
        this._form = this._element.querySelector(myConfiguration.formSelector);
    }

    _getInputValues() {
        this._inputList = this._form.querySelectorAll(myConfiguration.inputSelector);
        this._formValues = {};
        this._inputList.forEach(input => {
            this._formValues[input.name] = input.value;
        });
        return this._formValues;
    }

    setEventListeners() {
        super.setEventListeners();
        this._form.addEventListener("submit", evt => {
            evt.preventDefault();
            this._submitFormCallback(this._getInputValues());
            this._renderLoading(myConfiguration.progressButtonLabel);
            this.close();
        });
    }

    open() {
        super._renderLoading(myConfiguration.createButtonLabel);
        super.open();
    }

    close() {
        this._form.reset();
        super.close();
    }
}