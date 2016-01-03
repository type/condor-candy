var game = require('../controllers/game');

module.exports = function(app) {
    app.get("/game", game);
};
