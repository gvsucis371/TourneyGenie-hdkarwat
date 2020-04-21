import React from 'react';

const apiURL = 'http://localhost:3001'

function TourneyIntro() {

return (
  <div className="tourneyGenie-into"> 
      <h1> Welcome to Tourney Genie </h1>  
      <p>The application that every softball and baseball tournament director needs to run a smooth tournament weekend.</p>
    </div>

);
}

function TourneyEntryForm({ tourney, updateTourney, formMode, submitCallback, cancelCallback }) {

  let cancelClicked = (event) => {
    event.preventDefault();
    cancelCallback();
  }

  // The form will create a place for tournament directors to use for tournament details:

  let renderButtons = () => {
    if (formMode === "new") {
      return (
        <button type="submit" className="btn btn-primary" onClick={formSubmitted}>Create Tournament</button>
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


  let formSubmitted = (event) => {
    // Prevent the browser from re-loading the page.
    event.preventDefault();
    submitCallback();
  };

  return (
  
    <div className="tourneyEntry-form">
      <h1> Tournament Entry Form </h1>
      <form onSubmit={formSubmitted}>
        <div className="tourneyForm-group">
          <label>Tournament Name</label>
          <input type="text" className="form-control" autoComplete='tourney-name' name="tourneyName" id="tourneyName"
            placeholder="Tournament Name" value={tourney.tourneyName} onChange={(event) => updateTourney('tourneyName', event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="date">Tournament Date</label>
          <input type="text" className="form-control" autoComplete='tourney-date' name="tourneyDate" id="tourneyDate"
            placeholder="01/01/2020" value={tourney.tourneyDate} onChange={(event) => updateTourney('tourneyDate', event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="location">Tournament Location</label>
          <input type="location" className="form-control" autoComplete='tourney-location' name="tourneyLocation" id="tourneyLocation"
            placeholder="Address, State, ZIP" value={tourney.tourneyLocation} onChange={(event) => updateTourney('tourneyLocation', event.target.value)} />
        </div>
        {renderButtons()}
      </form>
    </div>
  );
}

function TourneyListItem({ tourney, onEditClicked, onDeleteClicked }) {

  return (
    <tr>
      <td className="col-md-3">{tourney.tourneyName}</td>
      <td className="col-md-3">{tourney.tourneyDate}</td>
      <td className="col-md-3">{tourney.tourneyLocation}</td>
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

function TourneyList({ tourneys, onEditClicked, onDeleteClicked }) {
  console.log("The Tournaments: ");
  console.log(tourneys);
  const tourneyItems = tourneys.map((tourney) => (
    <TourneyListItem key={tourney.id} tourney={tourneys} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
  ));

  return (
    <div className="tourney-list">
      <table className="table table-hover">
        <thead>
        <h1>Current Tournaments</h1>
          <tr>
            <th className="col-md-3">Tournament Name</th>
            <th className="col-md-3">Tournament Date</th>
            <th className="col-md-3">Tournament Location</th>
            <th className="col-md-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tourneyItems}
        </tbody>
      </table>
    </div>
  );
}

function Tournaments() {

  let [tourneyList, setTourneyList] = React.useState([
    { id: 1, tourneyName: "Hasn't", tourneyDate: "Loaded", tourneyLocation: "Yet" }
  ]);

  let [formMode, setFormMode] = React.useState("new");

  let emptyTourney = { tourneyName: '', tourneyDate: '', tourneyLocation: '' };
  let [currentTourneys, setCurrentTourneys] = React.useState(emptyTourney);

  let fetchTourneys = () => {
    fetch(`${apiURL}/tourneys`).then(response => {
      console.log("Look what I got: ");
      console.log(response);

      return response.json();
    }).then(data => {
      console.log("And the JSON");
      console.log(data);

      setTourneyList(data);

    });
  };

React.useEffect(() => fetchTourneys(), []);

  let updateTourney= (field, value) => {
    let newTourney = { ...currentTourneys}
    newTourney[field] = value;
    setCurrentTourneys(newTourney);
  }


  let postNewTourney = (tourney) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(tourney)
    };
    console.log("Attempting to post new tournament");
    console.log(tourney);
    console.log(options.body);
    return fetch(`${apiURL}/tourneys`, options).then(response => {
      return response.json();
    });
  }

  let functionSaveTourney = (tourney) => {
    const options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(tourney)
    };
    console.log("Attempting to update tournament");
    console.log(tourney);
    console.log(options.body);
    return fetch(`${apiURL}/tourneys/${tourney.id}`, options).then(async response => {

        if(response.ok && response.status === 204){
          return true;
        }
    })
  }

  let formSubmitted = () => {
    if (formMode === "new") {
      postNewTourney(currentTourneys).then(data => {
        console.log("Received data");
        console.log(data);

        // The presence of a message key indicates there was an error.
        if (!data.message) {
          currentTourneys.id = data.id;
          setTourneyList([...tourneyList, currentTourneys]);
        } else {
          console.log("New tournament wasn't created because " + data.message);
          alert(data.message)
        }
      });
    } else {
      // Notice! This does not submit changes to the server!
      alert("Change not submitted to server. (Just not part of this example.)")
      let newTourneyList = [...tourneyList];
      let tourneyIndex = tourneyList.findIndex((tourney) => tourney.id === currentTourneys.id);

      newTourneyList[tourneyIndex] = currentTourneys;
      setTourneyList(newTourneyList);
      functionSaveTourney(currentTourneys);
    }
  }

  let editClicked = (tourney) => {
    setFormMode("update");
    setCurrentTourneys(tourney);
  }

  let cancelClicked = () => {
    setFormMode("new");
    setCurrentTourneys(emptyTourney)
  }

  let deleteClicked = (id) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
    };
    console.log("Attempting to post new tournament");
    console.log(id);
    console.log(options.body);
    setTourneyList(tourneyList.filter((item) => item.id !== id));
    cancelClicked();
    return fetch(`${apiURL}/tourneys/${id}`, options).then(response => {
      if(response.ok && response.status === 204){
        return true;
      }
    });

  }

  return (
    <div className="tourneys">
      <TourneyIntro />
      <TourneyEntryForm formMode={formMode} tourney={currentTourneys} updateTourney={updateTourney}
        submitCallback={formSubmitted} cancelCallback={cancelClicked} />
      <div />
      <TourneyList tourneys={tourneyList} onEditClicked={editClicked} onDeleteClicked={deleteClicked} />
    </div>
  );
}

export default Tournaments;
