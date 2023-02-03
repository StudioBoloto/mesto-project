import '../pages/index.css';
import {createCard, cardsContainer} from "./card.js";
import {myConfiguration} from "./constants.js";
import {enableValidation} from "./validate.js"
import {editProfile, editAvatar} from "./modal.js"
import {getUserInfo, getInitialCards} from "./api.js";

const allPromise = Promise.all([getUserInfo(), getInitialCards()]);

allPromise.then(([userInfo, initialCards]) => {
    editProfile(userInfo.name, userInfo.about);
    editAvatar(userInfo.avatar);
    myConfiguration.id = userInfo._id;
    console.log(userInfo);

    initialCards.forEach((initialCard) => {
        const cardElement = createCard(initialCard.name, initialCard.link, myConfiguration, initialCard);
        cardsContainer.append(cardElement);
    });
    console.log(initialCards);
})
    .catch((err) => {
        console.log(err);
    });

enableValidation(myConfiguration);