import { BrowserRouter as Switch, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import AllTasks from "./components/AllTasks";
import Unauthorized from "./components/Unauthorized";
import SingleTask from "./components/SingleTask";
function App() {
  return (
    <Switch>
      <Route path="/" exact component={HomePage}></Route>
      <Route path="/login" exact component={LoginPage}></Route>
      <Route path="/signup" exact component={SignUpPage}></Route>
      <Route path="/tasks" exact component={AllTasks}></Route>
      <Route path="/edit-task" exact component={SingleTask}></Route>
      <Route path="/unauthorized" exact component={Unauthorized}></Route>
    </Switch>
  );
}

export default App;
