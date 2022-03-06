import React, { Component } from "react";
import NoteService from "../services/NoteService";

export default class AllNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notesList: [],
      newNoteText: "",
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleNewNoteText = this.handleNewNoteText.bind(this);
    this.addNote = this.addNote.bind(this);
  }
  componentDidMount() {
    console.log("cdm called");
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
  handleDeleteClick(e) {
    var noteId = parseInt(e.currentTarget.getAttribute("id"));
    NoteService.deleteNote(noteId).then((res) => {
      this.setState({
        notesList: this.state.notesList.filter((note) => note.id !== noteId),
      });
    });
  }
  render() {
    return (
      <div style={notesTableStyle.card}>
        <h1 style={notesTableStyle.h1}>Your Notes</h1>
        <div style={notesTableStyle.AddNote}>
          <input
            style={notesTableStyle.input}
            type="text"
            placeholder="Write a new note..."
            onChange={this.handleNewNoteText}
          />
          <button style={notesTableStyle.button} onClick={this.addNote}>
            Add
          </button>
        </div>
        {this.state.notesList.map((note) => {
          return (
            <div key={note.id} style={notesTableStyle.note}>
              <p style={notesTableStyle.id}>{note.id}</p>
              <p>{note.message}</p>
              <button style={notesTableStyle.EditButton}>Edit</button>
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
  card: {
    backgroundColor: "cyan",
    padding: "2rem",
    width: "600px",
  },
  h1: {
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
  button: {
    backgroundColor: "teal",
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
