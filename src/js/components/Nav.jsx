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
          <li><Link to="/" className="nav__link">home</Link></li>
          <li><Link to="/work" className="nav__link">work</Link></li>
          <li><Link to="/about" className="nav__link">about</Link></li>
          <li><a href="mailto:michael@beaujean.io" className="nav__link">email</a></li>
        </ul>
        <ul className="nav__social">
          <li><a href="#" className="nav__link">linkedin</a></li>
          <li><a href="#" className="nav__link">github</a></li>
          <li><a href="#" className="nav__link">instagram</a></li>
        </ul>
      </nav>
      <style jsx global>{`
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
              top: 35px;
              right: 0;
            }

            &__social {
              right: 0;
              bottom: 0;
              
              @media (min-width: 1200px) {
                right: -120px;
                bottom: 120px;
                transform: translate3d(0, 0, 0) rotate(90deg);
              }
            }

            &__link {
              position: relative;
              padding-bottom: 3px;
              transition: color var(--duration) var(--easeCb);

              &:after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 1px;
                background-color: var(--accent);
                transform: translate3d(0, 0, 0) scale(0);
                transition: transform var(--duration) var(--easeCb);
                transform-origin: middle;
              }

              &:hover {
                color: var(--accent);
                transition: color var(--duration) var(--easeCb);

                
                &:after {
                  transform: translate3d(0, 0, 0) scale(1);
                  transition: transform var(--duration) var(--easeCb);
                }
              }
            }
          }
        `}</style>
    </div>
  );
}

export default Nav;