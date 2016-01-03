var game = require('../controllers/game'),
    exchange = require('../controllers/exchange');

module.exports = function(app) {
    app.get('/game', game);
    app.post('/exchange', exchange);
};
