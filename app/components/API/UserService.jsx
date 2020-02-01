import * as CONST from "../Common/constants"
import axios from 'axios'
import api from './api'

var UserService = {
    // createUser creates user with data
    createUser(user, success, fail) {
        api.shared().post('/users', {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            phone: user.phone,
            status: user.status,
            image: user.image
        })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                fail(error.response.data);
            });
    },

    updateUser(user, success, fail) {
        api.shared().put('/users/' + user.id, {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            status: user.status,
            image: user.image
        })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error)
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    },

    updateUserProfile(user, success, fail) {
        api.shared().put('/users/profile/' + user.id, user)
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error)
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    },

    // deleteUser deletes user with id
    deleteUser(id, success, fail) {
        api.shared().delete('/users/' + id)
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    },

    // readUsers reads all users with query
    readUsers(query, success, fail) {
        api.shared().get('/users?query=' + query, {

        })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    },

    applyDriver(user, success, fail) {
        api.shared().post('driver/register', {
            user_id: user.id,
            location_place_id: user.location_id
        })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error)
                fail(error.response.data);
            });
    }
}

module.exports = UserService;