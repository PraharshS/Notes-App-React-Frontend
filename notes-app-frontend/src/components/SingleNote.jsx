import React, { Component } from "react";
import NoteService from "../services/NoteService";

export default class AllNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteMessage: this.props.history.location.state.message,
      noteObj: this.props.history.location.state,
      alertMessage: "",
    };
    console.log(this.state.noteObj);
    this.changeMessage = this.changeMessage.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.changeAlertDanger = this.changeAlertDanger.bind(this);
    this.changeAlertSuccess = this.changeAlertSuccess.bind(this);
    this.cancelEditNote = this.cancelEditNote.bind(this);
  }
  changeAlertDanger = (e) => {
    document.querySelector(".popup").style.display = "block";
    document.querySelector(".popup").style.backgroundColor = "red";
  };
  changeAlertSuccess = (e) => {
    document.querySelector(".popup").style.display = "block";
    document.querySelector(".popup").style.backgroundColor = "green";
  };
  changeMessage = (e) => {
    this.setState({ noteMessage: e.target.value });
  };
  updateNote = (e) => {
    console.log("state", this.state);
    const updatedNoteObj = {
      message: this.state.noteMessage,
      user: this.state.noteObj.user,
    };
    NoteService.updateNote(this.state.noteObj.id, updatedNoteObj)
      .then((res) => {
        console.log("updated note", res.data);
        this.setState({
          alertMessage: "Note updated Successfully, Redirecting to All notes",
        });
        this.changeAlertSuccess();
        setTimeout(() => {
          this.props.history.goBack();
        }, 2000);
      })
      .catch((err) => {
        this.serverErrorPopup("while updating the note...");
      });
  };
  cancelEditNote = (e) => {
    this.setState({
      alertMessage: "Note Updation cancelled, Redirecting to All notes",
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
    console.log("cdm called");

    document.querySelector(".popup").style.display = "none";
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");
      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    this.setState({ user: this.props.history.location.state.user });
    NoteService.getNotesByUser(this.props.history.location.state.user)
      .then((res) => {
        this.setState({ notesList: res.data.notesData });
      })
      .catch((err) => {
        this.serverErrorPopup("while fetching notes...");
      });
  }
  handleNewNoteText(e) {
    this.setState({ newNoteText: e.target.value });
  }

  openFullNote(e) {
    var id = parseInt(e.currentTarget.getAttribute("id"));
    this.setState({ currentNoteId: id });
    var message = e.currentTarget.getAttribute("message");
    this.setState({ newNoteText: message });
    var noteObj = { id, message, user: this.state.user };
    this.props.history.push("/view-note", noteObj);
  }
  handleUpdateClick(e) {
    const updatedNoteObj = {
      message: this.state.newNoteText,
      user: this.state.user,
    };
    NoteService.updateNote(this.state.currentNoteId, updatedNoteObj)
      .then((res) => {
        console.log("updated note", res.data);
        NoteService.getNotesByUser(this.props.history.location.state.user).then(
          (childRes) => {
            this.setState({ notesList: childRes.data.notesData });
          }
        );
        document.querySelector("#addBtn").style.display = "block";
        document.querySelector("#updateBtn").style.display = "none";
        document.querySelector("#noteInput").value = "";
      })
      .catch((err) => {
        this.serverErrorPopup("while updating the note...");
      });
  }
  handleDeleteClick(e) {
    var noteId = parseInt(e.currentTarget.getAttribute("id"));
    NoteService.deleteNote(noteId)
      .then((res) => {
        this.setState({
          notesList: this.state.notesList.filter((note) => note.id !== noteId),
        });
      })
      .catch((err) => {
        this.serverErrorPopup("while deleting the note...");
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
                Update Note
              </h3>
              <div className="card-body">
                <form action="">
                  <div className="form-group" style={containerStyle.formGroup}>
                    <label style={containerStyle.label}>message</label>
                    <input
                      style={containerStyle.input}
                      type="text"
                      placeholder="message"
                      className="form-control"
                      value={this.state.noteMessage}
                      onChange={this.changeMessage}
                    />
                  </div>

                  {/* <div className="form-group" style={containerStyle.formGroup}>
                    <label style={containerStyle.label}>Password</label>
                    <input
                      style={containerStyle.input}
                      type="text"
                      placeholder="Password"
                      className="form-control"
                      value={this.state.password}
                      onChange={this.changePasswordHandler}
                    />
                  </div> */}
                  <div className="form-group" style={containerStyle.formGroup}>
                    <div
                      className="btn btn-success"
                      onClick={this.updateNote}
                      style={loginButtonStyle.button1}
                    >
                      Update
                    </div>
                    <div
                      className="btn btn-danger"
                      onClick={this.cancelEditNote}
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
