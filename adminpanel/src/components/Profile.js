import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Modal, Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import "./Profile.css";

const GET_ADMIN_URL = 'http://localhost:8080/adminpage/admin/';
const UPDATE_ADMIN_URL = 'http://localhost:8080/adminpage/admin/';
const DELETE_ADMIN_URL = 'http://localhost:8080/adminpage/admin/';
const GET_CURRENT_ADMIN_URL = 'http://localhost:8080/adminpage/currentadmin';

export default function Profile() {
  const [admin, setAdmin] = useState({});
  const [login, setLogin] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {

    axios.get(GET_CURRENT_ADMIN_URL, { withCredentials: true })
      .then(response => {
        const userId = response.data;
        if (userId) {
          axios.get(`${GET_ADMIN_URL}${userId}`, { withCredentials: true })
            .then(response => {
              setAdmin(response.data);
              setLogin(response.data.login);
              setRole(response.data.role.name);
            })
            .catch(error => {
              console.error("There was an error fetching the admin profile!", error);
            });
        }
      })
      .catch(error => {
        console.error("There was an error fetching the current admin ID!", error);
      });
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.get(GET_CURRENT_ADMIN_URL, { withCredentials: true })
      .then(response => {
        const userId = response.data;
        axios.put(`${UPDATE_ADMIN_URL}${userId}`, { login, name , password }, { withCredentials: true })
          .then(response => {
            setAdmin(response.data);
            setMessage('Profile updated successfully');
            setShowLoginModal(false);
            setShowNameModal(false);
            setShowPasswordModal(false);
          })
          .catch(error => {
            console.error("There was an error updating the admin profile!", error);
            setMessage('Error updating profile');
          });
      })
      .catch(error => {
        console.error("There was an error fetching the current admin ID!", error);
      });
  };

  const handleDelete = () => {
    axios.get(GET_CURRENT_ADMIN_URL, { withCredentials: true })
      .then(response => {
        const userId = response.data;
        axios.delete(`${DELETE_ADMIN_URL}${userId}`, { withCredentials: true })
          .then(response => {
            setMessage('Account deleted successfully');
            setShowDeleteModal(false);
            Cookies.remove('session');
            window.location.href = '/auth';
          })
          .catch(error => {
            console.error("There was an error deleting the admin account!", error);
            setMessage('Error deleting account');
          });
      })
      .catch(error => {
        console.error("There was an error fetching the current admin ID!", error);
      });
  };

  const handleShowNameModal = () => {
    setName(admin.name); 
    setShowNameModal(true);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="profile-card shadow-sm card text-bg-light">
            <Card.Header className="text-center bg-secondary text-white">
              <h4>Admin Profile</h4>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Login:</strong> {admin.login}
                <Button variant="link" className="text-primary showloginlink p-0 ml-2 float-right" onClick={() => setShowLoginModal(true)}>Edit</Button>
              </Card.Text>
              <Card.Text>
                <strong>Name:</strong> {admin.name}
                <Button variant="link" className="text-primary showNamelink p-0 ml-2 float-right" onClick={handleShowNameModal}>Edit</Button>
              </Card.Text>
              <Card.Text>
                <strong>Role:</strong> {role}
              </Card.Text>
              <Card.Text className="text-end">
                <Button variant="outline-primary" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
              </Card.Text>
              <hr />
              <Card.Text>
                <strong>Permissions:</strong>
                <ul>
                  <li>Edit response user</li>
                  <li>Delete response user</li>
                  <li>Check event logs</li>
                  <li>Create admins</li>
                </ul>
              </Card.Text>
              <hr />
              <Card.Text className="text-center">
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete Account</Button>
              </Card.Text>
            </Card.Body>
          </Card>
          {message && <p className="text-center mt-3 text-success">{message}</p>}
        </Col>
      </Row>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formLogin">
              <Form.Label>Login</Form.Label>
              <Form.Control
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showNameModal} onHide={() => setShowNameModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account?</p>
          <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="ml-2">Cancel</Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
