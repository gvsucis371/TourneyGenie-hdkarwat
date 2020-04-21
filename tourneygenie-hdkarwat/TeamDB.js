var sqlite3 = require('sqlite3').verbose();

class TeamDB {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE Teams (id INTEGER PRIMARY KEY, teamName TEXT NOT NULL, teamAgeGroup TEXT NOT NULL, tourneyID TEXT NOT NULL);');
            this.db.run('INSERT INTO Teams (teamName, teamAgeGroup, tourneyID) VALUES ("Muth Mavericks Red", "14U", "100001");');
        });
    }

    static all() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Teams', (err, rows) => {
                resolve(rows);
            });
        });
    }

    // Notice that there is *a lot* of error handling missing here.
    static find(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * from Teams where (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    console.log("resolving");
                    resolve(rows[0]);
                } else {
                    console.log("rejecting");
                    reject(`Team with Id ${id} not found`);
                }
            });
        });
    }

    static create(team) {
        let sql = `INSERT INTO Teams (teamName, teamAgeGroup, tourneyID) VALUES ("${team.teamName}","${team.teamAgeGroup}", "${team.tourneyID});`;
        return new Promise((resolve, reject) => {
            console.log('The sql: ');
            console.log(sql);

            this.db.run(sql, function (err, rows) {
                console.log("This: ");
                console.log(this);
                if (err) {
                    console.log('Create Error');
                    console.log(err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...team })
                }
            });
        })
    }

    static update(team) {
        let sql = `UPDATE Teams SET teamName="${team.teamName}, "teamAgeGroup="${team.teamAgeGroup}", tourneyID="${team.tourneyID}" WHERE id="${team.id}"`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, function (err, rows) {
                if (err) {
                    console.log('Update Error');
                    console.log(err);
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    }

    static delete(team) {
        let sql = `DELETE from Teams WHERE id="${team.id}"`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, function (err, rows) {
                if (err) {
                    console.log('Delete Error');
                    console.log(err);
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    } // end delete
} // end TourneyDB

TeamDB.db = new sqlite3.Database('blog.sqlite');
module.exports = TeamDB;
