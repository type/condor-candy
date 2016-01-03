var points = require('../lib/points'),
    animals = require('../lib/animals'),
    tiers = points.tiers;

module.exports = function(req, res) {
    var animal = req.body.animal,
        myPoints = points.getPoints(),
        reqPoints = +req.body.points;

    if (!animal || !reqPoints) {
        return res.send(400, {error: 'No animal or no points'});
    }
    if (tiers[animal] !== reqPoints) {
        console.log(tiers[animal], reqPoints);
        return res.send(400, {error: 'Animal-point mismatch'});
    }
    if (myPoints < reqPoints) {
        return res.send(400, {error: 'Insufficient points'});
    }
    points.removePoints(reqPoints);
    if (animal === 'panda') {
        animals.addPanda();
    }
    if (animal === 'condor') {
        animals.addCondor();
    }
    if (animal === 'quokka') {
        animals.addQuokka();
    }
    res.send(200);
}
