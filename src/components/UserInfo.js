export class UserInfo {
    constructor(nameSelector, aboutSelector, avatarSelector) {
        this._nameElement = document.querySelector(nameSelector);
        this._aboutElement = document.querySelector(aboutSelector);
        this._avatarElement = document.querySelector(avatarSelector);
    }

    getUserInfo() {
        return {
            name: this._nameElement.textContent,
            about: this._aboutElement.textContent
        }
    }

    getUserId() {
        return this._id;
    }

    setUserInfo({name, about, avatar, _id}) {
        this._name = name;
        this._about = about;
        this._avatar = avatar;
        this._id = _id;
        this._nameElement.textContent = this._name;
        this._aboutElement.textContent = this._about;
        this._avatarElement.src = this._avatar;
    }
}