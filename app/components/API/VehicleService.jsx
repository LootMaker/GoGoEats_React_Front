import * as CONST from "../Common/constants"
import axios from 'axios'
import api from './api'

var VehicleService = {
    // createVehicle creates vehicle with data
    createVehicle(vehicle, success, fail) {
        api.shared().post('/vehicles', {
                photo: vehicle.photo,
                image: vehicle.image,
                menu_icon: vehicle.menu_icon,
                map_icon: vehicle.map_icon,
                title: vehicle.title,
                detail: vehicle.detail,
                description: vehicle.description,
                max_seat: Number(vehicle.max_seat),
                search_radius: Number(vehicle.search_radius),
                status: vehicle.status,
            })
            .then(function(response) {
                success(response.data);
            })
            .catch(function(error) {
                console.log(error.response)
                fail(error.response.data);
            });
    },

    updateVehicle(vehicle, success, fail) {
        api.shared().put('/vehicles/' + vehicle.id, {
                photo: vehicle.photo,
                image: vehicle.image,
                menu_icon: vehicle.menu_icon,
                map_icon: vehicle.map_icon,
                title: vehicle.title,
                detail: vehicle.detail,
                description: vehicle.description,
                max_seat: Number(vehicle.max_seat),
                search_radius: Number(vehicle.search_radius),
                status: vehicle.status,
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

    // deleteVehicle deletes vehicle with id
    deleteVehicle(id, success, fail) {
        api.shared().delete('/vehicles/' + id)
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

    // readVehicles reads all vehicles with query
    readVehicles(query, success, fail) {
        api.shared().get('/vehicles?query=' + query, {

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
        api.shared().get('/vehicles/active', {

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

module.exports = VehicleService;