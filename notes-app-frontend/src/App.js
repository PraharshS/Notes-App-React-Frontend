import { BrowserRouter as Switch, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import AllNotes from "./components/AllNotes";
function App() {
  return (
    <Switch>
      <Route path="/" exact component={HomePage}></Route>
      <Route path="/login" exact component={LoginPage}></Route>
      <Route path="/signup" exact component={SignUpPage}></Route>
      <Route path="/notes" exact component={AllNotes}></Route>
    </Switch>
  );
}

export default App;
