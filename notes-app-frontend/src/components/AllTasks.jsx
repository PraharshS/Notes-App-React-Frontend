import React, { Component } from "react";
import TaskService from "../services/TaskService";

export default class AllTasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasksList: [],
      newTaskText: "",
      newTaskDescription: "",
      newTaskTargetedDate: this.getDate(),
      currentTaskId: "",
      popupText: "",
    };
    this.handleNewTaskText = this.handleNewTaskText.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.getDate = this.getDate.bind(this);
    this.isTargetDateValid = this.isTargetDateValid.bind(this);
    this.handleNewTaskDescription = this.handleNewTaskDescription.bind(this);
    this.handleNewTaskTargetedDate = this.handleNewTaskTargetedDate.bind(this);
    this.handleTaskToggle = this.handleTaskToggle.bind(this);
    this.addTask = this.addTask.bind(this);
    this.openFullTask = this.openFullTask.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleLogOutClick = this.handleLogOutClick.bind(this);
  }
  serverErrorPopup(errorMessage) {
    this.setState({ popupText: "Internal Server error " + errorMessage });
    document.querySelector(".popup").style.display = "block";
  }
  componentDidMount() {
    console.log(this.props.history.location.state);
    this.setState({ newTaskText: "" });
    document.querySelector("#popup").style.display = "none";
    // document.querySelector("#addBtn").style.display = "block";
    // document.querySelector("#updateBtn").style.display = "none";
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");
      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    this.setState({ user: this.props.history.location.state.user });
    TaskService.getTasksByUser(this.props.history.location.state.user.id)
      .then((res) => {
        console.log("tasklist", ...res.data);
        this.setState({ tasksList: res.data });
      })
      .catch((err) => {
        this.serverErrorPopup("while fetching tasks...");
      });
  }
  getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }
  isTargetDateValid(taskTargetedDate) {
    var today = this.getDate();
    var date1Updated = new Date(taskTargetedDate.replace(/-/g, "/"));
    var date2Updated = new Date(today.replace(/-/g, "/"));
    return date1Updated >= date2Updated;
  }
  handleNewTaskText(e) {
    this.setState({ newTaskText: e.target.value });
  }
  handleNewTaskDescription(e) {
    this.setState({ newTaskDescription: e.target.value });
  }
  handleNewTaskTargetedDate(e) {
    console.log("picked date", e.target.value);
    this.setState({ newTaskTargetedDate: e.target.value });
  }
  handleTaskToggle(e) {
    var taskId = e.currentTarget.parentNode.getAttribute("id");
    console.log("done called");
    TaskService.toggleTaskDone(taskId)
      .then((res) => {
        TaskService.getTasksByUser(this.props.history.location.state.user.id)
          .then((getRes) => {
            console.log("tasklist", ...getRes.data);
            this.setState({ tasksList: getRes.data });
          })
          .catch((err) => {
            this.serverErrorPopup("while fetching tasks...");
          });
      })
      .catch((err) => {
        this.serverErrorPopup("while changing task status");
      });
  }
  addTask(e) {
    document.querySelector("#taskInputText").value = "";
    if (this.state.newTaskText.trim() === "") {
      this.setState({ popupText: "Cannot add an empty task" });
      this.setState({ newTaskText: "" });
      document.querySelector(".popup").style.display = "block";
      setTimeout(() => {
        document.querySelector(".popup").style.display = "none";
      }, 2000);
      return;
    }
    document.querySelector("#taskInputDescription").value = "";
    if (this.state.newTaskDescription.trim() === "") {
      this.setState({ popupText: "Cannot add task with empty description" });
      this.setState({ newTaskDescription: "" });
      document.querySelector(".popup").style.display = "block";
      setTimeout(() => {
        document.querySelector(".popup").style.display = "none";
      }, 2000);
      return;
    }
    const taskObj = {
      name: this.state.newTaskText,
      description: this.state.newTaskDescription,
      user: this.state.user,
      is_done: false,
      targeted_date: this.state.newTaskTargetedDate,
    };
    console.log("new Task obj", taskObj);
    TaskService.addTask(taskObj)
      .then((res) => {
        this.setState({ tasksList: [...this.state.tasksList, res.data] });
      })
      .catch((err) => {
        this.serverErrorPopup("while adding a task...");
      });
  }
  openFullTask(e) {
    var id = e.currentTarget.getAttribute("id");
    var name = e.currentTarget.getAttribute("name");
    var description = e.currentTarget.getAttribute("description");
    var targeted_date = e.currentTarget.getAttribute("targeted_date");
    var taskObj = {
      id,
      name,
      description,
      targeted_date,
      user: this.state.user,
    };
    this.props.history.push("/edit-task", taskObj);
  }
  handleDeleteClick(e) {
    var taskId = e.currentTarget.getAttribute("id");
    console.log("deletedTaskId", taskId);
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
      <div style={tasksTableStyle.card}>
        <div style={tasksTableStyle.header}>
          <h1 style={tasksTableStyle.h1}>
            {this.props.history.location.state &&
              this.props.history.location.state.user.username}
            's Tasks
          </h1>
          <button
            id="logoutBtn"
            style={tasksTableStyle.logoutBtn}
            onClick={this.handleLogOutClick}
          >
            Logout
          </button>
        </div>

        <div style={tasksTableStyle.AddTask}>
          <input
            id="taskInputText"
            style={tasksTableStyle.input}
            type="text"
            placeholder="Write a new task name"
            onChange={this.handleNewTaskText}
          />
          <input
            id="taskInputDescription"
            style={tasksTableStyle.input}
            type="text"
            placeholder="Write a new task description"
            onChange={this.handleNewTaskDescription}
          />
          <input
            id="taskInputTargetedDate"
            style={tasksTableStyle.inputDate}
            type="date"
            name="targeted_date"
            value={this.state.newTaskTargetedDate}
            onChange={this.handleNewTaskTargetedDate}
          />
          <button
            id="addBtn"
            style={tasksTableStyle.addBtn}
            onClick={this.addTask}
          >
            Add
          </button>
        </div>
        {this.state.tasksList.map((task, taskSerialNumber) => {
          return (
            <div id={task.id} key={task.id} style={tasksTableStyle.task}>
              <p style={tasksTableStyle.id}>{taskSerialNumber + 1}.</p>
              <div style={tasksTableStyle.taskText}>
                <p
                  style={
                    task.is_done
                      ? tasksTableStyle.CrossMessage
                      : tasksTableStyle.name
                  }
                >
                  Name : {task.name}
                </p>
                <p
                  style={
                    task.is_done
                      ? tasksTableStyle.CrossDescription
                      : tasksTableStyle.description
                  }
                >
                  Description : {task.description}
                </p>
                <p
                  style={
                    task.is_done
                      ? tasksTableStyle.CrossDate
                      : tasksTableStyle.date
                  }
                >
                  Targeted Date : {task.targeted_date}
                </p>
              </div>
              <button
                disabled
                style={
                  this.isTargetDateValid(task.targeted_date)
                    ? tasksTableStyle.ExpiredButtonHide
                    : tasksTableStyle.ExpiredButtonShow
                }
              >
                EXPIRED
              </button>
              <button
                onClick={this.handleTaskToggle}
                style={
                  task.is_done
                    ? tasksTableStyle.DoneButtonHide
                    : tasksTableStyle.DoneButtonShow
                }
              >
                Done
              </button>
              <button
                onClick={this.handleTaskToggle}
                style={
                  task.is_done
                    ? tasksTableStyle.UndoButtonShow
                    : tasksTableStyle.UndoButtonHide
                }
              >
                Undo
              </button>
              <button
                onClick={this.openFullTask}
                id={task.id}
                name={task.name}
                description={task.description}
                targeted_date={task.targeted_date}
                style={tasksTableStyle.EditButton}
              >
                Edit
              </button>
              <button
                onClick={this.handleDeleteClick}
                id={task.id}
                style={tasksTableStyle.DeleteButton}
              >
                Delete
              </button>
            </div>
          );
        })}

        <div className="popup" id="popup" style={tasksTableStyle.popup}>
          <h2 style={tasksTableStyle.popupText}>{this.state.popupText}</h2>
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
    backgroundColor: "#94d2bd",
    padding: "2rem",
    width: "95%",
    maxWidth: "1000px",
  },
  h1: {
    display: "inline-block",
    textAlign: "center",
    fontSize: "3rem",
  },
  taskText: {
    width: "100%",
  },
  name: {
    marginRight: "1rem",
  },
  CrossMessage: {
    marginRight: "1rem",
    textDecoration: "line-through",
    textDecorationThickness: "3px",
  },
  description: {
    // color: "grey",
    fontWeight: "normal",
  },
  CrossDescription: {
    // color: "grey",
    fontWeight: "normal",
    textDecoration: "line-through",
    textDecorationThickness: "3px",
  },
  date: {
    // color: "grey",
    fontWeight: "normal",
  },
  CrossDate: {
    // color: "grey",
    fontWeight: "normal",
    textDecoration: "line-through",
    textDecorationThickness: "3px",
  },
  AddTask: {
    display: "flex",
    justifyContent: "center",
  },
  input: {
    width: "400px",
    padding: "1rem 1.5rem",
    fontSize: "1.2rem",
    marginRight: "1rem",
    fontWeight: "bold",
  },
  inputDate: {
    width: "250px",
    marginRight: "1rem",
    padding: "0.5rem",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  addBtn: {
    cursor: "pointer",
    backgroundColor: "#4ae874",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
  },
  logoutBtn: {
    cursor: "pointer",
    backgroundColor: "#dc2f02",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    marginLeft: "auto",
    height: "50px",
  },
  updateBtn: {
    cursor: "pointer",
    backgroundColor: "orange",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
  },
  ExpiredButtonShow: {
    border: "2px solid black",
    outline: "none",
    backgroundColor: "orange",
    color: "black",
    fontSize: "1.2rem",
    padding: "0.5rem 1rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  ExpiredButtonHide: {
    display: "none",
  },
  DoneButtonShow: {
    cursor: "pointer",
    border: "2px solid black",
    outline: "none",
    borderRadius: "5px",
    backgroundColor: "#219ebc",
    color: "black",
    fontSize: "1rem",
    fontWeight: "normal",
    padding: "1rem 1.5rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  DoneButtonHide: {
    display: "none",
  },
  UndoButtonShow: {
    cursor: "pointer",
    border: "2px solid black",
    outline: "none",
    borderRadius: "5px",
    backgroundColor: "#8ecae6",
    color: "black",
    fontSize: "1rem",
    fontWeight: "normal",
    padding: "1rem 1.5rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  UndoButtonHide: {
    display: "none",
  },
  EditButton: {
    cursor: "pointer",
    border: "2px solid black",
    outline: "none",
    borderRadius: "5px",
    backgroundColor: "#ffb703",
    color: "black",
    fontSize: "1rem",
    fontWeight: "normal",
    padding: "1rem 1.5rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  DeleteButton: {
    cursor: "pointer",
    border: "2px solid black",
    outline: "none",
    borderRadius: "5px",
    backgroundColor: "#fb8500",
    color: "black",
    fontSize: "1rem",
    fontWeight: "normal",
    padding: "1rem 1.5rem",
    marginLeft: "1rem",
    marginRight: "1rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  task: {
    backgroundColor: "white",
    display: "flex",
    margin: "1rem 0",
    fontSize: "1.1rem",
    fontWeight: "bold",
  },
  id: {
    marginLeft: "1rem",
    marginRight: "1rem",
  },
  popup: {
    backgroundColor: "orange",
    padding: "2px",
    textAlign: "center",
    marginTop: "1rem",
  },
};
