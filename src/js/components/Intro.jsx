import React, { Component } from "react";

class Intro extends Component {
  constructor() {
    super();

    this.state = {
      title: ""
    };
  }

  render() {
    return (
      <div>
        <h1><span className="highlight">Michael Beaujean</span> is a web developer <span className="break">based in New York City 💻 🗽</span></h1>
        <style jsx>{`
          h1 {
            font-size: 22px;
            font-weight: 300;

            @media (min-width: 640px) {
              font-size: 26px;
            }

            @media (min-width: 1200px) {
              font-size: 32px;
            }

            .highlight {
              color: var(--accent);
            }

            .break {
              display: block;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Intro;