import * as CONST from "../Common/constants"
import axios from 'axios'
import api from './api'

var ProblemService = {

    // createProblem creates vehicle with data
    createProblem(problem, businessId, success, fail) {
        api.shared().post('/problems', {
                businessId: businessId,
                title: problem.title,
                description: problem.description
            })
            .then(function(response) {
                success(response.data);
            })
            .catch(function(error) {
                console.log(error.response)
                fail(error.response.data);
            });
    },

    // readProblems reads all problems with query
    readProblems(query, success, fail) {
        api.shared().get('/problems?query=' + query, {

            })
            .then(function(response) {
                success(response.data);
            })
            .catch(function(error) {
                console.log(error.response)
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    },

    readBusinessProblems(id, success, fail) {
        api.shared().get('/problems/business/' + id, {

            })
            .then(function(response) {
                success(response.data);
            })
            .catch(function(error) {
                console.log(error.response)
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    },

    readActiveVehicles(success, fail) {
        api.shared().get('/problems/resolved', {

            })
            .then(function(response) {
                success(response.data);
            })
            .catch(function(error) {
                console.log(error.response)
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    }
}

module.exports = ProblemService;