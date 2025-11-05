import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();
  const session = Cookies.get('session');
  const [permissions, setPermissions] = useState([0, 0, 0, 0]);

  useEffect(() => {
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
      })
      .catch(error => {
        console.error("There was an error fetching the permissions!", error);
      });
  }, []);

  const handleLogout = () => {
    Cookies.remove('session');
    navigate('/auth');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Moon Adminpanel</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Moon Adminpanel Control</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              {session ? (
                <>
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Workspace
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/admin/response-dashboard">Response Dashboard</Link></li>
                      <li><Link className={`dropdown-item ${permissions[2] === 0 ? 'disabled' : ''}`} to="/admin/eventlog" title={permissions[2] === 0 ? 'Your role is not competent for this task, please contact the tech administrator if you have any issues.' : ''}>Event Logs</Link></li>
                      <li><Link className={`dropdown-item ${permissions[3] === 0 ? 'disabled' : ''}`} to="/admin/permissionsettings" title={permissions[3] === 0 ? 'Your role is not competent for this task, please contact the tech administrator if you have any issues.' : ''}>Permission Settings</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Settings
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/admin/profile">Profile</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" onClick={handleLogout}>Log out</button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}