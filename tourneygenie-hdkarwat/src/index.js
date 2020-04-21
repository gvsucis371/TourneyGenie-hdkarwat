import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './TourneyGenie.css';
import Tournaments from './TourneyGenie_v1';
import * as serviceWorker from './serviceWorker';
import Teams from './TourneyGenie_v2';

ReactDOM.render(<Tournaments />, document.getElementById('root'));
ReactDOM.render(<Teams />, document.getElementById('root'));

serviceWorker.unregister();

