import * as CONST from "../Common/constants"
import axios from 'axios'
import api from './api'

var ColorService = {
    // createColor creates color with data
    createColor(data, success, fail) {
        api.shared().post('/colors', {
            title: data.title,
            value: data.value,
        })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                fail(error.response.data);
            });
    },

    updateColor(data, success, fail) {
        api.shared().put('/colors/' + data.id, {
            title: data.title,
            value: data.value,
        })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    },

    // deleteColor deletes color with id
    deleteColor(id, success, fail) {
        api.shared().delete('/colors/' + id)
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

    // readColors reads all colors with query
    readColors(success, fail) {
        api.shared().get('/colors')
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    },
}

module.exports = ColorService;