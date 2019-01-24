import React, { Component } from "react";
import { HashRouter, Route } from 'react-router-dom';
import Intro from './Intro.jsx';
import Nav from './Nav.jsx';
import About from './About.jsx';
import Work from './Work.jsx';

class App extends Component {
  constructor() {
    super();

    this.state = {
      title: ""
    };
  }

  render() {
    return (
      <div>
        <HashRouter>
          <div className="main-wrapper">
            <Route exact path="/" component={Intro}/>
            <Route path="/work" component={Work} />
            <Route path="/about" component={About} />
            <Nav />
          </div>
        </HashRouter>
        <style jsx>{`
          .main-wrapper {
            position: relative;
            width: 75%;
            height: 100vh;
            margin: 0 auto;
          }
        `}</style>
      </div>
    );
  }
}

export default App;