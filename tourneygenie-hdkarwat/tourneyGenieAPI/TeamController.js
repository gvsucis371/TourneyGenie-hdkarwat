const TeamDB = require('./TeamDB');
const Team = require('./Team')

class TeamController {

    async index(req, res) {     
        res.send(await TeamDB.all())
    }

    async show(req, res) {
        let id = req.params.id;
        let team = await TeamDB.find(id);

        if (!team) {
            res.send("Could not find a team with id of " + id);
        } else {
            res.send(team);
        }
    }

    async create(req, res) {
        console.log("Create a team");
        console.log(req.body);

        let newTeam = req.body;

        // Quick and dirty validation
        if (team.isValid(newTeam, await TeamDB.all())) {
            
            TeamDB.create(newTeam).then(data => res.send(data));
        } else {
            // Send a 422 response.
            res.status(422);
            res.send({ message: newTeam.errors.join(": ") });
        }
    }

    async update(req, res) {
        let newTeam = req.body;
        console.log("Proposed update: ");
        console.log(newTeam);
        let id = req.params.id;
        let team = await TeamDB.find(id);

        if (!team) {
            res.status(404);
            res.send("Could not find a team with id of " + id);
        } else {
            if (team.isValid(newTeam, await TeamDB.all())) {
                // Indicate that the response is successful, but has no body.
                TeamDB.update(newTeam).then(() => {
                    res.status(204);
                    res.send();
                });
            } else {
                // Send a 422 response.
                res.status(422);
                res.send({ message: newTeam.errors.join(": ") });
            }
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let team= await TeamDB.find(id);
        if (team) {
            res.status(404);
            res.send("Could not find a team with id of " + id);
        } else {
            TeamDB.delete(team).then(() => {
                res.status(204);
                res.send();
            }).catch((message) => {
                res.status(500);
                res.send("Server error: " + message);
            });
        }
    } // end delete
}
module.exports = TeamController;