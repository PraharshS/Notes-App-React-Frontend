import React, { Component } from "react";
import NoteService from "../services/NoteService";

export default class AllNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notesList: [],
      newNoteText: "",
      currentNoteId: "",
    };
    this.handleNewNoteText = this.handleNewNoteText.bind(this);
    this.addNote = this.addNote.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
    this.handleLogOutClick = this.handleLogOutClick.bind(this);
  }
  componentDidMount() {
    console.log("cdm called");
    document.querySelector("#addBtn").style.display = "block";
    document.querySelector("#updateBtn").style.display = "none";
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");
      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    this.setState({ user: this.props.history.location.state.user });
    NoteService.getNotesByUser(this.props.history.location.state.user).then(
      (res) => {
        this.setState({ notesList: res.data.notesData });
      }
    );
  }
  handleNewNoteText(e) {
    this.setState({ newNoteText: e.target.value });
  }
  addNote(e) {
    console.log(this.state.newNoteText);
    const noteObj = {
      message: this.state.newNoteText,
      user: this.state.user,
    };
    console.log(noteObj);
    NoteService.addNote(noteObj).then((res) => {
      console.log("new Note created", res.data);
      this.setState({ notesList: [...this.state.notesList, res.data] });
    });
  }
  handleEditClick(e) {
    var noteId = e.currentTarget.getAttribute("id");
    this.setState({ currentNoteId: noteId });
    var noteMessage = e.currentTarget.getAttribute("message");
    document.querySelector("#noteInput").value = noteMessage;
    document.querySelector("#addBtn").style.display = "none";
    document.querySelector("#updateBtn").style.display = "block";
    this.setState({ newNoteText: noteMessage });
  }
  handleUpdateClick(e) {
    const updatedNoteObj = {
      message: this.state.newNoteText,
      user: this.state.user,
    };
    NoteService.updateNote(this.state.currentNoteId, updatedNoteObj).then(
      (res) => {
        console.log("updated note", res.data);
        NoteService.getNotesByUser(this.props.history.location.state.user).then(
          (childRes) => {
            this.setState({ notesList: childRes.data.notesData });
          }
        );
        document.querySelector("#addBtn").style.display = "block";
        document.querySelector("#updateBtn").style.display = "none";
        document.querySelector("#noteInput").value = "";
      }
    );
  }
  handleDeleteClick(e) {
    var noteId = parseInt(e.currentTarget.getAttribute("id"));
    NoteService.deleteNote(noteId).then((res) => {
      this.setState({
        notesList: this.state.notesList.filter((note) => note.id !== noteId),
      });
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
          <button
            id="updateBtn"
            style={notesTableStyle.updateBtn}
            onClick={this.handleUpdateClick}
          >
            Update
          </button>
        </div>
        {this.state.notesList.map((note, noteSerialNumber) => {
          return (
            <div key={note.id} style={notesTableStyle.note}>
              <p style={notesTableStyle.id}>{noteSerialNumber + 1}.</p>
              <p>{note.message}</p>
              <button
                onClick={this.handleEditClick}
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
    backgroundColor: "teal",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
  },
  logoutBtn: {
    backgroundColor: "grey",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    marginLeft: "auto",
    height: "50px",
  },
  updateBtn: {
    backgroundColor: "orange",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
  },
  EditButton: {
    border: "2px solid black",
    backgroundColor: "yellow",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
    marginLeft: "auto",
  },
  DeleteButton: {
    border: "2px solid black",
    backgroundColor: "red",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
    marginLeft: "1rem",
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
};
