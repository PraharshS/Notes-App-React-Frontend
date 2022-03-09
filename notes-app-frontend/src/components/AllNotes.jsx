import React, { Component } from "react";
import NoteService from "../services/NoteService";

export default class AllNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notesList: [],
      newNoteText: "",
      currentNoteId: "",
      popupText: "",
    };
    this.handleNewNoteText = this.handleNewNoteText.bind(this);
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
        this.setState({ notesList: res.data.notesData });
      })
      .catch((err) => {
        this.serverErrorPopup("while fetching notes...");
      });
  }
  handleNewNoteText(e) {
    this.setState({ newNoteText: e.target.value });
  }
  addNote(e) {
    document.querySelector("#noteInput").value = "";
    if (this.state.newNoteText.trim() === "") {
      this.setState({ popupText: "Cannot add an empty note" });
      this.setState({ newNoteText: "" });
      document.querySelector(".popup").style.display = "block";
      setTimeout(() => {
        document.querySelector(".popup").style.display = "none";
      }, 2000);
      return;
    }
    const noteObj = {
      message: this.state.newNoteText,
      user: this.state.user,
    };

    NoteService.addNote(noteObj)
      .then((res) => {
        this.setState({ notesList: [...this.state.notesList, res.data] });
      })
      .catch((err) => {
        this.serverErrorPopup("while adding a note...");
      });
  }
  openFullNote(e) {
    var id = parseInt(e.currentTarget.getAttribute("id"));
    this.setState({ currentNoteId: id });
    var message = e.currentTarget.getAttribute("message");
    this.setState({ newNoteText: message });
    var noteObj = { id, message, user: this.state.user };
    this.props.history.push("/edit-note", noteObj);
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
            id="noteInput"
            style={notesTableStyle.input}
            type="text"
            placeholder="Write a new note..."
            onChange={this.handleNewNoteText}
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
            <div key={note.id} style={notesTableStyle.note}>
              <p style={notesTableStyle.id}>{noteSerialNumber + 1}.</p>
              <p>{note.message}</p>
              <button
                onClick={this.openFullNote}
                id={note.id}
                message={note.message}
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
    width: "600px",
  },
  h1: {
    display: "inline-block",
    textAlign: "center",
    fontSize: "3rem",
  },
  AddNote: {
    display: "flex",
    justifyContent: "center",
  },
  input: {
    width: "600px",
    padding: "1rem 1.5rem",
    fontSize: "1.2rem",
    marginRight: "1rem",
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
    marginLeft: "auto",
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
