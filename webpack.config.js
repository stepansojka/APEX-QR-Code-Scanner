const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'qrcodescanner.pkg.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: [ 'apex', '$' ]
};
