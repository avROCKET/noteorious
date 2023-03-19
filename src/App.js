import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Login from './pages/Login';
import Home from './pages/Home';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
