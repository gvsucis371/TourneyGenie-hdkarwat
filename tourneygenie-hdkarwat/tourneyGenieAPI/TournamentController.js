const TourneyDB = require('./TourneyDB');
const Tournament = require('./Tournament')

class TournamentController {

    async index(req, res) {     
        res.send(await TournamentDB.all())
    }

    async show(req, res) {
        let id = req.params.id;
        let tourney = await TourneyDB.find(id);

        if (!tourney) {
            res.send("Could not find tournament with id of " + id);
        } else {
            res.send(tourney);
        }
    }

    async create(req, res) {
        console.log("Create a tournament");
        console.log(req.body);

        let newTournament = req.body;

        // Quick and dirty validation
        if (tourney.isValid(newTournament, await TourneyDB.all())) {
            
            TourneyDB.create(newTournament).then(data => res.send(data));
        } else {
            // Send a 422 response.
            res.status(422);
            res.send({ message: newTournament.errors.join(": ") });
        }
    }

    async update(req, res) {
        let newTournament = req.body;
        console.log("Proposed update: ");
        console.log(newTournament);
        let id = req.params.id;
        let tourney = await TourneyDB.find(id);

        if (!tourney) {
            res.status(404);
            res.send("Could not find an tournament with id of " + id);
        } else {
            if (tourney.isValid(newTournament, await TourneyDB.all())) {
                // Indicate that the response is successful, but has no body.
                TourneyDB.update(newTournament).then(() => {
                    res.status(204);
                    res.send();
                });
            } else {
                // Send a 422 response.
                res.status(422);
                res.send({ message: newTournament.errors.join(": ") });
            }
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let tourney = await TourneyDB.find(id);
        if (!tourney) {
            res.status(404);
            res.send("Could not find a tournament with id of " + id);
        } else {
            TourneyDB.delete(tourney).then(() => {
                res.status(204);
                res.send();
            }).catch((message) => {
                res.status(500);
                res.send("Server error: " + message);
            });
        }
    } // end delete
}
module.exports = TournamentController;