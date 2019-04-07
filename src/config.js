const DEFAULT_CONFIG = {
    height: 360,
    scanFrameColor: "rgba(192,0,15,1)",
    facingMode: "environment"
};

export let config = DEFAULT_CONFIG;

const mergeConfig = (srcConfig, targetConfig) => {
    let finalConfig = {};

    /* try to parse config json when string or just set */
    if (typeof targetConfig === 'string') {
        try {
            targetConfig = JSON.parse(targetConfig);
        } catch (e) {
            debug.error("Error while try to parse targetConfig. Please check your Config JSON. Standard Config will be used.");
            debug.error(e);
            debug.error(targetConfig);
        }
    } else {
        finalConfig = targetConfig;
    }

    /* try to merge with standard if any attribute is missing */
    try {
        finalConfig = $.extend(true, srcConfig, targetConfig);
    } catch (e) {
        debug.error('Error while try to merge 2 JSONs into standard JSON if any attribute is missing. Please check your Config JSON. Standard Config will be used.');
        debug.error(e);
        finalConfig = srcConfig;
        debug.error(finalConfig);
    }

    return finalConfig;
};

export const initConfig = (configJson) => {
    config = mergeConfig(DEFAULT_CONFIG, configJson);
};
