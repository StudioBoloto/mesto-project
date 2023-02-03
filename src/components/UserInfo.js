import {myConfiguration} from "./constants";

export {handleEscape, closePopup, renderLoading}

function closePopup(popup, myConfiguration) {
    popup.classList.remove(myConfiguration.openedPopupClass);
    document.removeEventListener('keydown', handleEscape);

}

function handleEscape(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_opened');
        closePopup(openedPopup, myConfiguration);
    }
}

function renderLoading(popup, buttonLabel) {
    popup.querySelector(myConfiguration.submitButtonSelector).textContent = buttonLabel;
}
