import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './TourneyGenie.css';
import Tournaments from './TourneyGenie_v1';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Tournaments />, document.getElementById('root'));


serviceWorker.unregister();

