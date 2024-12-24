import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Navbar from "./layout/Navbar";

import Authentication from "./components/Authentication"; 

import ResponseDashboard from "./components/ViewResponce"; 
import EventLog from "./components/EventLog"; 
import Profile from "./components/Profile";
import PermissionSettings from "./components/PermissionSettings";


const PrivateRoute = ({ children }) => {
  const session = Cookies.get('session');
  return session ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/auth" element={<Authentication />} /> 
            <Route exact path="/" element={<Authentication />} />
            <Route exact path="/admin/response-dashboard" element={<PrivateRoute><ResponseDashboard /></PrivateRoute>} />
            <Route exact path="/admin/eventlog" element={<PrivateRoute><EventLog /></PrivateRoute>} />
            <Route exact path="/admin/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route exact path="/admin/permissionsettings" element={<PrivateRoute><PermissionSettings /></PrivateRoute>} />
          </Routes>
       
        </Router>
    </div>
  );
}

export default App;
