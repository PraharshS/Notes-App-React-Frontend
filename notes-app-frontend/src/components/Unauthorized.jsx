import React, { Component } from "react";

export default class Unauthorized extends Component {
  constructor(props) {
    super(props);
    this.handleHomeClick = this.handleHomeClick.bind(this);
  }
  handleHomeClick() {
    this.props.history.push("/");
  }
  render() {
    return (
      <div style={tasksTableStyle.card}>
        <div style={tasksTableStyle.header}>
          <h1 style={tasksTableStyle.h1}>Unauthorized Access</h1>
        </div>
        <div style={tasksTableStyle.btnWrapper}>
          <button style={tasksTableStyle.btn} onClick={this.handleHomeClick}>
            GO TO HOME PAGE
          </button>
        </div>
      </div>
    );
  }
}
var tasksTableStyle = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: "cyan",
    padding: "2rem",
  },
  h1: {
    display: "inline-block",
    textAlign: "center",
    fontSize: "3rem",
  },
  btnWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: "orange",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    height: "50px",
  },
};
