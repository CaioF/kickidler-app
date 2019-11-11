import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Form from './components/form';
import Graphics from './components/graphic';

function App() {
  return (
    <Router>
      <div className="App">
        <ul>
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/info">GRAPHIC</Link></li>
          <li><Link onClick={() => window.location='https://cloud.mongodb.com/v2/5d8efdc4c56c9839eee19e39?#metrics/replicaSet/5d8eff40a6f239253a58ba46/explorer/Cluster0-kickidlerapp/test/find'}>DB MANAGER</Link></li>
        </ul>
        <header className="App-header">
          <img src={"logo-big.png"} alt="logo" />
        </header>
        <Route exact path="/" component={Home} />
        <Route path="/info" component={Info} />
      </div>
    </Router>
  );
}


function Home() {
  return (
    <div>
      <Form />
    </div>
  );
}

function Info() {
  return (
    <div>
      <Graphics />
    </div>
  );
}

export default App;
