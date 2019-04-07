import jsQR from "jsqr";
import * as util from "./util";
import * as video from "./video";
import {config, initConfig} from "./config";

const SCRIPT_VERSION = '1.4';

const readQrCode = (image) => jsQR(image.data, image.width, image.height, {
    inversionAttempts: "dontInvert",
});

window.qrCodeScanner = (function () {
    "use strict";
    return {
        initialize: (regionID, configJSON, setMode, executeCode, apexItem) => {
            $("#" + regionID).css("min-height", "140px");
            util.loader.start("#" + regionID);

            initConfig(configJSON);

            const storeQrCode = util.storeQrCodeInMode(setMode, {executeCode, apexItem});

            let lastCode  = "";

            video.initializeDomElements(regionID);

            function tick() {
                util.loader.stop("#" + regionID);

                if (video.ready()) {
                    const image = video.fetchAndDrawFrame();
                    const code = readQrCode(image);

                    if (code) {
                        video.drawRect(code.location, config.scanFrameColor);

                        if (code.data !== lastCode) {
                            storeQrCode(code.data);
                            lastCode = code.data;
                        }
                    }
                }

                try {
                    requestAnimationFrame(tick);
                } catch (e) {
                    util.debug.error("Error while try to scan QR Code");
                    util.debug.error(e);
                }
            };

            video.start(tick);

            $("#" + regionID).on("scannerPause", video.pause);
            $("#" + regionID).on("scannerPlay", () => video.play(tick));
            $("#" + regionID).on("scannerStop", video.stop);

            $("#" + regionID).on("resetValue", () => {
                lastCode = '';
                storeQrCode('');
            });
        }
    };
})();
