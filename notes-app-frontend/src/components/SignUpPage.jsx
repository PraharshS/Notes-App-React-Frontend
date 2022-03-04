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
      isAlertShow: true,
      alertType: "danger",
      redirect: null,
    };
    this.changeUsername = this.changeUsername.bind(this);
    this.changePasswordHandler = this.changePasswordHandler.bind(this);
    this.changeConfirmPasswordHandler =
      this.changeConfirmPasswordHandler.bind(this);
    this.changeAlertBg = this.changeAlertBg.bind(this);
  }
  changeUsername = (e) => {
    this.setState({ username: e.target.value });
  };
  changeAlertBg = (e) => {
    document.querySelector(".alertMessage").style.backgroundColor = "green";
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
    this.setState({ alertMessage: "Username Length must be greater than 3" });
    this.setState({ isAlertShow: true });
    return false;
  }

  passwordValidator(password) {
    if (password.trim().length >= 6) {
      return true;
    }
    this.setState({
      alertMessage: "Password Length must be minimum 6 characters",
    });
    this.setState({ isAlertShow: true });
    return false;
  }
  confirmPasswordValidator(confirmpassword) {
    if (this.state.password === confirmpassword) return true;
    this.setState({ alertMessage: "Passwords do not match" });
    this.setState({ isAlertShow: true });
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
    this.changeAlertBg();
    console.log("User => " + JSON.stringify(User));
    this.setState({ alertMessage: "Account Created Successfully" });
    this.setState({ isAlertShow: true });
    this.setState({ alertType: "success" });
    setTimeout(() => {
      UserService.createUser(User).then((res) => {
        // console.log(res.data);
        console.log(this.props);
        this.setState({ redirect: "/login" });
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
                      type="text"
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
                      type="text"
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
                    >
                      Cancel
                    </div>
                  </div>
                </form>
                {this.state.isAlertShow && (
                  <div
                    className="alertMessage"
                    variant={this.state.alertType}
                    style={containerStyle.alertMessage}
                  >
                    <p>{this.state.alertMessage}</p>
                  </div>
                )}
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
