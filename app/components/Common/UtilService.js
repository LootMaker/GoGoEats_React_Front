import React from 'react';
import Centrifuge from 'centrifuge'
import CryptoJS from 'crypto-js'
import * as CONST from "./constants"
import Config from "./Config"

class UtilService {
    static getDateTime(timestamp) {
        return moment.unix(timestamp).format("YYYY-MM-DD hh:mm a");
    }

    static getDate(timestamp) {
        return moment.unix(timestamp).format("YYYY-MM-DD");
    }

    static getLongTime(timestamp) {
        return moment.unix(timestamp).format("HH:mm:ss");
    }

    static getShortTime(timestamp) {
        return moment.unix(timestamp).format("HH:mm");
    }

    static getShortTime1(timestamp) {
        return moment.unix(timestamp).format("h:mm A");
    }


    static getDateTimeByFormat(timestamp, format) {
        return moment.unix(timestamp).format(format);
    }

    static getDateJoined(dateTimeStr) {
        return moment.unix(new Date(dateTimeStr).getTime() / 1000).format("MMM YYYY");
    }

    static initLanguage() {
        $("[data-localize]").localize('server/i18n/site', { language: this.getLanguage() });
    }

    static getTimeParser(dateTimeStr) {
        return moment(dateTimeStr, 'HH:mm:ss');
    }

    static getLangData(data) {
        if (data == null) return "";
        var lang = this.getLanguage();
        if (lang == 'en')
            return data.english;
        else
            return data.chinese;
    }

    static getTimeExceptSecond(dateTimeStr) {
        return moment.unix(new Date(dateTimeStr).getTime() / 1000).format("HH:mm");
    }

    static getLangSelectData(data, value, condition) {
        if (condition != null) {
            if (condition.specialcondition == 1 && condition.value == 0) { //if value is 0, then show original, else show *****
                return condition.run
            }
            if (condition.specialcondition == 2 && condition.value != 0) { //if value is 0, then show *****, else show original
                return condition.run
            }
        }

        if (data == null) return "";
        var lang = this.getLanguage();
        if (lang == 'en')
            return data.english[Math.floor(value)];
        else
            return data.chinese[Math.floor(value)];
    }

    static getTextAlign(val) {
        if (!val) return "left";

        if (val == 1)
            return "center";
        else if (val == 2)
            return "right";
        else if (val == 0)
            return "left";

        return val;
    }

    static getTrimText(val, len) {
        if (val.length < len) return val

        return val.substr(0, len) + "..."
    }

    static getImageFromPath(path) {
        if (path == null || path == undefined || path == "") {
            return './img/placeholder.svg'
        } else {
            return Config.FILE_SERVER_URL + '/' + path
        }
    }

    static getProfileFromPath(path) {
        if (path == null || path == undefined || path == "") {
            return './img/profile-pic.svg'
        } else {
            if (path.includes("https://")) {
                return path
            } else {
                return Config.FILE_SERVER_URL + '/' + path
            }
        }
    }

    static getTripStatus(status) {
        switch (status) {
            case "Pending":
                return <div className="badge p-sm bg-warning">{status}</div>
            case "Accepted":
                return <div className="badge p-sm bg-primary">{status}</div>
            case "Declined":
                return <div className="badge p-sm bg-danger">{status}</div>
            case "Arrived":
                return <div className="badge p-sm bg-primary">{status}</div>
            case "Started":
                return <div className="badge p-sm bg-success">{status}</div>
            case "Dropped":
                return <div className="badge p-sm bg-success">{status}</div>
            case "Cancelled":
                return <div className="badge p-sm bg-gray">{status}</div>
            case "Completed":
                return <div className="badge p-sm bg-success">{status}</div>
        }
    }

    static getCardBrand(card) {
        switch (card) {
            case "cash":
                return <img src={'./img/card/cc_cash.png'} className="thumb24 img-fit" />
        }
    }

    static changeSwitchValue(obj) {
        if (obj.prop('checked') == true) {
            obj.prop('checked', false);
            return false;
        } else {
            obj.prop('checked', true);
            return true;
        }
    }

    static getPhoneNumber(phone_code, phone_number) {
        if (phone_code) {
            return '+' + phone_code + ' ' + phone_number
        }
        return phone_number
    }

    static generateClientToken(user, timestamp) {
        var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, "secret");
        hmac.update(user + timestamp);

        var hash = hmac.finalize();
        return hash.toString(CryptoJS.enc.Application)
    }

    static getWebSocketConnection(userId, cb) {
        var timestamp = parseInt(new Date().getTime() / 1000).toString();
        var token = this.generateClientToken(userId, timestamp)

        Cache.socketConnection = new Centrifuge({
            url: Config.WS_CENTRIFUGO,
            user: userId,
            timestamp: timestamp,
            token: token
        });

        Cache.socketConnection.connect();
        Cache.socketConnection.on('error', function (error) {
            // handle error in a way you want, here we just log it into browser console.
            cb(error, null);
        });
        Cache.socketConnection.on('disconnect', function (context) {
            // do whatever you need in case of disconnect from server
            cb(context, null);
        });
        Cache.socketConnection.on('connect', (context) => {
            //console.log('WS - connect', context)
            cb(null, Cache.socketConnection);
        });
    }
}

export default UtilService;