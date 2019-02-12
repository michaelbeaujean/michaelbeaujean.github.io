import React from 'react';
import { Link } from 'react-router-dom';

import css from 'styled-jsx/css'

const linkStyles = css.resolve`
  a {
    color: var(--black);
    text-decoration: none;
  }
`;

const Nav = () => {
  return (
    <div>
      <nav className="nav">
        <ul className="nav__menu">
          <li><Link to="/">home</Link></li>
          <li><Link to="/work">work</Link></li>
          <li><Link to="/about">about</Link></li>
          <li><a href="mailto:michael@beaujean.io" className="nav__link--email">email</a></li>
        </ul>
        <ul className="nav__social">
          <li><a href="#">linkedin</a></li>
          <li><a href="#">github</a></li>
          <li><a href="#">instagram</a></li>
        </ul>
      </nav>
      <style jsx>{`
          .nav {
            text-align: right;

            &__social,
            &__menu {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              position: absolute;
              padding: 0;
              margin: 0 -15px;
              list-style-type: none;

              li {
                margin: 0 15px;
              }
            }

            &__menu {
              top: 0;
              right: 0;
            }

            &__social {
              right: -80px;
              bottom: 120px;
              transform: rotate(90deg);
            }

            &__link--email {
              color: red;
            }
          }
        `}</style>
    </div>
  );
}

export default Nav;