import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
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
          <div className="main">
            <div className="icon"><Link to="/">MB</Link></div>
            <div className="summary">NYC based web dev</div>
            <Nav />
            <div className="content">
              <Route exact path="/" component={Intro}/>
              <Route path="/work" component={Work} />
              <Route path="/about" component={About} />
            </div>
          </div>
        </HashRouter>
        <style jsx>{`
          .main {
            position: relative;
            width: calc(100% - 160px);
            height: calc(100vh - 120px);
            margin: 60px auto 0;
            font-family: var(--fontSansSerif);
            text-transform: lowercase;
          }

          .icon {
            display: inline-block;
            font-family: var(--fontSerif);
            font-size: 36px;
            font-weight: 900;
            text-transform: uppercase;
            border-bottom: 5px solid var(--accent);
          }

          .summary {
            display: none;
            position: absolute;
            left: 0;
            bottom: 0;

            @media (min-width: 640px) {
              display: block;
            }

            @media (min-width: 1200px) {
              left: -80px;
              bottom: 60px;
              transform: translate3d(0, 0, 0) rotate(-90deg);
            }
          }

          .content {
            margin: 80px auto 0;

            @media (min-width: 640px) {
              height: calc(100% - 200px);
            }

            @media (min-width: 1200px) {
              width: calc(100% - 360px);
              height: auto;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default App;