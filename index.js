const Fever = require('./lib/application');
const Router = require('./lib/router');

const urlParser = require('./middleware/url-parser');
const bodyParser = require('./middleware/body-parser');

module.exports = {
    Fever,
    Router,
    urlParser,
    bodyParser,
};
