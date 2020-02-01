import * as CONST from "../Common/constants"
import axios from 'axios'
import api from './api'
import Config from '../Common/Config'

var AdminService = {
    // createUser creates user with data
    createAdmin(admin, success, fail) {
        api.shared().post('/admins',
            {
                image: admin.image,
                firstname: admin.firstname,
                lastname: admin.lastname,
                email: admin.email,
                password: admin.password,
                role_code: admin.role_code,
                isVerify: admin.isVerify,
                status: admin.status
            })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                fail(error.response.data);
            });
    },

    updateAdmin(admin, success, fail) {
        api.shared().put('/admins/' + admin.id, admin)
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
    deleteAdmin(id, success, fail) {
        api.shared().delete('/admins/' + id)
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                fail(error.response.data);
            });
    },

    // readUsers reads all users with query
    readAdmins(query, success, fail) {
        api.shared().get('/admins?query=' + query,
            {

            })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                fail(error.response);
            });
    },

    setPassword(user, success, fail) {
        api.shared().post('/admins/setPassword',
            {
                old_password: user.password,
                new_password: user.new_password,
            })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                fail(error.response.data);
            });
    },

    readAdminURLGroups(success, fail) {
        api.shared().get('admins/url/groups')
            .then(function (response) {
                Config.urls = response.data;
                success(response.data);
            })
            .catch(function (error) {
                fail(error);
            });
    }
}

module.exports = AdminService;
