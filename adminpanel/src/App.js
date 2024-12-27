import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"; 
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Navbar from "./layout/Navbar";
import axios from 'axios';
import { useState, useEffect } from 'react';

import Authentication from "./components/Authentication"; 

import ResponseDashboard from "./components/ViewResponce"; 
import EventLog from "./components/EventLog"; 
import Profile from "./components/Profile";
import PermissionSettings from "./components/PermissionSettings";


const PrivateRoute = ({ children, permissionIndex }) => {
  const session = Cookies.get('session');
  const [permissions, setPermissions] = useState([0, 0, 0, 0]);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      axios.get('http://localhost:8080/adminpage/currentadmin', { withCredentials: true })
        .then(response => {
          const adminId = response.data;
          return axios.get(`http://localhost:8080/adminpage/admin/${adminId}`, { withCredentials: true });
        })
        .then(response => {
          const roleId = response.data.role.id;
          return axios.get(`http://localhost:8080/adminpage/role/${roleId}`, { withCredentials: true });
        })
        .then(response => {
          setPermissions(response.data.permission);
          if (response.data.permission[permissionIndex] === 0) {
            navigate('/admin/response-dashboard');
          }
        })
        .catch(error => {
          console.error("There was an error fetching the permissions!", error);
        });
    }
  }, [session, navigate, permissionIndex]);

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
            <Route exact path="/admin/response-dashboard" element={<PrivateRoute permissionIndex={0}><ResponseDashboard /></PrivateRoute>} />
            <Route exact path="/admin/eventlog" element={<PrivateRoute permissionIndex={2}><EventLog /></PrivateRoute>} />
            <Route exact path="/admin/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route exact path="/admin/permissionsettings" element={<PrivateRoute permissionIndex={3}><PermissionSettings /></PrivateRoute>} />
          </Routes>
       
        </Router>
    </div>
  );
}

export default App;
