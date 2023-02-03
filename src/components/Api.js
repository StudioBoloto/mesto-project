const config = {
    baseUrl: 'https://nomoreparties.co/v1/plus-cohort-18',
    headers: {
        authorization: '63492307-542e-4f00-8b8a-a7276b6e840e',
        'Content-Type': 'application/json'
    }
}

function checkServerResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

export const getUserInfo = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
        .then((res) => {
            return checkServerResponse(res);
        });
}

export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
        .then((res) => {
            return checkServerResponse(res);
        });
}

export const patchProfile = (profileName, profileTitle) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: profileName,
            about: profileTitle
        })
    })
        .then((res) => {
            return checkServerResponse(res);
        });
}

export const patchAvatar = (avatarLink) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: avatarLink
        })
    })
        .then((res) => {
            return checkServerResponse(res);
        });
}

export const pushCard = (cardName, cardLink) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: cardName,
            link: cardLink
        })
    })
        .then((res) => {
            return checkServerResponse(res);
        });
}

export const deleteCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
        .then((res) => {
            return checkServerResponse(res);
        });
}

export const toggleLike = (cardId, method) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: method,
        headers: config.headers
    })
        .then((res) => {
            return checkServerResponse(res);
        });
}