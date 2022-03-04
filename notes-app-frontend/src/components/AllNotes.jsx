import React, { Component } from "react";

export default class AllNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.history.location.state.user,
    };

    console.log(this.state.user);
  }
  render() {
    return <div>AllNotes</div>;
  }
}
