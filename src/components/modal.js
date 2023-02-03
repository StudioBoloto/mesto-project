import {addCard} from "./card.js";
import {myConfiguration} from "./constants.js";
import {handleEscape, closePopup, renderLoading} from "./utils.js";
import {patchAvatar, patchProfile} from "./api.js"

export {openPopup, editProfile, editAvatar, modalAddCard, modalAddCardForm}

const profileInfo = document.querySelector('.profile__info');
const profileAuthor = profileInfo.querySelector('.profile__author');
const profileAbout = profileInfo.querySelector('.profile__about');
const profileAvatar = document.querySelector('.profile__avatar');
const modalAvatarOpen = document.querySelector(myConfiguration.avatarSelector);
const inputCardName = document.querySelector('#add-card-title');
const inputCardLink = document.querySelector('#add-card-link');
const inputAvatarLink = document.querySelector('#avatar-link');
const modalAddCardForm = document.forms["add-card-form"];
const modalEditAvatar = document.forms["edit-avatar-form"];
const inputUserName = document.querySelector('#edit-profile-name');
const inputUserTitle = document.querySelector('#edit-profile-title');
const modalEditProfileForm = document.forms["profile-edit-form"];
const modalAddCard = document.querySelector('#myPopupAdd');
const modalAvatar = document.querySelector('#myPopupAvatar');
const btnOpenAddCardModal = document.querySelector('#btnOpenAdd');
const modalEditProfile = document.querySelector('#myPopupEdit');
const btnOpenEditProfileModal = document.querySelector('#btn-open-edit');

function openPopup(popup, myConfiguration) {
    popup.classList.add(myConfiguration.openedPopupClass);
    document.addEventListener('keydown', handleEscape);

}

const popups = Array.from(document.querySelectorAll('.popup'));

popups.forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
        if (evt.target.classList.contains(myConfiguration.openedPopupClass)) {
            closePopup(popup, myConfiguration)
        }
        if (evt.target.classList.contains(myConfiguration.closeButtonClass)) {
            closePopup(popup, myConfiguration)
        }
    })
})

function editProfile(profileName, profileTitle) {
    patchProfile(profileName, profileTitle)
        .then((result) => {
            profileAuthor.textContent = result.name;
            profileAbout.textContent = result.about;
            closePopup(modalEditProfile, myConfiguration);
        })
        .catch((err) => {
            console.log(err);
        });
}

function editAvatar(avatarLink) {
    patchAvatar(avatarLink)
        .then((result) => {
            profileAvatar.src = result.avatar;
            modalEditAvatar.reset();
            closePopup(modalAvatar, myConfiguration);
        })
        .catch((err) => {
            console.log(err);
        });
}

modalEditAvatar.addEventListener('submit', function (evt) {
    evt.preventDefault();
    editAvatar(inputAvatarLink.value);
});

modalAvatarOpen.addEventListener('click', function () {
    renderLoading(modalAvatar, myConfiguration.createButtonLabel);
    openPopup(modalAvatar, myConfiguration);
});

modalAddCardForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    addCard(inputCardName.value, inputCardLink.value, myConfiguration);
});

modalEditProfileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    renderLoading(modalEditProfileForm, myConfiguration.progressButtonLabel);
    editProfile(inputUserName.value, inputUserTitle.value);
});

btnOpenAddCardModal.addEventListener('click', function () {
    renderLoading(modalAddCard, myConfiguration.createButtonLabel);
    openPopup(modalAddCard, myConfiguration);
});

btnOpenEditProfileModal.addEventListener('click', function () {
    inputUserName.value = profileAuthor.textContent;
    inputUserTitle.value = profileAbout.textContent;
    renderLoading(modalEditProfile, myConfiguration.saveButtonLabel);
    openPopup(modalEditProfile, myConfiguration);
});
