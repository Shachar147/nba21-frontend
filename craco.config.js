/* craco.config.js */
const path = require(`path`);

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@activities': path.resolve(__dirname, 'src/activities'),
            '@shared_activities': path.resolve(__dirname, 'src/activities/shared'),
            '@helpers': path.resolve(__dirname, 'src/helpers'),
            '@config': path.resolve(__dirname, 'src/config'),
            '@pages': path.resolve(__dirname, 'src/pages'),
        }
    },
};