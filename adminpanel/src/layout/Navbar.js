import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export default function Navbar() {
  const navigate = useNavigate();
  const session = Cookies.get('session');

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
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Workspace
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/admin/response-dashboard">Response Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/admin/eventlog">Event Log</Link></li>
                  <li><Link className="dropdown-item" to="/admin/permissionsettings">Permissions Settings</Link></li>
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
              {session ? (
                <li className="nav-item">
                  <button className="nav-link" onClick={handleLogout}>Log out</button>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/auth">Log in</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}