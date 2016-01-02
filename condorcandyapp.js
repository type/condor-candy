var express = require('express'),
    config = require('config'),
    path = require('path'),
    config = require('config'),
    exphbs = require('express-handlebars'),
    viewHelpers = require("./lib/viewhelpers"),
    app = express();

var hbs = exphbs.create({
    helpers: viewHelpers,
    defaultLayout: 'default',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views'
});


viewHelpers.init(hbs.handlebars);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

if (config.settings.viewCache) {
    app.enable('view cache');
}

app.use(express.static(__dirname + config.settings.assetDirectory));

app.use(express.limit(config.settings.maxRequestSize || '200kb'));
app.use(express.methodOverride());
app.use(express.bodyParser());

["game"
].forEach(function(name) {
    require('./routes/' + name)(app);
});

app.use(app.router);
app.use(function(req, res) {
    res.sendErrorPage(404);
});

exports.app = app;

app.listen(config.settings.appPort, function() {
    console.log("web3 listening on port", config.settings.appPort);
});
