const path = require('path');

module.exports = {
    target: 'node',
    entry: {
        app: ['./clientjs.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './public/dist')
    }
};
