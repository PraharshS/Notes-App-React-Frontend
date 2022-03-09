import React, { Component } from "react";
import UserService from "../services/UserService";
class SignupPage extends Component {
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
    this.changeConfirmPasswordHandler =
      this.changeConfirmPasswordHandler.bind(this);
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
  changeConfirmPasswordHandler = (e) => {
    this.setState({ confirmPassword: e.target.value });
  };

  usernameValidator(name) {
    if (name.trim().length > 3) {
      return true;
    }
    document.querySelector(".popup").style.display = "block";
    this.setState({ alertMessage: "Username Length must be greater than 3" });
    this.changeAlertDanger();
    return false;
  }

  passwordValidator(password) {
    if (password.trim().length >= 6) {
      return true;
    }
    document.querySelector(".popup").style.display = "block";
    this.setState({
      alertMessage: "Password Length must be minimum 6 characters",
    });
    this.changeAlertDanger();

    return false;
  }
  confirmPasswordValidator(confirmpassword) {
    if (this.state.password === confirmpassword) return true;
    document.querySelector(".popup").style.display = "block";
    this.setState({ alertMessage: "Passwords do not match" });
    this.changeAlertDanger();

    return false;
  }

  saveUser = (e) => {
    e.preventDefault();
    let User = {
      username: this.state.username,
      password: this.state.password,
    };
    var isNameValid = this.usernameValidator(this.state.username);

    if (!isNameValid) {
      return;
    }

    var isPasswordValid = this.passwordValidator(this.state.password);
    if (!isPasswordValid) {
      return;
    }
    var isConfirmPasswordValid = this.confirmPasswordValidator(
      this.state.confirmPassword
    );
    if (!isConfirmPasswordValid) {
      return;
    }
    console.log("User => " + JSON.stringify(User));
    document.querySelector(".popup").style.display = "block";
    this.setState({ alertMessage: "Account created Successfully" });
    this.changeAlertSuccess();
    setTimeout(() => {
      UserService.createUser(User).then((res) => {
        this.props.history.push("/login");
      });
    }, 2000);
  };

  render() {
    return (
      <div>
        <div className="container" style={containerStyle.div}>
          <div className="row">
            <div className="card" style={containerStyle.card}>
              <h3 className="text-center" style={containerStyle.heading}>
                Create User
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
                    <label style={containerStyle.label}>Confirm Password</label>
                    <input
                      style={containerStyle.input}
                      type="password"
                      placeholder="Confirm Password"
                      className="form-control"
                      value={this.state.confirmPassword}
                      onChange={this.changeConfirmPasswordHandler}
                    />
                  </div>
                  <div className="form-group" style={containerStyle.formGroup}>
                    <div
                      className="btn btn-success"
                      onClick={this.saveUser}
                      style={loginButtonStyle.button1}
                    >
                      Register
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
                <div className="popup" style={containerStyle.alertMessage}>
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

export default SignupPage;
