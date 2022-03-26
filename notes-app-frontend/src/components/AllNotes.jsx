import React, { Component } from "react";
import NoteService from "../services/NoteService";

export default class AllNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notesList: [],
      newNoteText: "",
      newNoteDescription: "",
      newNoteTargetedDate: this.getDate(),
      currentNoteId: "",
      popupText: "",
    };
    this.handleNewNoteText = this.handleNewNoteText.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.getDate = this.getDate.bind(this);
    this.isTargetDateValid = this.isTargetDateValid.bind(this);
    this.handleNewNoteDescription = this.handleNewNoteDescription.bind(this);
    this.handleNewNoteTargetedDate = this.handleNewNoteTargetedDate.bind(this);
    this.handleTaskToggle = this.handleTaskToggle.bind(this);
    this.addNote = this.addNote.bind(this);
    this.openFullNote = this.openFullNote.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleLogOutClick = this.handleLogOutClick.bind(this);
  }
  serverErrorPopup(errorMessage) {
    this.setState({ popupText: "Internal Server error " + errorMessage });
    document.querySelector(".popup").style.display = "block";
  }
  componentDidMount() {
    console.log(this.props.history.location.state);
    this.setState({ newNoteText: "" });
    document.querySelector("#popup").style.display = "none";
    // document.querySelector("#addBtn").style.display = "block";
    // document.querySelector("#updateBtn").style.display = "none";
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");
      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    this.setState({ user: this.props.history.location.state.user });
    NoteService.getNotesByUser(this.props.history.location.state.user)
      .then((res) => {
        // console.log("notelist", ...res.data);
        this.setState({ notesList: res.data });
      })
      .catch((err) => {
        this.serverErrorPopup("while fetching notes...");
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
  isTargetDateValid(noteTargetedDate) {
    var today = this.getDate();
    var date1Updated = new Date(noteTargetedDate.replace(/-/g, "/"));
    var date2Updated = new Date(today.replace(/-/g, "/"));
    return date1Updated > date2Updated;
  }
  handleNewNoteText(e) {
    this.setState({ newNoteText: e.target.value });
  }
  handleNewNoteDescription(e) {
    this.setState({ newNoteDescription: e.target.value });
  }
  handleNewNoteTargetedDate(e) {
    console.log("picked date", e.target.value);
    this.setState({ newNoteTargetedDate: e.target.value });
  }
  handleTaskToggle(e) {
    var noteId = e.currentTarget.parentNode.getAttribute("id");
    console.log("done called");
    NoteService.toggleTaskDone(noteId)
      .then((res) => {
        NoteService.getNotesByUser(this.props.history.location.state.user)
          .then((getRes) => {
            console.log("notelist", ...getRes.data);
            this.setState({ notesList: getRes.data });
          })
          .catch((err) => {
            this.serverErrorPopup("while fetching notes...");
          });
      })
      .catch((err) => {
        this.serverErrorPopup("while changing task status");
      });
  }
  addNote(e) {
    document.querySelector("#noteInputText").value = "";
    if (this.state.newNoteText.trim() === "") {
      this.setState({ popupText: "Cannot add an empty note" });
      this.setState({ newNoteText: "" });
      document.querySelector(".popup").style.display = "block";
      setTimeout(() => {
        document.querySelector(".popup").style.display = "none";
      }, 2000);
      return;
    }
    document.querySelector("#noteInputDescription").value = "";
    if (this.state.newNoteDescription.trim() === "") {
      this.setState({ popupText: "Cannot add note with empty description" });
      this.setState({ newNoteDescription: "" });
      document.querySelector(".popup").style.display = "block";
      setTimeout(() => {
        document.querySelector(".popup").style.display = "none";
      }, 2000);
      return;
    }
    const noteObj = {
      message: this.state.newNoteText,
      description: this.state.newNoteDescription,
      user: this.state.user,
      is_done: false,
      targeted_date: this.state.newNoteTargetedDate,
    };
    console.log("new Note obj", noteObj);
    NoteService.addNote(noteObj)
      .then((res) => {
        this.setState({ notesList: [...this.state.notesList, res.data] });
      })
      .catch((err) => {
        this.serverErrorPopup("while adding a note...");
      });
  }
  openFullNote(e) {
    var id = e.currentTarget.getAttribute("id");
    var message = e.currentTarget.getAttribute("message");
    var description = e.currentTarget.getAttribute("description");
    var targeted_date = e.currentTarget.getAttribute("targeted_date");
    var noteObj = {
      id,
      message,
      description,
      targeted_date,
      user: this.state.user,
    };
    this.props.history.push("/edit-note", noteObj);
  }
  handleDeleteClick(e) {
    var noteId = e.currentTarget.getAttribute("id");
    console.log("deletedNoteId", noteId);
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
      <div style={notesTableStyle.card}>
        <div style={notesTableStyle.header}>
          <h1 style={notesTableStyle.h1}>
            {this.props.history.location.state &&
              this.props.history.location.state.user.username}
            's Notes
          </h1>
          <button
            id="logoutBtn"
            style={notesTableStyle.logoutBtn}
            onClick={this.handleLogOutClick}
          >
            Logout
          </button>
        </div>

        <div style={notesTableStyle.AddNote}>
          <input
            id="noteInputText"
            style={notesTableStyle.input}
            type="text"
            placeholder="Write a new note message"
            onChange={this.handleNewNoteText}
          />
          <input
            id="noteInputDescription"
            style={notesTableStyle.input}
            type="text"
            placeholder="Write a new note description"
            onChange={this.handleNewNoteDescription}
          />
          <input
            id="noteInputTargetedDate"
            style={notesTableStyle.inputDate}
            type="date"
            name="targeted_date"
            value={this.state.newNoteTargetedDate}
            onChange={this.handleNewNoteTargetedDate}
          />
          <button
            id="addBtn"
            style={notesTableStyle.addBtn}
            onClick={this.addNote}
          >
            Add
          </button>
        </div>
        {this.state.notesList.map((note, noteSerialNumber) => {
          return (
            <div id={note.id} key={note.id} style={notesTableStyle.note}>
              <p style={notesTableStyle.id}>{noteSerialNumber + 1}.</p>
              <p
                style={
                  note.is_done
                    ? notesTableStyle.CrossMessage
                    : notesTableStyle.message
                }
              >
                {note.message}
              </p>
              <p
                style={
                  note.is_done
                    ? notesTableStyle.CrossDescription
                    : notesTableStyle.description
                }
              >
                {note.description}
              </p>
              <p
                style={
                  note.is_done
                    ? notesTableStyle.CrossDate
                    : notesTableStyle.date
                }
              >
                {note.targeted_date}
              </p>
              <button
                disabled
                style={
                  this.isTargetDateValid(note.targeted_date)
                    ? notesTableStyle.ExpiredButtonHide
                    : notesTableStyle.ExpiredButtonShow
                }
              >
                EXPIRED
              </button>
              <button
                onClick={this.handleTaskToggle}
                style={
                  note.is_done
                    ? notesTableStyle.DoneButtonHide
                    : notesTableStyle.DoneButtonShow
                }
              >
                Done
              </button>
              <button
                onClick={this.handleTaskToggle}
                style={
                  note.is_done
                    ? notesTableStyle.UndoButtonShow
                    : notesTableStyle.UndoButtonHide
                }
              >
                Undo
              </button>
              <button
                onClick={this.openFullNote}
                id={note.id}
                message={note.message}
                description={note.description}
                targeted_date={note.targeted_date}
                style={notesTableStyle.EditButton}
              >
                Edit
              </button>
              <button
                onClick={this.handleDeleteClick}
                id={note.id}
                style={notesTableStyle.DeleteButton}
              >
                Delete
              </button>
            </div>
          );
        })}

        <div className="popup" id="popup" style={notesTableStyle.popup}>
          <h2 style={notesTableStyle.popupText}>{this.state.popupText}</h2>
        </div>
      </div>
    );
  }
}
var notesTableStyle = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: "cyan",
    padding: "2rem",
    width: "1000px",
    height: "80%",
  },
  h1: {
    display: "inline-block",
    textAlign: "center",
    fontSize: "3rem",
  },
  message: {
    marginRight: "1rem",
  },
  CrossMessage: {
    marginRight: "1rem",
    textDecoration: "line-through",
    textDecorationThickness: "3px",
  },
  description: {
    color: "grey",
  },
  CrossDescription: {
    color: "grey",
    textDecoration: "line-through",
    textDecorationThickness: "3px",
  },
  date: {
    marginLeft: "1rem",
    color: "grey",
  },
  CrossDate: {
    marginLeft: "1rem",
    color: "grey",
    textDecoration: "line-through",
    textDecorationThickness: "3px",
  },
  AddNote: {
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
    backgroundColor: "grey",
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
    backgroundColor: "pink",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
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
    backgroundColor: "#c06cf0",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
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
    backgroundColor: "yellow",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
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
    backgroundColor: "#ff4336",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    marginLeft: "1rem",
    marginRight: "1rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  note: {
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
