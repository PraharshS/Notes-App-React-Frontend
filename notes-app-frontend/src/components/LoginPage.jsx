import React, { Component } from "react";
import UserService from "../services/UserService";
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Praharsh",
      password: "123456",
      confirmPassword: "123456",
      alertMessage: "",
    };
    this.changeUsername = this.changeUsername.bind(this);
    this.changePasswordHandler = this.changePasswordHandler.bind(this);
    this.changeAlertDanger = this.changeAlertDanger.bind(this);
    this.changeAlertSuccess = this.changeAlertSuccess.bind(this);
  }
  componentDidMount() {
    document.querySelector(".popup").style.display = "none";
  }
  changeUsername = (e) => {
    this.setState({ username: e.target.value });
  };
  changeAlertDanger = (e) => {
    document.querySelector(".popup").style.backgroundColor = "red";
  };
  changeAlertSuccess = (e) => {
    document.querySelector(".popup").style.backgroundColor = "green";
  };

  changePasswordHandler = (e) => {
    this.setState({ password: e.target.value });
  };

  loginUser = (e) => {
    e.preventDefault();
    let User = {
      username: this.state.username,
      password: this.state.password,
    };
    this.changeAlertSuccess();

    setTimeout(() => {
      UserService.loginUser(User).then((res) => {
        console.log("data", res.data);
        var user = res.data.user;
        var token = res.data.token;
        if (user.id === 0) {
          document.querySelector(".popup").style.display = "block";
          this.setState({
            alertMessage: "Invalid credentials",
          });
          this.changeAlertDanger();
        } else {
          document.querySelector(".popup").style.display = "block";
          this.setState({
            alertMessage: "Login Successful, redirecting to your tasks",
          });
          this.setState({ isAlertShow: true });
          this.changeAlertSuccess();
          setTimeout(() => {
            this.props.history.push("/tasks", { user: user, token: token });
          }, 3000);
        }
      });
    }, 1);
  };

  render() {
    return (
      <div>
        <div className="container" style={containerStyle.div}>
          <div className="row">
            <div className="card" style={containerStyle.card}>
              <h3 className="text-center" style={containerStyle.heading}>
                Login User
              </h3>
              <div className="card-body">
                <form action="">
                  <div className="form-group" style={containerStyle.formGroup}>
                    <label style={containerStyle.label}>Username</label>
                    <input
                      style={containerStyle.input}
                      type="text"
                      placeholder="Username"
                      className="form-control"
                      value={this.state.username}
                      onChange={this.changeUsername}
                    />
                  </div>

                  <div className="form-group" style={containerStyle.formGroup}>
                    <label style={containerStyle.label}>Password</label>
                    <input
                      style={containerStyle.input}
                      type="password"
                      placeholder="Password"
                      className="form-control"
                      value={this.state.password}
                      onChange={this.changePasswordHandler}
                    />
                  </div>
                  <div className="form-group" style={containerStyle.formGroup}>
                    <div
                      className="btn btn-success"
                      onClick={this.loginUser}
                      style={loginButtonStyle.button1}
                    >
                      Login
                    </div>
                    <div
                      className="btn btn-danger"
                      style={loginButtonStyle.button2}
                      onClick={this.props.history.goBack}
                    >
                      Cancel
                    </div>
                  </div>
                </form>
                <div style={containerStyle.alertMessage} className="popup">
                  <p>{this.state.alertMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
var containerStyle = {
  div: {
    border: "4px solid black",
    padding: "2rem",
    backgroundColor: "white",
    textAlign: "center",
    maxWidth: "800px",
    width: "100%",
  },
  formGroup: {
    margin: "1rem auto",
    display: "flex",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "1rem",
  },
  card: {},
  label: {
    textAlign: "left",
    fontSize: "1rem",
    fontWeight: "bold",
    margin: "0.7rem 0",
  },
  input: {
    padding: "1rem 1rem",
    fontWeight: "bold",
  },
  alertMessage: {
    backgroundColor: "orange",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "white",
    marginTop: "1rem",
    padding: "0.1rem 0.5rem",
  },
};
var loginButtonStyle = {
  parent: {
    display: "flex",
    justifyContent: "center",
  },
  button1: {
    cursor: "pointer",
    marginTop: "1.5rem",
    padding: "1rem 2rem",
    marginRight: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    backgroundColor: "lightgreen",
    borderRadius: "0",
    border: "2px solid black",
    width: "30%",
  },
  button2: {
    cursor: "pointer",
    marginTop: "1.5rem",
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    backgroundColor: "red",
    borderRadius: "0",
    border: "2px solid black",
    width: "30%",
  },
};

export default LoginPage;
