var rules = require('../lib/rules');


module.exports = function(req, res) {
    rules.checkPoints(function(err, points) {
        var data = {
            animals: {
                quokka: true,
                panda: true,
                condor: true
            },
            myPoints: 1000,
            providerIncentives: [
            {providerName: "Socal Edison", description: "Winter Wonder: 10% off your next billing period", requirements: "Set your heat to 68 or below", value: points.heatRule},
            {providerName: "Socal Edison", description: "Summer Saver: 10% off your next billing period", requirements: "Set your air conditioner to 78 or above", value: points.acRule},
            {providerName: "Socal Edison", description: "Insider Deal: 10% off your next billing period", requirements: "Ensure windows and exterior doors are closed when using your HVAC system", value: points.windowRule},
                {providerName: "DWP", description: "15% off water bill next billing period", requirements: "Save laundry and dishwasher loads until non-peak hours"}

            ],
            rewardTiers: [
            {animal: "panda", name: "Panda", img: "bamboo.png", description: "Bamboo is sure to lure the elusive giant panda", points: 200},
            {animal: "condor", name: "condor", img: "meat.png", description: "Carrion is candy for condors.", points: 500},
            {animal: "quokka", name: "Quokka", img: "grasses.png", description: "Grass will make the quokka go crackers." , points: 800}
            ],
            contests: [{description: "Win a night at the Wild Animal Park"}
            ]
        }
        res.render('templates/game/main', data);
    });
}
