import React, { Component } from "react";
import { Link } from "react-router-dom";
export default class HomePage extends Component {
  render() {
    return (
      <div style={homePageStyle.div}>
        <h1 style={homePageStyle.heading}>Welcome To Tasks App</h1>
        <div style={homePageStyle.buttons}>
          <Link to="/login" style={homePageStyle.link}>
            <div className="Login" style={homePageStyle.loginBtn}>
              Login
            </div>
          </Link>
          <Link to="/signup" style={homePageStyle.link}>
            <div className="Signup" style={homePageStyle.signupBtn}>
              Signup
            </div>
          </Link>
        </div>
      </div>
    );
  }
}
var homePageStyle = {
  div: {
    width: "600px",
    border: "6px solid black",
    padding: "2rem",
    backgroundColor: "#94d2bd",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    textAlign: "center",
  },
  buttons: {
    width: "80%",
    display: "flex",
    justifyContent: "space-evenly",
    margin: "auto",
  },
  link: {
    textDecoration: "none",
  },
  signupBtn: {
    fontSize: "1.5rem",
    fontWeight: "500",
    border: "2px solid black",
    padding: "0.5rem 2rem",
    color: "black",
    backgroundColor: "#fb8500",
  },
  loginBtn: {
    fontSize: "1.5rem",
    fontWeight: "500",
    border: "2px solid black",
    padding: "0.5rem 2rem",
    color: "black",
    backgroundColor: "#8ecae6",
  },
};
