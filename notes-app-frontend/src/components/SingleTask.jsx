import React, { Component } from "react";
import TaskService from "../services/TaskService";

export default class SingleTask extends Component {
  constructor(props) {
    super(props);
    console.log("props", this.props.history.location);
    this.state = {
      taskName: this.props.history.location.state.name,
      taskDescription: this.props.history.location.state.description,
      taskTargetedDate: this.props.history.location.state.targeted_date,
      taskObj: this.props.history.location.state,
      alertMessage: "",
    };
    this.changeName = this.changeName.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.changeTargetedDate = this.changeTargetedDate.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.changeAlertDanger = this.changeAlertDanger.bind(this);
    this.changeAlertSuccess = this.changeAlertSuccess.bind(this);
    this.cancelEditTask = this.cancelEditTask.bind(this);
  }
  changeAlertDanger = (e) => {
    document.querySelector(".popup").style.display = "block";
    document.querySelector(".popup").style.backgroundColor = "red";
  };
  changeAlertSuccess = (e) => {
    document.querySelector(".popup").style.display = "block";
    document.querySelector(".popup").style.backgroundColor = "green";
  };
  changeName = (e) => {
    this.setState({ taskName: e.target.value });
  };
  changeDescription = (e) => {
    this.setState({ taskDescription: e.target.value });
  };
  changeTargetedDate = (e) => {
    this.setState({ taskTargetedDate: e.target.value });
  };
  updateTask = (e) => {
    const updatedTaskObj = {
      name: this.state.taskName,
      description: this.state.taskDescription,
      targeted_date: this.state.taskTargetedDate,
      user: this.state.taskObj.user,
    };
    TaskService.updateTask(this.state.taskObj.id, updatedTaskObj)
      .then((res) => {
        this.setState({
          alertMessage: "Task updated Successfully, Redirecting to All tasks",
        });
        this.changeAlertSuccess();
        setTimeout(() => {
          this.props.history.goBack();
        }, 2000);
      })
      .catch((err) => {
        this.serverErrorPopup("while updating the task...");
      });
  };
  cancelEditTask = (e) => {
    this.setState({
      alertMessage: "Task Updation cancelled, Redirecting to All tasks",
    });
    this.changeAlertDanger();
    setTimeout(() => {
      this.props.history.goBack();
    }, 2000);
  };
  serverErrorPopup(errorMessage) {
    this.setState({ popupText: "Internal Server error " + errorMessage });
    document.querySelector(".popup").style.display = "block";
  }
  componentDidMount() {
    document.querySelector(".popup").style.display = "none";
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");
      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    this.setState({ user: this.props.history.location.state.user });
    TaskService.getTasksByUser(this.props.history.location.state.user.id)
      .then((res) => {
        this.setState({ tasksList: res.data.tasksData });
      })
      .catch((err) => {
        this.serverErrorPopup("while fetching tasks...");
      });
  }
  handleNewTaskText(e) {
    this.setState({ newTaskText: e.target.value });
  }

  openFullTask(e) {
    var id = parseInt(e.currentTarget.getAttribute("id"));
    this.setState({ currentTaskId: id });
    var name = e.currentTarget.getAttribute("name");
    this.setState({ newTaskText: name });
    var taskObj = { id, name, user: this.state.user };
    this.props.history.push("/view-task", taskObj);
  }
  handleUpdateClick(e) {
    const updatedTaskObj = {
      name: this.state.newTaskText,
      user: this.state.user,
    };
    TaskService.updateTask(this.state.currentTaskId, updatedTaskObj)
      .then((res) => {
        TaskService.getTasksByUser(
          this.props.history.location.state.user.id
        ).then((childRes) => {
          this.setState({ tasksList: childRes.data.tasksData });
        });
        document.querySelector("#addBtn").style.display = "block";
        document.querySelector("#updateBtn").style.display = "none";
        document.querySelector("#taskInput").value = "";
      })
      .catch((err) => {
        this.serverErrorPopup("while updating the task...");
      });
  }
  handleDeleteClick(e) {
    var taskId = parseInt(e.currentTarget.getAttribute("id"));
    TaskService.deleteTask(taskId)
      .then((res) => {
        this.setState({
          tasksList: this.state.tasksList.filter((task) => task.id !== taskId),
        });
      })
      .catch((err) => {
        this.serverErrorPopup("while deleting the task...");
      });
  }
  handleLogOutClick(e) {
    this.props.history.push("/");
    window.history.replaceState({}, document.title);
  }
  render() {
    return (
      <div>
        <div className="container" style={containerStyle.div}>
          <div className="row">
            <div className="card" style={containerStyle.card}>
              <h3 className="text-center" style={containerStyle.heading}>
                Update Task
              </h3>
              <div className="card-body">
                <form action="">
                  <div className="form-group" style={containerStyle.formGroup}>
                    <label style={containerStyle.label}>name</label>
                    <input
                      style={containerStyle.input}
                      type="text"
                      placeholder="name"
                      className="form-control"
                      value={this.state.taskName}
                      onChange={this.changeName}
                    />
                  </div>
                  <div className="form-group" style={containerStyle.formGroup}>
                    <label style={containerStyle.label}>description</label>
                    <input
                      style={containerStyle.input}
                      type="text"
                      placeholder="description"
                      className="form-control"
                      value={this.state.taskDescription}
                      onChange={this.changeDescription}
                    />
                  </div>
                  <div className="form-group" style={containerStyle.formGroup}>
                    <label style={containerStyle.label}>targeted date</label>
                    <input
                      style={containerStyle.input}
                      type="date"
                      placeholder="description"
                      className="form-control"
                      value={this.state.taskTargetedDate}
                      onChange={this.changeTargetedDate}
                    />
                  </div>
                  <div className="form-group" style={containerStyle.formGroup}>
                    <div
                      className="btn btn-success"
                      onClick={this.updateTask}
                      style={loginButtonStyle.button1}
                    >
                      Update
                    </div>
                    <div
                      className="btn btn-danger"
                      onClick={this.cancelEditTask}
                      style={loginButtonStyle.button2}
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
    width: "300px",
  },
  alertMessage: {
    backgroundColor: "orange",
    fontSize: "10px",
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
