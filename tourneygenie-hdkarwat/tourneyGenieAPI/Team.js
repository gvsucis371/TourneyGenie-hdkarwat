module.exports = class Teams {

    static isValid(team, allTeams) {
  
      let errors = [];
      if (!team.teamName) {
        errors.push("Team needs a name.");
      }
  
      if (!team.teamAgeGroup) {
        errors.push("Team needs an age group.");
      }
  
      if (!team.tourneyID) {
        errors.push("team needs to be under a tournament id.");      
      }
  
     //if (!tourney.isUnique(tourney, allTourneys)) {
       //errors.push("Email is already in use.");
     //}
  
     if (errors.length > 0) {
       team.errors = errors;
       return false;
     } else {
       return true;
     }
    }
  
    static isUnique(team, allTeams) {   
      return allTeams.filter((teamm) => teamm.email === teamm.email && teamm.id !== team.id).length === 0;
    }
  }