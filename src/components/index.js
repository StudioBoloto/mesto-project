import '../pages/index.css';

import {Api} from "./Api.js";
import {PopupWithForm} from "./PopupWithForm.js";
import {FormValidator} from "./FormValidator.js";
import {Ard} from "./Сard.js";
import {UserInfo} from "./UserInfo.js";
import {Section} from "./Section.js";
import {myConfiguration} from "./constants.js";


export const cardTemplate = document.querySelector(myConfiguration.cardTemplateSelector).content;
const inputUserName = document.querySelector(myConfiguration.editProfileAuthorSelector);
const inputUserTitle = document.querySelector(myConfiguration.editProfileAboutSelector);
const popups = document.querySelectorAll(myConfiguration.popupSelector);
const popupsWithForm = Array.from(popups).filter(popup => popup.querySelector(myConfiguration.formSelector));

export const api = new Api(myConfiguration.apiConfig);
export const userInfo = new UserInfo(myConfiguration, api);

const allPromise = Promise.all([userInfo.getUserInfo(), api.getInitialCards()]);

allPromise.then(([userProfile, initialCards]) => {
    myConfiguration.id = userProfile._id;
    userInfo.setUserAvatar({link: userProfile.avatar});
    userInfo.setUserInfo({author: userProfile.name, about: userProfile.about});

    const cardsContainer = new Section({
        data: initialCards,
        renderer: (item) => {
            const card = new Ard(item, myConfiguration.elementsCardSelector);
            const cardElement = card.createCard();
            cardsContainer.addItem(cardElement);
        }
    }, myConfiguration.cardsContainerSelector);
    cardsContainer.renderItems();
})
    .catch((err) => {
        console.log(err);
    });

function addCard(data) {
    api.pushCard(data)
        .then((result) => {
            const cardsContainer = new Section({
                data: [result],
                renderer: (item) => {
                    const card = new Ard(item, myConfiguration.elementsCardSelector);
                    const cardElement = card.createCard();
                    cardsContainer.addItem(cardElement, true);
                }
            }, myConfiguration.cardsContainerSelector);
            const modalAddCard = new PopupWithForm(myConfiguration.popupAddSelector, () => {
            });
            modalAddCard.close();
            cardsContainer.renderItems();
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

popupsWithForm.forEach((popup) => {
    const form = popup.querySelector(myConfiguration.formSelector)
    const formValidator = new FormValidator(myConfiguration, form);
    formValidator.enableValidation();
    const selector = `#${popup.id}`;
    const popupInstanceWithForm = (() => {
        let popupWithForm = null;
        switch (selector) {
            case myConfiguration.popupAddSelector:
                popupWithForm = new PopupWithForm(selector, addCard);
                document.querySelector(myConfiguration.addButtonSelector).addEventListener('click', function () {
                    popupWithForm.open();
                });
                return popupWithForm;
            case myConfiguration.popupEditSelector:
                popupWithForm = new PopupWithForm(selector, userInfo.setUserInfo.bind(userInfo));
                document.querySelector(myConfiguration.editButtonSelector).addEventListener('click', function () {
                    inputUserName.value = document.querySelector(myConfiguration.profileAuthorSelector).textContent;
                    inputUserTitle.value = document.querySelector(myConfiguration.profileAboutSelector).textContent;
                    popupWithForm.open();
                });
                return popupWithForm;
            case myConfiguration.popupAvatarSelector:
                popupWithForm = new PopupWithForm(selector, userInfo.setUserAvatar.bind(userInfo));
                document.querySelector(myConfiguration.avatarSelector).addEventListener('click', function () {
                    popupWithForm.open();
                });
                return popupWithForm;
            default:
                popupWithForm = new PopupWithForm(selector, () => {
                });
                return popupWithForm;
        }
    })();

    popupInstanceWithForm.setEventListeners();
});
