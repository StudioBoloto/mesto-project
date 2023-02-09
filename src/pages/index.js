import './index.css';

import {Api} from "../components/Api.js";
import {PopupWithForm} from "../components/PopupWithForm.js";
import {FormValidator} from "../components/FormValidator.js";
import {Card} from "../components/Сard.js";
import {UserInfo} from "../components/UserInfo.js";
import {Section} from "../components/Section.js";
import {PopupWithImage} from "../components/PopupWithImage.js";
import {myConfiguration} from "../utils/constants.js";


const popups = document.querySelectorAll(myConfiguration.popupClass);
const popupsWithForm = Array.from(popups).filter(popup => popup.querySelector(myConfiguration.formSelector));


export const api = new Api(myConfiguration.apiConfig);
export const userInfo = new UserInfo(myConfiguration.profileAuthorSelector,
    myConfiguration.profileAboutSelector,
    myConfiguration.profileAvatarSelector);

const allPromise = Promise.all([api.getUserInfo(), api.getInitialCards()]);
let cardsContainer = null;

allPromise.then(([userProfile, initialCards]) => {
    userInfo.setUserInfo(userProfile);
    myConfiguration.id = userInfo.getUserId()

    cardsContainer = new Section({
        data: initialCards, renderer: (item) => {
            const cardElement = createCard(item);
            cardsContainer.addItem(cardElement);
        }
    }, myConfiguration.cardsContainerClass);
    cardsContainer.renderItems();

})
    .catch((err) => {
        console.log(err);
    });

function createCard(item) {
    const card = new Card(item,
        myConfiguration.cardTemplateSelector,
        handleCardClick,
        handleCardDelete,
        handleCardLike,
        myConfiguration,
    );
    return card.createCard();
}

function addCard(data) {
    return api.pushCard(data)
        .then((result) => {
            const cardElement = createCard(result);
            cardsContainer.addItem(cardElement, result);
            cardsContainer.renderItems();
            return Promise.resolve(result);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
}


const popupInstance = new PopupWithImage(myConfiguration.popupImageForm);
popupInstance.setEventListeners();

export function handleCardClick(cardInstance) {
    popupInstance.open(cardInstance._data.link, cardInstance._data.name);
}

export function handleCardLike(cardInstance, method) {
    api.toggleLike(cardInstance.getCardId(), method)
        .then((result) => {
            cardInstance.addLike(result);
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

export function handleCardDelete(cardInstance) {
    api.deleteCard(cardInstance.getCardId())
        .then(result => {
            this._cardElement.remove();
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
}

export function setUserAvatar(data) {
    return api.patchAvatar(data)
        .then(result => {
            userInfo.setUserInfo(result);
            return Promise.resolve();
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
}

export function patchUserInfo(data) {
    return api.patchProfile(data)
        .then(result => {
            userInfo.setUserInfo(result);
            return Promise.resolve();
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
}

popupsWithForm.forEach((popup) => {
    const form = popup.querySelector(myConfiguration.formSelector)
    const formValidator = new FormValidator(myConfiguration, form);
    formValidator.enableValidation();
    let addButtonSelector = null;
    const formType = `#${popup.id}`;
    const popupInstanceWithForm = (() => {
        let popupWithForm;
        switch (formType) {
            case myConfiguration.popupAddForm:
                popupWithForm = new PopupWithForm(formType, addCard);
                addButtonSelector = myConfiguration.addButtonClass;
                return popupWithForm;
            case myConfiguration.popupEditForm:
                // popupWithForm = new PopupWithForm(formType, userInfo.setUserInfo.bind(userInfo));
                popupWithForm = new PopupWithForm(formType, patchUserInfo);
                addButtonSelector = myConfiguration.editButtonClass;
                return popupWithForm;
            case myConfiguration.popupAvatarForm:
                // popupWithForm = new PopupWithForm(formType, userInfo.setUserAvatar.bind(userInfo));
                popupWithForm = new PopupWithForm(formType, setUserAvatar);
                addButtonSelector = myConfiguration.avatarButton;
                return popupWithForm;
            default:
                popupWithForm = new PopupWithForm(formType, () => {
                });
                return popupWithForm;
        }
    })();
    document.querySelector(addButtonSelector).addEventListener('click', () => {
        if (addButtonSelector === myConfiguration.editButtonClass) {
            const inputUserInfo = userInfo.getUserInfo();
            const inputUserName = document.querySelector(myConfiguration.editProfileAuthorInput);
            const inputUserTitle = document.querySelector(myConfiguration.editProfileAboutInput);
            inputUserName.value = inputUserInfo.name;
            inputUserTitle.value = inputUserInfo.about;
        }
        popupInstanceWithForm.open()
    });
    popupInstanceWithForm.setEventListeners();
});
