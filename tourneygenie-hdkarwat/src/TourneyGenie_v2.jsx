import React from 'react';

const apiURL = 'http://localhost:3001'

function TourneyIntro() {

return (
  <div className="tourneyGenie-into"> 
      <h1> Welcome to Tourney Genie </h1>  
      <p>The application that every softball and baseball tournament director needs to run a smooth tournament weekend.</p>
    <button type="submit" className="btn-into" onClick={changeTourneyFormVisibility} >Create New Tournament</button> 
    <button type="submit" className="btn-into" onClick={changeTeamFormVisibility}>Add Team Info</button>
    <button type="submit" className="btn-into" onClick={changeTourneyListVisibility} >View Current Tournaments</button> 
    <button type="submit" className="btn-into" onClick={changeTeamListVisibility}>View Current Teams</button>
  </div>

  );
}
///new code 
function TeamEntryForm({ tourney, updateTourney, formMode, submitCallback, cancelCallback }) {

    let cancelClicked = (event) => {
      event.preventDefault();
      cancelCallback();
    }
  
    // The form will create a place for tournament directors to use for tournament details:
  
    let renderButtons = () => {
      if (formMode === "new") {
        return (
          <button type="submit" className="btn btn-primary" onClick={formSubmitted}>Add Team</button>
        );
      } else {
        return (
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="submit" className="btn btn-danger" onClick={cancelClicked} >Cancel</button>
          </div>
  
          
        );
      }
    } // end renderButtons
  
    function TeamListItem({ team, onEditClicked, onDeleteClicked }) {

        return (
          <tr>
            <td className="col-md-3">{team.teamName}</td>
            <td className="col-md-3">{team.teamAgeGroup}</td>
            <td className="col-md-3">{team.tourneyID}</td>
            <td className="col-md-3 btn-toolbar">
              <button className="btn btn-success btn-sm" onClick={event => onEditClicked(tourney)}>
                <i className="glyphicon glyphicon-pencil"></i> Edit
                </button>
              <button className="btn btn-danger btn-sm" onClick={event => onDeleteClicked(tourney.id)}>
                <i className="glyphicon glyphicon-remove"></i> Delete
                </button>
            </td>
          </tr>
        );
      }

      function TeamList({ teams, onEditClicked, onDeleteClicked }) {
        console.log("The Teams: ");
        console.log(tourneys);
        const teamItems = teams.map((team) => (
          <TeamListItem key={team.id} team={teamss} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
        ));
      
        return (
          <div className="tourney-list">
            <table className="table table-hover">
              <thead>
              <h1>Current Teams</h1>
                <tr>
                  <th className="col-md-3">Team Name</th>
                  <th className="col-md-3">Team Age Group</th>
                  <th className="col-md-3">Tournament ID</th>
                  <th className="col-md-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamItems}
              </tbody>
            </table>
          </div>
        );
      }

    let formSubmitted = (event) => {
      // Prevent the browser from re-loading the page.
      event.preventDefault();
      submitCallback();
    };
  
    return (
    
      <div className="teamEntry-form">
        <h1> Team Entry Form </h1>
        <form onSubmit={formSubmitted}>
          <div className="tourneyForm-group">
            <label>Team Name</label>
            <input type="text" className="form-control" autoComplete='team-name' name="teamName" id="teamName"
              placeholder="Muth Mavericks Red" value={team.teamName} onChange={(event) => updateTourney('teamName', event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="date">Team Age Group</label>
            <input type="text" className="form-control" autoComplete='tourney-agegroup' name="teamAgeGroup" id="teamAgeGroup"
              placeholder="14U" value={team.teamAgeGroup} onChange={(event) => updateTourney('teamAgeGroup', event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="location">Tournament ID</label>
            <input type="location" className="form-control" autoComplete='tourney-ID' name="tourneyID" id="tourneyID"
              placeholder="100001" value={team.tourneyID} onChange={(event) => updateTourney('tourneyID', event.target.value)} />
          </div>
          {renderButtons()}
        </form>
      </div>
    );
  }

function TournamentTeams() {
let [teamList, setTeamList] = React.useState([
    { id: 1, teamName: "Hasn't", teamAgeGroup: "Loaded", tourneyID: "Yet" }
  ]);

  let [formMode, setFormMode] = React.useState("new");

  let emptyTeam = { teamName: '', teamAgeGroup: '', tourneyID: '' };
  let [currentTeams, setCurrentTeams] = React.useState(emptyTeam);

  let fetchTeams = () => {
    fetch(`${apiURL}/teams`).then(response => {
      console.log("Look what I got: ");
      console.log(response);

      return response.json();
    }).then(data => {
      console.log("And the JSON");
      console.log(data);

      setTeamList(data);

    });
  };

React.useEffect(() => fetchTeams(), []);

  let updateTeam= (field, value) => {
    let newTeam = { ...currentTeams}
    newTeam[field] = value;
    setCurrentTourneys(newTeam);
  }


  let postNewTeam = (team) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(team)
    };
    console.log("Attempting to post new team");
    console.log(team);
    console.log(options.body);
    return fetch(`${apiURL}/teams`, options).then(response => {
      return response.json();
    });
  }

  let functionSaveTeam = (team) => {
    const options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(team)
    };
    console.log("Attempting to update tournament");
    console.log(team);
    console.log(options.body);
    return fetch(`${apiURL}/teams/${team.id}`, options).then(async response => {

        if(response.ok && response.status === 204){
          return true;
        }
    })
  }

  let formSubmitted = () => {
    if (formMode === "new") {
      postNewTeam(currentTeams).then(data => {
        console.log("Received data");
        console.log(data);

        // The presence of a message key indicates there was an error.
        if (!data.message) {
          currentTeams.id = data.id;
          setTourneyList([...teamList, currentTeams]);
        } else {
          console.log("New team wasn't created because " + data.message);
          alert(data.message)
        }
      });
    } else {
      // Notice! This does not submit changes to the server!
      alert("Change not submitted to server. (Just not part of this example.)")
      let newTeamList = [...teamList];
      let teamIndex = teamList.findIndex((team) => team.id === currentTeams.id);

      newTeamList[teamIndex] = currentTeams;
      setTourneyList(newTeamList);
      functionSaveTeam(currentTeams);
    }
  }

  let editClicked = (team) => {
    setFormMode("update");
    setCurrentTeams(team);
  }

  let cancelClicked = () => {
    setFormMode("new");
    setCurrentTeams(emptyTeam)
  }

  let deleteClicked = (id) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
    };
    console.log("Attempting to post new team");
    console.log(id);
    console.log(options.body);
    setTourneyList(tourneyList.filter((item) => item.id !== id));
    cancelClicked();
    return fetch(`${apiURL}/teams/${id}`, options).then(response => {
      if(response.ok && response.status === 204){
        return true;
      }
    });
  }
  return (
    <div className="tourneys">
      <TourneyIntro />

        <TeamEntryForm formMode={formMode} teams={currentTeams} updateTeam={updateTeam}
        submitCallback={formSubmitted} cancelCallback={cancelClicked} />
    
      <div />
      <TeamList teams={teamList} onEditClicked={editClicked} onDeleteClicked={deleteClicked} />
    </div>
  );
}


  export default TournamentTeams;
