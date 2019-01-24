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
        <h1>Michael Beaujean is a web developer based in New York City.</h1>
        <style jsx>{`
          h1 {
            position: absolute;
            top: 30vh;
            text-transform: lowercase;
            font-family: 'Fjalla One', sans-serif;
            font-size: 18px;
          }
        `}</style>
      </div>
    );
  }
}

export default Intro;