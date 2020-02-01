import * as CONST from "../Common/constants"
import axios from 'axios'
import api from './api'

var LocationService = {
    // createLocation creates location with data
    createLocation(location, success, fail) {
        api.shared().post('/locations', {
                country_code: location.country_code,
                city: location.city,
                latitude: location.latitude,
                longitude: location.longitude,
                place_id: location.place_id,
                is_day_time: location.is_day_time,
                day_time: location.day_time,
                is_night_time: location.is_night_time,
                night_time: location.night_time,
            })
            .then(function(response) {
                success(response.data);
            })
            .catch(function(error) {
                console.log(error.response)
                fail(error.response.data);
            });
    },

    updateLocation(location, success, fail) {
        api.shared().put('/locations/' + location.id, {
                country_code: location.country_code,
                city: location.city,
                latitude: location.latitude,
                longitude: location.longitude,
                place_id: location.place_id,
                is_day_time: location.is_day_time,
                day_time: location.day_time,
                is_night_time: location.is_night_time,
                night_time: location.night_time,
            })
            .then(function(response) {
                success(response.data);
            })
            .catch(function(error) {
                console.log(error)
                if (error.response != undefined) {
                    fail(error.response);
                }
            });
    },

    // deleteLocation deletes location with id
    deleteLocation(id, success, fail) {
        api.shared().delete('/locations/' + id)
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

    // readLocations reads all loactions with query
    readLocations(query, success, fail) {
        api.shared().get('/locations?query=' + query, {

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

    // readLocations reads location with id
    readLocation(id, success, fail) {
        api.shared().get('/locations/' + id, {

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

    updateVehicleInfo(id, infos, success, fail) {
        api.shared().put('/locations/update/vehicle_info/' + id, {
                vehicle_infos: infos
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
}

module.exports = LocationService;