var points = 800;

exports.getPoints = function() {
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

