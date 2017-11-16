let px2rem = require('postcss-px2rem');

module.exports = {
    plugins: [
        require("autoprefixer")({
            browsers: [
                'Android >= 4',
                'Chrome >= 40',
                'last 6 Firefox versions',
                'iOS >= 6',
                'Safari >= 6'
            ]
        }),

        // 将px全局转化为rem单位
        px2rem({
            remUnit: 23.4375
        })
    ]
}