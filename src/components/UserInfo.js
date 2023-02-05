// export class UserInfo {
//     constructor(selectors, api) {
//         this._nameSelector = selectors.profileAuthorSelector;
//         this._aboutSelector = selectors.profileAboutSelector;
//         this._avatarSelector = selectors.profileAvatarSelector;
//         this._api = api;
//     }
//
//     _updateUserInfo(data) {
//         document.querySelector(this._nameSelector).textContent = data.author;
//         document.querySelector(this._aboutSelector).textContent = data.about;
//     }
//
//     getUserInfo() {
//         return this._api.getUserInfo()
//             .then((data) => {
//                 return data;
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }
//
//     setUserInfo(data) {
//         return this._api.patchProfile(data)
//             .then(() => {
//                 this._updateUserInfo(data)
//                 return Promise.resolve();
//             })
//             .catch((err) => {
//                 console.log(err);
//                 return Promise.reject(err);
//             });
//     }
//
//     setUserAvatar(data) {
//         return this._api.patchAvatar(data)
//             .then(() => {
//                 document.querySelector(this._avatarSelector).src = data.link;
//                 return Promise.resolve();
//             })
//             .catch((err) => {
//                 console.log(err);
//                 return Promise.reject(err);
//             });
//     }
// }

export class UserInfo {
    constructor(nameSelector, aboutSelector, avatarSelector) {
        this._nameElement = document.querySelector(nameSelector);
        this._aboutElement = document.querySelector(aboutSelector);
        this._avatarElement = document.querySelector(avatarSelector);
    }

    // getUserInfo() {
    //     return {
    //         name: this._nameElement.textContent,
    //         about: this._aboutElement.textContent
    //     }
    // }

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