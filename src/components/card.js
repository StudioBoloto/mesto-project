import {openPopup, modalAddCard, modalAddCardForm} from "./modal.js";
import {deleteCard, pushCard, toggleLike} from "./api.js";
import {closePopup} from "./utils";

export {addCard, createCard, cardsContainer}

const modalImage = document.querySelector('#my-popup-image');
const cardsContainer = document.querySelector('.elements');
const cardTemplate = document.querySelector('#card-template').content;
const modalImageName = document.querySelector('.popup__title-image');
const modalImageLink = document.querySelector('.popup__image');


function createCard(cardName, cardLink, myConfiguration, initialCard) {
    const cardElement = cardTemplate.querySelector(myConfiguration.elementsCardSelector).cloneNode(true);
    const modalImageOpen = cardElement.querySelector(myConfiguration.elementImageSelector);
    const cardElementImage = cardElement.querySelector(myConfiguration.elementsImageSelector);
    cardElement.querySelector(myConfiguration.elementsTitleSelector).textContent = cardName;
    const likesCount = cardElement.querySelector(myConfiguration.elementsLikeCountClass);

    const likedUsers = new Set();
    initialCard.likes.forEach((user) => {
        likedUsers.add(user._id);
    });

    likesCount.textContent = initialCard.likes.length;
    cardElementImage.src = cardLink;
    cardElementImage.alt = 'Изображение ' + cardName;
    if (myConfiguration.id !== initialCard.owner._id) {
        cardElement.querySelector(myConfiguration.deleteButtonSelector).classList.add('elements__trash_inactive');
    }
    if (likedUsers.has(myConfiguration.id)) {
        cardElement.querySelector(myConfiguration.elementsLikeSelector).classList.add(myConfiguration.elementsLikeActiveClass);
    }
    cardElement.querySelector(myConfiguration.elementsLikeSelector).addEventListener('click', function (evt) {
        let method = "PUT";
        if (likedUsers.has(myConfiguration.id)) {
            method = "DELETE";
        }
        toggleLike(initialCard._id, method)
            .then((result) => {
                evt.target.classList.toggle(myConfiguration.elementsLikeActiveClass);
                likesCount.textContent = result.likes.length;
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });

    });
    modalImageOpen.addEventListener('click', function () {
        openPopup(modalImage, myConfiguration);
        modalImageLink.src = cardLink;
        modalImageLink.alt = 'Изображение ' + cardName;
        modalImageName.textContent = cardName;
    });
    cardElement.querySelector(myConfiguration.deleteButtonSelector).addEventListener('click', function () {
        deleteCard(initialCard._id)
            .then((result) => {
                cardElement.remove();
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });

    });
    return cardElement;
}

function addCard(cardName, cardLink, myConfiguration) {
    pushCard(cardName, cardLink)
        .then((result) => {
            const cardElement = createCard(cardName, cardLink, myConfiguration, result);
            cardsContainer.prepend(cardElement);
            modalAddCardForm.reset();
            closePopup(modalAddCard, myConfiguration);
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });

}
