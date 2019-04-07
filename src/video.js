import * as util from "./util";
import {config} from "./config";

let video;
let canvas;
let canvasElement;

export const initializeDomElements = (regionID) => {
    console.log('initializing dom elements');

    try {
        video = document.createElement("video");
        canvasElement = document.createElement("canvas");
        canvasElement.style.display = "block";
        canvasElement.style.margin = "5px auto";

        canvas = canvasElement.getContext("2d");

        $("#" + regionID).append(canvasElement);
        console.log('went well');
    } catch (e) {
        console.log(e);
        util.debug.error("Error while try to create canvas for video frame");
        util.debug.error(e);
    }
};

export const drawLine = (begin, end, color)  => {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
};

export const drawRect = (location, color) => {
    drawLine(location.topLeftCorner, location.topRightCorner, color);
    drawLine(location.topRightCorner, location.bottomRightCorner, color);
    drawLine(location.bottomRightCorner, location.bottomLeftCorner, color);
    drawLine(location.bottomLeftCorner, location.topLeftCorner, color);
};

export const start = async (tick) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: config.facingMode
            }
        });

        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required for iOS to prevent fullscreen
        video.play();
        requestAnimationFrame(tick);
    } catch (e) {
        util.debug.error("Your browser does not support video");
        util.debug.error(e);
    }
};

export const ready = () => video.readyState === video.HAVE_ENOUGH_DATA;

const ratio = () => {
    var ratio = (video.videoWidth / video.videoHeight);

    // workaround for edge
    if (isNaN(ratio)) {
        ratio = (video.width / video.height);
    }

    // workaround if no ratio can be calculated
    if (isNaN(ratio)) {
        ratio = 4 / 3;
    }

    return ratio;
};

export const fetchAndDrawFrame = () => {
    canvasElement.height = config.height;
    canvasElement.width = config.height * ratio();
    canvas.drawImage(video, 0, 0, Math.floor(canvasElement.width), Math.floor(canvasElement.height));
    return canvas.getImageData(0, 0, Math.floor(canvasElement.width), Math.floor(canvasElement.height));
};

export const stop = () => {
    if (!video.srcObject)
        return;

    video
        .srcObject
        .getVideoTracks()
        .forEach(track => track.stop());
};

export const pause = () => video.pause();

export const play = async (tick) => {
    if (video.paused) {
        video.play();
    } else {
        start(tick);
    }
};
