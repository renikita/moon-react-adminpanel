import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import "./PermissionSettings.css";
import { useNavigate } from "react-router-dom";

const GET_ROLES_URL = 'http://localhost:8080/adminpage/roles';
const GET_ADMINS_URL = 'http://localhost:8080/adminpage/admins';
const SAVE_ROLE_URL = 'http://localhost:8080/adminpage/role';
const DELETE_ROLE_URL = 'http://localhost:8080/adminpage/role/';
const CREATE_ADMIN_URL = 'http://localhost:8080/adminpage/admin';
const UPDATE_ADMIN_ROLE_URL = 'http://localhost:8080/adminpage/admin/';
const DELETE_ADMIN_URL = 'http://localhost:8080/adminpage/admin/';
const AUTH_URL = 'http://localhost:8080/adminpage/auth';
const GET_CURRENT_ADMIN_URL = 'http://localhost:8080/adminpage/currentadmin';
const GET_ADMIN_BY_ID_URL = 'http://localhost:8080/adminpage/admin/';

export default function PermissionSettings() {
  const [roles, setRoles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([0, 0, 0, 0]);
  const [newAdmin, setNewAdmin] = useState({ name: '', login: '', password: '', roleId: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(GET_ROLES_URL)
      .then(response => setRoles(response.data))
      .catch(error => console.error("There was an error fetching the roles!", error));

    axios.get(GET_ADMINS_URL)
      .then(response => setAdmins(response.data))
      .catch(error => console.error("There was an error fetching the admins!", error));

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
        if (response.data.permission[3] === 0) {
          navigate('/admin/response-dashboard');
        }
      })
      .catch(error => {
        console.error("There was an error fetching the permissions!", error);
      });
  }, [navigate]);

  const handleRoleChange = (role) => {
    if (role) {
      setSelectedRole(role);
      setRoleName(role.name);
      setPermissions(role.permission);
    } else {
      setSelectedRole(null);
      setRoleName('');
      setPermissions([0, 0, 0, 0]);
    }
  };

  const handlePermissionChange = (index, value) => {
    const newPermissions = [...permissions];
    newPermissions[index] = value;
    setPermissions(newPermissions);
  };
  
  const handleAdminRoleChange = (admin, roleId) => {
    const updatedAdmin = { ...admin, role: roles.find(r => r.id === roleId) };
    axios.put(`${UPDATE_ADMIN_ROLE_URL}${admin.id}`, {
      ...updatedAdmin
    })
    .then(() => {
      const updatedAdmins = admins.map(a => a.id === admin.id ? updatedAdmin : a);
      setAdmins(updatedAdmins);
      alert('Admin role updated successfully');
    })
    .catch(error => console.error("There was an error updating the admin's role!", error));
  };

  const handleSaveRole = () => {
    const role = { id: selectedRole ? selectedRole.id : null, name: roleName, permission: permissions };
    axios.post(SAVE_ROLE_URL, role)
      .then(response => {
        setRoles([...roles.filter(r => r.id !== response.data.id), response.data]);
        setSelectedRole(response.data);
        alert('Role saved successfully');
      })
      .catch(error => console.error("There was an error saving the role!", error));
  };

  const handleDeleteRole = (roleId) => {
    axios.delete(`${DELETE_ROLE_URL}${roleId}`)
      .then(() => {
        setRoles(roles.filter(role => role.id !== roleId));
        if (selectedRole && selectedRole.id === roleId) {
          setSelectedRole(null);
          setRoleName('');
          setPermissions([0, 0, 0, 0]);
        }
        alert('Role deleted successfully');
      })
      .catch(error => console.error("There was an error deleting the role!", error));
  };

  const handleCreateAdmin = () => {
    axios.post(CREATE_ADMIN_URL, {
      name: newAdmin.name,
      login: newAdmin.login,
      password: newAdmin.password,
      role: roles.find(role => role.id === parseInt(newAdmin.roleId))
    })
    .then(response => {
      setAdmins([...admins, response.data]);
      setNewAdmin({ name: '', login: '', password: '', roleId: '' });
      alert('Admin created successfully');
    })
    .catch(error => console.error("There was an error creating the admin!", error));
  };

  const handleDeleteAdmin = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setAdminToDelete(null);
    setPassword('');
  };

  const handleConfirmDelete = async () => {
    try {
        const currentAdminIdResponse = await axios.get(GET_CURRENT_ADMIN_URL, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        const currentAdminId = currentAdminIdResponse.data;

        const currentAdminResponse = await axios.get(`${GET_ADMIN_BY_ID_URL}${currentAdminId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        const currentAdminLogin = currentAdminResponse.data.login;

        const authResponse = await axios.post(AUTH_URL, {
            login: currentAdminLogin,
            password: password
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        if (authResponse.data) {
            await axios.delete(`${DELETE_ADMIN_URL}${adminToDelete.id}`, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            setAdmins(admins.filter(admin => admin.id !== adminToDelete.id));
            handleCloseDeleteModal();
            alert('Admin deleted successfully');
        } else {
            alert('Password incorrect');
        }
    } catch (error) {
        console.error("There was an error deleting the admin!", error);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header className="bg-secondary text-white">Role Management</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group controlId="formRoleSelect">
                    <Form.Label>Select Existing Role</Form.Label>
                    <Form.Control as="select" onChange={(e) => handleRoleChange(roles.find(role => role.id === parseInt(e.target.value)))} >
                      <option value="">Create New Role</option>
                      {Array.isArray(roles) && roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formRoleName" className="mt-3">
                    <Form.Label>Role Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>Permissions</Form.Label>
                    <ListGroup>
                      <ListGroup.Item>
                        <Form.Check
                          type="radio"
                          label="Edit response user"
                          checked={permissions[0] === 1}
                          onChange={() => handlePermissionChange(0, 1)}
                        />
                        <Form.Check
                          type="radio"
                          label="No access"
                          checked={permissions[0] === 0}
                          onChange={() => handlePermissionChange(0, 0)}
                        />
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Form.Check
                          type="radio"
                          label="Delete response user"
                          checked={permissions[1] === 1}
                          onChange={() => handlePermissionChange(1, 1)}
                        />
                        <Form.Check
                          type="radio"
                          label="No access"
                          checked={permissions[1] === 0}
                          onChange={() => handlePermissionChange(1, 0)}
                        />
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Form.Check
                          type="radio"
                          label="Check event logs"
                          checked={permissions[2] === 1}
                          onChange={() => handlePermissionChange(2, 1)}
                        />
                        <Form.Check
                          type="radio"
                          label="No access"
                          checked={permissions[2] === 0}
                          onChange={() => handlePermissionChange(2, 0)}
                        />
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Form.Check
                          type="radio"
                          label="Role and admin management"
                          checked={permissions[3] === 1}
                          onChange={() => handlePermissionChange(3, 1)}
                        />
                        <Form.Check
                          type="radio"
                          label="No access"
                          checked={permissions[3] === 0}
                          onChange={() => handlePermissionChange(3, 0)}
                        />
                      </ListGroup.Item>
                    </ListGroup>
                  </Form.Group>
                  <Button variant="primary" onClick={handleSaveRole} className="mt-3">Save Role</Button>
                  {selectedRole && (
                    <Button variant="danger" onClick={() => handleDeleteRole(selectedRole.id)} className="mt-3 ml-2">Delete Role</Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header className="bg-secondary text-white">Admin Management</Card.Header>
              <Card.Body>
                <ListGroup>
                  {admins.map(admin => (
                    <ListGroup.Item className="gapGroup" key={admin.id}>
                      {admin.name} {admin.login} {admin.role ? admin.role.name : 'No Role'}
                      <Form.Control as="select" className="float-right" onChange={(e) => handleAdminRoleChange(admin, parseInt(e.target.value))}>
                        <option value="">Select Role</option>
                        {Array.isArray(roles) && roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </Form.Control>
                      <Button variant="danger" className="float-right mr-2 btn-delete-admin" onClick={() => handleDeleteAdmin(admin)}>Delete</Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <hr></hr>
                <Form className="admin-form">
                  <Form.Group controlId="formAdminName">
                    <Form.Label className="formlabel">Admin Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formAdminLogin">
                    <Form.Label className="formlabel">Login Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newAdmin.login}
                      onChange={(e) => setNewAdmin({ ...newAdmin, login: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formAdminPassword">
                    <Form.Label className="formlabel">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formAdminRole">
                    <Form.Label className="formlabel">Role</Form.Label>
                    <Form.Control as="select" value={newAdmin.roleId} onChange={(e) => setNewAdmin({ ...newAdmin, roleId: e.target.value })}>
                      <option value="">Select Role</option>
                      {Array.isArray(roles) && roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Button variant="primary" onClick={handleCreateAdmin}>Create Admin</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {showDeleteModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this admin?</p>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
                <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
