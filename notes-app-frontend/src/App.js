import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />}></Route>
        <Route path="/login" exact element={<LoginPage />}></Route>
        <Route path="/signup" exact element={<SignUpPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
