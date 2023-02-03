export class FormValidator {
    constructor(myConfiguration, formElement) {
        this._myConfiguration = myConfiguration;
        this._formElement = formElement;
    }

    _showInputError(inputElement) {
        const errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.add(this._myConfiguration.inputInvalidSelector);
        errorElement.textContent = inputElement.validationMessage;
        errorElement.classList.add(this._myConfiguration.inputErrorSelector);
    }

    _hideInputError(inputElement) {
        const errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.remove(this._myConfiguration.inputInvalidSelector);
        errorElement.classList.remove(this._myConfiguration.inputErrorSelector);
        errorElement.textContent = '';
    }

    _isValidHttpUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    }

    _isValidString(string) {
        let re = new RegExp(/^[\p{Script=Latin}\p{Script=Cyrl}\s\-]*$/u);
        return re.test(string);
    }

    _checkInputValidity(inputElement) {
        if (inputElement.type === "url" && !this._isValidHttpUrl(inputElement.value)) {
            inputElement.setCustomValidity(inputElement.dataset.urlError);
            this._showInputError(inputElement);
        } else if (inputElement.validity.valueMissing) {
            inputElement.setCustomValidity(inputElement.dataset.emptyError);
            this._showInputError(inputElement);
        } else if (inputElement.type !== "url" && !this._isValidString(inputElement.value)) {
            inputElement.setCustomValidity(inputElement.dataset.symbolsError);
            this._showInputError(inputElement);
        } else if (inputElement.validity.tooShort) {
            inputElement.setCustomValidity(inputElement.dataset.lengthError);
            this._showInputError(inputElement);
        } else {
            inputElement.setCustomValidity("");
            this._hideInputError(inputElement);
        }
    }

    _setEventListeners() {
        const inputList = Array.from(this._formElement.querySelectorAll(this._myConfiguration.inputSelector));
        const buttonElement = this._formElement.querySelector(this._myConfiguration.submitButtonSelector);

        this._toggleButtonState(inputList, buttonElement);

        this._formElement.addEventListener('reset', () => {
            setTimeout(() => {
                inputList.forEach((inputElement) => {
                    this._hideInputError(inputElement);
                });
                this._toggleButtonState(inputList, buttonElement, this._myConfiguration);
            }, 0);
        });

        inputList.forEach((inputElement) => {
            inputElement.addEventListener("input", () => {
                this._checkInputValidity(inputElement);
                this._toggleButtonState(inputList, buttonElement);
            });
        });
    }

    enableValidation() {
        this._setEventListeners();
    }

    _hasInvalidInput(inputList) {
        return inputList.some((inputElement) => {
            return !inputElement.validity.valid;
        });
    }

    _toggleButtonState(inputList, buttonElement) {
        if (this._hasInvalidInput(inputList)) {
            buttonElement.classList.add(this._myConfiguration.inactiveButtonClass);
            buttonElement.setAttribute('disabled', 'disabled');
        } else {
            buttonElement.classList.remove(this._myConfiguration.inactiveButtonClass);
            buttonElement.removeAttribute('disabled');
        }
    }
}
