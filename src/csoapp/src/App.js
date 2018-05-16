import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import Navbar from './components/Header';
import WebMap from './components/WebMap';
// import NoticeBox from './components/NoticeBox';
// import FilterBox from './components/FilterBox';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar/>
        <WebMap/>
      </div>
    );
  }
}

export default App;
