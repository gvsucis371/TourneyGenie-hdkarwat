module.exports = class Tournaments {

  static isValid(tourney, allTourneys) {

    let errors = [];

    if (!tourney.tourneyID) {
      errors.push("Tournament needs a id.");      
    }

    if (!tourney.tourneyName) {
      errors.push("Tournament needs a name.");
    }

    if (!tourney.toureyDate) {
      errors.push("Tournament needs a date.");
    }

    if (!tourney.tourneyLocation) {
      errors.push("Tournament needs a location.");      
    }

   //if (!tourney.isUnique(tourney, allTourneys)) {
     //errors.push("Email is already in use.");
   //}

   if (errors.length > 0) {
     tourney.errors = errors;
     return false;
   } else {
     return true;
   }
  }

  static isUnique(tourney, allTourneys) {   
    return allTourneys.filter((tourn) => tourn.email === tourn.email && tourn.id !== tourney.id).length === 0;
  }
}