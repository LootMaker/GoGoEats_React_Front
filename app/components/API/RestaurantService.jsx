import * as CONST from "../Common/constants"
import axios from 'axios'
import api from './api'

var RestaurantService = {
    // createRestaurant creates brand with data
    createRestaurant(data, success, fail) {
        api.shared().post('/restaurants', {
            title: data.title,
        })
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                fail(error.response.data);
            });
    },

    updateRestaurant(data, success, fail) {
        api.shared().put('/restaurants/' + data.id, {
            title: data.title,
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

    // deleteRestaurant deletes brand with id
    deleteRestaurant(id, success, fail) {
        api.shared().delete('/restaurants/' + id)
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

    // readRestaurants reads all brands with query
    readRestaurants(success, fail) {
        api.shared().get('/restaurants')
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

    updateModels(id, models, success, fail) {
        api.shared().put('/restaurants/update/model/' + id, {
            models: models,
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
    }
}

module.exports = RestaurantService;