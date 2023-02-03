export class Api {
    constructor({baseUrl, headers}) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _handleResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    _fetch(url, options = {}) {
        return fetch(`${this._baseUrl}${url}`, {...options, headers: this._headers})
            .then(res => this._handleResponse(res));
    }

    getUserInfo() {
        return this._fetch('/users/me');
    }

    getInitialCards() {
        return this._fetch('/cards');
    }

    patchProfile(data) {
        return this._fetch('/users/me', {
            method: 'PATCH', body: JSON.stringify({name: data.author, about: data.about})
        });
    }

    patchAvatar(data) {
        return this._fetch('/users/me/avatar', {
            method: 'PATCH', body: JSON.stringify({avatar: data.link})
        });
    }

    pushCard(data) {
        return this._fetch('/cards', {
            method: 'POST', body: JSON.stringify({name: data.title, link: data.link})
        });
    }

    deleteCard(cardId) {
        return this._fetch(`/cards/${cardId}`, {method: 'DELETE'});
    }

    toggleLike(cardId, method) {
        return this._fetch(`/cards/likes/${cardId}`, {method});
    }
}
