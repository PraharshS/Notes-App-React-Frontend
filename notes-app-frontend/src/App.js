import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<LoginPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
