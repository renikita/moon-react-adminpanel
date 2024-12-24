import React, { useEffect, useState } from "react";
import "./ViewResponse.css";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Modal, Button, Form } from 'react-bootstrap';

const GET_ALL_USERS_URL = 'http://localhost:8080/response/users';
const DELETE_USER_URL = 'http://localhost:8080/response/user/';
const UPDATE_USER_URL = 'http://localhost:8080/response/user/';
axios.defaults.withCredentials = true;

function ViewResponse() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    message_res: '',
    response_time: '',
    status: 0
  });

 

  useEffect(() => {
    axios.get(GET_ALL_USERS_URL)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleContextMenu = (event, user) => {
    event.preventDefault();
    setSelectedUser(user);
    const x = Math.min(event.clientX, window.innerWidth - 300); 
    const y = Math.min(event.clientY, window.innerHeight - 150);
    setContextMenu({
      x,
      y,
    });
  };

  const handleCloseContextMenu = () => setContextMenu(null);

  const handleDelete = (id) => {
    axios.delete(`${DELETE_USER_URL}${id}`)
      .then((response) => {
        console.log("Deleting: " + response.data);
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the user!", error);
      });
    handleCloseContextMenu();
  };

  const handleUpdateStatus = (status) => {
    const updatedUser = { ...selectedUser, status };
    axios.put(`${UPDATE_USER_URL}${selectedUser.id}`, updatedUser)
      .then((response) => {
        setUsers(users.map((user) => (user.id === selectedUser.id ? response.data : user)));
      })
      .catch((error) => {
        console.error("There was an error updating the user status!", error);
      });
    handleCloseContextMenu();
  };

  const handleEdit = () => {
    setFormData({
      name: selectedUser.name,
      email: selectedUser.email,
      number: selectedUser.number,
      message_res: selectedUser.message_res,
      response_time: new Date(selectedUser.response_time).toISOString().slice(0, 16), // Формат для input
      status: selectedUser.status
    });
    setShowModal(true);
    handleCloseContextMenu();
  };

  const handleModalClose = () => setShowModal(false);

  const handleModalSave = () => {
    const updatedUser = { ...selectedUser, ...formData };
    axios.put(`${UPDATE_USER_URL}${selectedUser.id}`, updatedUser)
      .then((response) => {
        setUsers(users.map((user) => (user.id === selectedUser.id ? response.data : user)));
      })
      .catch((error) => {
        console.error("There was an error updating the user!", error);
      });
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="badge text-bg-warning">In order</span>;
      case 2:
        return <span className="badge text-bg-success">Checked</span>;
      case 3:
        return <span className="badge text-bg-dark">Declined</span>;
        case 100:
          return <span className="badge text-bg-info rounded-pill">Admin response</span>;
          
      default:
        return <span className="badge text-bg-danger">Unchecked</span>;
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    
    <div className="view-response">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="user-table-container">
        <table className="user-table table  table-striped">
          <thead>
            <tr class="table-primary">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>Message</th>
              <th>Response Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan="7">
                    <div className="placeholder-glow">
                      <span className="placeholder col-12"></span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onContextMenu={(e) => handleContextMenu(e, user)}
                >
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.number}</td>
                  <td>{user.message_res}</td>
                  <td>{new Date(user.response_time).toLocaleString()}</td>
                  <td>{getStatusBadge(user.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={handleCloseContextMenu}
        >
          <button onClick={handleEdit}>
            Edit
          </button>
          <div className="dropdown">
            <button className="dropdown-toggle" data-bs-toggle="dropdown">
              Set Status
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={() => handleUpdateStatus(1)}>In order</button></li>
              <li><button className="dropdown-item" onClick={() => handleUpdateStatus(2)}>Checked</button></li>
              <li><button className="dropdown-item" onClick={() => handleUpdateStatus(3)}>Declined</button></li>
              <li><button className="dropdown-item" onClick={() => handleUpdateStatus(0)}>Unchecked</button></li>
            </ul>
          </div>
          <button onClick={() => handleDelete(selectedUser.id)}>Delete</button>
          
        </div>
      )}

      <Modal show={showModal} onHide={handleModalClose} scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label >Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label className="textLabel">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formNumber">
              <Form.Label className="textLabel">Number</Form.Label>
              <Form.Control
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label className="textLabel">Message</Form.Label>
              <Form.Control
                type="text"
                name="message_res"
                value={formData.message_res}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formResponseTime">
              <Form.Label className="textLabel">Response Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="response_time"
                value={formData.response_time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label className="textLabel">Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value={0}>Unchecked</option>
                <option value={1}>In order</option>
                <option value={2}>Checked</option>
                <option value={3}>Declined</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    
  );
}

export default ViewResponse;