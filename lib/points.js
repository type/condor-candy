var _ = require('underscore'),
    points = 800,
    rewards = [0, 25, 100],
    lastUpdate = _.now(),
    delay = 5;


exports.getPoints = function(rules) {
    if ((_.now() - lastUpdate) >= (5 * 1000)){
        var multiplier = (((_.now() - lastUpdate) / (delay * 1000)));
        console.log(multiplier);
        points = Math.round(_.reduce(rules, function(memo, rule){return memo + rewards[rule + 1] * multiplier}, points)); 
        lastUpdate = _.now();
    } else {
        console.log((_.now() - lastUpdate));
    }
    return points;
}

exports.addPoints = function(pts) {
    points += pts;
}

exports.removePoints = function(pts) {
    points -= pts;
}

exports.tiers = {
    panda: 200,
    condor: 500,
    quokka: 800
};

