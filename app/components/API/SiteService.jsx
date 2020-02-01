import * as CONST from "../Common/constants"
import axios from 'axios'
import api from './api'

var SiteService = {

    // readBusinesses reads all brands with query
    readBusinesses(success, fail) {
        api.shared().get('/businesses', {

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
    }
}

module.exports = SiteService;