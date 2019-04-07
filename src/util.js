import * as util from "./util";

export const version = "1.0.5";

export const isAPEX = () => {
        if (typeof (apex) !== 'undefined') {
            return true;
        } else {
            return false;
        }
};

export const debug = {
        info: function (str) {
            if (isAPEX()) {
                apex.debug.info(str);
            }
        },
        error: function (str) {
            if (isAPEX()) {
                apex.debug.error(str);
            } else {
                console.error(str);
            }
        }
};

export const loader = {
    start: function (id) {
        if (isAPEX()) {
            apex.util.showSpinner($(id));
        } else {
            /* define loader */
            var faLoader = $("<span></span>");
            faLoader.attr("id", "loader" + id);
            faLoader.addClass("ct-loader");

            /* define refresh icon with animation */
            var faRefresh = $("<i></i>");
            faRefresh.addClass("fa fa-refresh fa-2x fa-anim-spin");
            faRefresh.css("background", "rgba(121,121,121,0.6)");
            faRefresh.css("border-radius", "100%");
            faRefresh.css("padding", "15px");
            faRefresh.css("color", "white");

            /* append loader */
            faLoader.append(faRefresh);
            $(id).append(faLoader);
        }
    },
    stop: function (id) {
        $(id + " > .u-Processing").remove();
        $(id + " > .ct-loader").remove();
    }
};

const RUN_JS_CODE = "1";
const SET_APEX_ITEM = "2";
const FIRE_DYNAMIC_EVENT = "3";

export const storeQrCodeInMode = (mode, options) => {
    switch (mode) {
    case RUN_JS_CODE:
        return (code) => {
            try {
                var func = new Function("scannedValue", options.executeCode);
                func(code);
            } catch (e) {
                util.debug.error("Error while execute JavaScript Code!");
                util.debug.error(e);
            }
        };
    case SET_APEX_ITEM:
        return (code) => {
            try {
                apex.item(options.apexItem).setValue(code);
            } catch (e) {
                util.debug.error("Error while try to set APEX Item!");
                util.debug.error(e);
            }
        };
    case FIRE_DYNAMIC_EVENT:
        return (code) => apex.event.trigger('#' + regionID, 'qr-code-scanned', code.data);
    default:
        util.debug.error("SetMode not found!");
        return (code) => {};
    }
};
