import React, { Component } from "react";
import NoteService from "../services/NoteService";

export default class AllNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notesList: [],
    };
    this.fetchNotes = this.fetchNotes.bind(this);
  }
  componentDidMount() {
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");
      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    this.setState({ user: this.props.history.location.state.user });
    NoteService.getNotesByUser(this.props.history.location.state.user).then(
      (res) => {
        console.log(res.data);
      }
    );
  }
  fetchNotes() {
    NoteService.getNotesByUser(this.props.history.location.state.user).then(
      (res) => {
        // this.setState({ notesList: res.data.notesData });
      }
    );
  }
  render() {
    return (
      <div>
        <h1>Your Notes</h1>
        {this.fetchNotes()}
        {console.log("state", this.state)}
        {this.state.notesList.map((note) => {
          return <div key={note.id}>{note.message}</div>;
        })}
      </div>
    );
  }
}
