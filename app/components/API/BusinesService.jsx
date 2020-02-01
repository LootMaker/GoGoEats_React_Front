import axios from 'axios'
import api from './api'
import Config from '../Common/Config';

var BusinesService = {
    
    login(_email, _password, success, fail) {
        api
            .shared()
            .post('business/login', {
                email: _email,
                password: _password
            })
            .then(function (response) {
                api.setToken(response.data.token);
                api.setCurrentUser(response.data.business);
                success();
            })
            .catch(function (error) {
                fail(error.response.data);
            });
    },

    register(_name, _email, _password, success, fail) {
        api
            .shared()
            .post('business/register', {
                name: _name,
                email: _email,
                password: _password
            })
            .then(function (response) {
                api.setToken(response.data.token);
                api.setCurrentUser(response.data.business);
                success();
            })
            .catch(function (error) {
                fail(error.response.data);
            });
    }
}

module.exports = BusinesService;