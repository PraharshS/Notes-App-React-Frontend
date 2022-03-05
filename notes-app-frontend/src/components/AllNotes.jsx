import React, { Component } from "react";

export default class AllNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");
      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    this.setState({ user: this.props.history.location.state.user });
  }
  render() {
    return <div>AllNotes</div>;
  }
}
