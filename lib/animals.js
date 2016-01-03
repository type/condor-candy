var animals = {
    quokka: false,
    condor: false,
    panda: false
};

exports.animals = animals;

exports.addPanda = function() {
    animals.panda = true;
}
exports.addCondor = function() {
    animals.condor = true;
}
exports.addQuokka = function() {
    animals.quokka = true;
}
