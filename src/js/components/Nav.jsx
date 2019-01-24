import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
  constructor() {
    super();

    this.state = {
      title: ""
    };
  }

  render() {
    return (
      <div>
        <nav className="nav">
          <ul className="nav__social">
            <li><a href="#">linkedin</a></li>
            <li><a href="#">github</a></li>
            <li><a href="#">instagram</a></li>
          </ul>
          <ul className="nav__menu">
            <li><Link to='/'>home</Link></li>
            <li><Link to='/work'>work</Link></li>
            <li><Link to='/about'>about</Link></li>
            <li><a href="mailto:michael@beaujean.io" className="nav__link--email">contact</a></li>
          </ul>
        </nav>
        <style jsx>{`
            .nav {
              flex-direction: column;
              position: absolute;
              bottom: 10vh;
              text-align: right;
              font-family: 'Cantarell', sans-serif;

              &__social,
              &__menu {
                list-style-type: none;
              }

              &__link--email {
                color: red;
              }
            }
          `}</style>
      </div>
    );
  }
}

export default Nav;