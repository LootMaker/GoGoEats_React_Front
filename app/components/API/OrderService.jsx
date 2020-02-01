import * as CONST from "../Common/constants"
import axios from 'axios'
import api from './api'

var OrderService = {

    readOrder(id, success, fail) {
        api.shared().get('/business/order/' + id, {

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

    acceptOrder(id, success, fail) {
        api.shared().get('/business/order/' + id)
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                if (error.response != undefined) {
                    fail(error.response.data);
                }
            });
    },

    declineOrder(id, success, fail) {
        api.shared().get('/business/order/' + id)
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error.response)
                if (error.response != undefined) {
                    fail(error.response.data);
                }
            });
    },

    startOrder(data, success, fail) {
        api.shared().put('/business/order/' + data.id, data)
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error)
                if (error.response != undefined) {
                    fail(error.response.data);
                }
            });
    },

    orderIsReady(data, success, fail) {
        api.shared().put('/business/order/' + data.id, data)
            .then(function (response) {
                success(response.data);
            })
            .catch(function (error) {
                console.log(error)
                if (error.response != undefined) {
                    fail(error.response.data);
                }
            });
    },
}

module.exports = OrderService;