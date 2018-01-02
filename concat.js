module.exports = [
    {
        src:[
            './build/validate/validate.js',
            './build/js/plugin/**',
            './build/js/common/**',
        ],
        concatName:'main.js',
        destPath:'./build/js/build/'
    },
];