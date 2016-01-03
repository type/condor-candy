var express = require('express'),
    config = require('config'),
    path = require('path'),
    config = require('config'),
    exphbs = require('express-handlebars'),
    viewHelpers = require("./lib/viewhelpers"),
    app = express();

var hbs = exphbs.create({
    helpers: viewHelpers,
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/templates'
});


viewHelpers.init(hbs.handlebars);
app.engine('hbs', hbs.engine);
app.set('view engine', '.hbs');

if (config.settings.viewCache) {
    app.enable('view cache');
}
app.use(express.static(__dirname + '/public'));

app.use(express.limit(config.settings.maxRequestSize || '200kb'));
app.use(express.methodOverride());
app.use(express.bodyParser());

["game"
].forEach(function(name) {
    require('./routes/' + name)(app);
});

app.use(app.router);

exports.app = app;

app.listen(config.settings.appPort, function() {
    console.log("listening on port", config.settings.appPort);
});
