var sqlite3 = require('sqlite3').verbose();

class TourneyDB {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE Tourneys (id INTEGER PRIMARY KEY, tourneyName TEXT NOT NULL, tourneyDate TEXT NOT NULL, tourneyLocation TEXT NOT NULL);');
            this.db.run('INSERT INTO Tourneys (tourneyName, tourneyDate, tourneyLocation) VALUES ("SoftballSmash", "06/24/2020", "Frankenmuth");');
        });
    }

    static all() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Tourneys', (err, rows) => {
                resolve(rows);
            });
        });
    }

    // Notice that there is *a lot* of error handling missing here.
    static find(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * from Tourneys where (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    console.log("resolving");
                    resolve(rows[0]);
                } else {
                    console.log("rejecting");
                    reject(`Tournament with Id ${id} not found`);
                }
            });
        });
    }

    static create(tourney) {
        let sql = `INSERT INTO Tourneys (tourneyName, tourneyDate, tourneyLocation) VALUES ("${tourney.tourneyName}", "${tourney.tourneyDate}", "${tourney.tourneyLocation}");`;
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
                    resolve({ id: this.lastID, ...tourney })
                }
            });
        })
    }

    static update(tourney) {
        let sql = `UPDATE Tourneys SET tourneyName="${tourney.tourneyName}", tourneyDate="${tourney.tourneyDate}", email="${tourney.tourneyLocation}" WHERE id="${tourney.id}"`;
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

    static delete(tourney) {
        let sql = `DELETE from Tourneys WHERE id="${tourney.id}"`;
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

TourneyDB.db = new sqlite3.Database('blog.sqlite');

module.exports = TourneyDB;