import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, ListGroup } from 'react-bootstrap';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import { FaFolderOpen, FaPlus, FaUsers, FaUserPlus, FaTimes, FaCrown, FaUser, FaChevronDown } from 'react-icons/fa';
import './PageHeader.css';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [statusFormData, setStatusFormData] = useState({
        status: 'active'
    });
    const [memberFormData, setMemberFormData] = useState({
        user_id: '',
        role: 'member'
    });
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    useEffect(() => {
        fetchProjects();
        if (isAdmin) {
            fetchAllUsers();
        }
    }, [isAdmin]);

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAllProjects();
            setProjects(response.data);
        } catch (err) {
            setError('Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await authService.getAllUsers();
            setAllUsers(response.data);
        } catch (err) {
            console.error('Failed to load users');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await projectService.createProject(formData);
            setShowModal(false);
            setFormData({ name: '', description: '' });
            fetchProjects();
        } catch (err) {
            setError('Failed to create project.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.deleteProject(id);
                fetchProjects();
            } catch (err) {
                setError('Failed to delete project.');
            }
        }
    };

    const handleManageMembers = async (project) => {
        try {
            const response = await projectService.getProject(project.id);
            setSelectedProject(response.data);
            setShowMembersModal(true);
        } catch (err) {
            setError('Failed to load project members.');
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await projectService.addMember(selectedProject.id, memberFormData);
            setMemberFormData({ user_id: '', role: 'member' });
            // Refresh project members
            const response = await projectService.getProject(selectedProject.id);
            setSelectedProject(response.data);
            fetchProjects(); // Refresh project list to update member count
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add member.');
        }
    };

    const handleRemoveMember = async (userId) => {
        if (window.confirm('Are you sure you want to remove this member?')) {
            try {
                await projectService.removeMember(selectedProject.id, userId);
                // Refresh project members
                const response = await projectService.getProject(selectedProject.id);
                setSelectedProject(response.data);
                fetchProjects(); // Refresh project list to update member count
            } catch (err) {
                setError('Failed to remove member.');
            }
        }
    };

    const handleChangeStatus = (project) => {
        setSelectedProject(project);
        setStatusFormData({ status: project.status });
        setShowStatusModal(true);
    };

    const handleStatusSubmit = async (e) => {
        e.preventDefault();
        try {
            await projectService.updateProject(selectedProject.id, {
                ...selectedProject,
                status: statusFormData.status
            });
            setShowStatusModal(false);
            fetchProjects();
        } catch (err) {
            setError('Failed to update project status.');
        }
    };

    const getStatusBadge = (status, isClickable = false) => {
        const variants = {
            active: 'success',
            completed: 'primary',
            on_hold: 'warning',
            archived: 'secondary'
        };
        const labels = {
            active: 'Active',
            completed: 'Completed',
            on_hold: 'On Hold',
            archived: 'Archived'
        };
        return (
            <Badge 
                bg={variants[status]} 
                className={isClickable ? 'd-flex align-items-center gap-1 status-badge-clickable' : ''}
                style={isClickable ? { fontSize: '0.85rem', padding: '0.4rem 0.7rem' } : {}}
            >
                {labels[status]}
                {isClickable && <FaChevronDown size={10} />}
            </Badge>
        );
    };

    const getAvailableUsers = () => {
        if (!selectedProject || !selectedProject.members) return [];
        const memberIds = selectedProject.members.map(m => m.id);
        return allUsers.filter(user => !memberIds.includes(user.id));
    };

    if (loading) return <Container className="mt-4"><Alert variant="info">Loading...</Alert></Container>;

    return (
        <Container className="mt-4">
            <div className="page-header d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="page-title">
                        <FaFolderOpen className="page-title-icon" />
                        Projects
                        {isAdmin && (
                            <Badge bg="warning" text="dark" className="ms-2" style={{ fontSize: '0.6em', verticalAlign: 'middle' }}>
                                <FaCrown className="me-1" />
                                Admin
                            </Badge>
                        )}
                    </h2>
                    <p className="page-subtitle">
                        {isAdmin 
                            ? 'Create and manage projects, assign team members' 
                            : 'View projects you are a member of'}
                    </p>
                </div>
                {isAdmin && (
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        <FaPlus className="me-2" />
                        New Project
                    </Button>
                )}
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            {!isAdmin && (
                <Alert variant="info" className="mb-4">
                    <FaUser className="me-2" />
                    You are logged in as a <strong>Member</strong>. Only Admins can create projects and manage teams.
                </Alert>
            )}

            <Row>
                {projects.length === 0 ? (
                    <Col>
                        <Alert variant="info">
                            {isAdmin 
                                ? 'No projects yet. Create your first project!' 
                                : 'No projects assigned to you yet. Contact an admin to be added to a project.'}
                        </Alert>
                    </Col>
                ) : (
                    projects.map(project => (
                        <Col md={6} lg={4} key={project.id} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <Card.Title>{project.name}</Card.Title>
                                        <div 
                                            onClick={() => isAdmin && handleChangeStatus(project)}
                                            style={{ 
                                                cursor: isAdmin ? 'pointer' : 'default',
                                                userSelect: 'none'
                                            }}
                                            title={isAdmin ? 'Click to change project status' : ''}
                                        >
                                            {getStatusBadge(project.status, isAdmin)}
                                        </div>
                                    </div>
                                    <Card.Text className="text-muted">
                                        {project.description || 'No description'}
                                    </Card.Text>
                                    <div className="mb-3">
                                        <small className="text-muted">
                                            👥 {project.member_count} members • 
                                            📝 {project.task_count} tasks
                                        </small>
                                    </div>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {isAdmin && (
                                            <>
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm"
                                                    onClick={() => handleManageMembers(project)}
                                                >
                                                    <FaUsers className="me-1" />
                                                    Team
                                                </Button>
                                                {project.owner_id === currentUser.id && (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => handleDelete(project.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {/* Create Project Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                Create
                            </Button>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Manage Members Modal */}
            <Modal show={showMembersModal} onHide={() => setShowMembersModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaUsers className="me-2" />
                        Manage Team - {selectedProject?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Add Member Form */}
                    <Card className="mb-4">
                        <Card.Header>
                            <FaUserPlus className="me-2" />
                            Add Team Member
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleAddMember}>
                                <Row>
                                    <Col md={7}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Select User</Form.Label>
                                            <Form.Select
                                                value={memberFormData.user_id}
                                                onChange={(e) => setMemberFormData({...memberFormData, user_id: e.target.value})}
                                                required
                                            >
                                                <option value="">Choose a user...</option>
                                                {getAvailableUsers().map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} ({user.email}) - {user.role}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Role</Form.Label>
                                            <Form.Select
                                                value={memberFormData.role}
                                                onChange={(e) => setMemberFormData({...memberFormData, role: e.target.value})}
                                            >
                                                <option value="member">Member</option>
                                                <option value="admin">Admin</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2} className="d-flex align-items-end">
                                        <Button variant="primary" type="submit" className="mb-3 w-100">
                                            Add
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Current Members List */}
                    <Card>
                        <Card.Header>
                            Current Team Members ({selectedProject?.members?.length || 0})
                        </Card.Header>
                        <Card.Body>
                            {selectedProject?.members?.length === 0 ? (
                                <Alert variant="info">No members yet. Add team members above.</Alert>
                            ) : (
                                <ListGroup>
                                    {selectedProject?.members?.map(member => (
                                        <ListGroup.Item 
                                            key={member.id}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <div>
                                                <strong>{member.name}</strong>
                                                <div className="text-muted small">{member.email}</div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Badge bg={member.role === 'admin' ? 'warning' : 'secondary'}>
                                                    {member.role}
                                                </Badge>
                                                {member.id !== selectedProject.owner_id && (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => handleRemoveMember(member.id)}
                                                    >
                                                        <FaTimes />
                                                    </Button>
                                                )}
                                                {member.id === selectedProject.owner_id && (
                                                    <Badge bg="info">Owner</Badge>
                                                )}
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            {/* Change Project Status Modal */}
            <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Project Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleStatusSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Project: <strong>{selectedProject?.name}</strong></Form.Label>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={statusFormData.status}
                                onChange={(e) => setStatusFormData({status: e.target.value})}
                                required
                            >
                                <option value="active">Active - Project is ongoing</option>
                                <option value="completed">Completed - Project is finished</option>
                                <option value="on_hold">On Hold - Paused/Delayed</option>
                                <option value="archived">Archived - Not important right now</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Change the project status to track its current state
                            </Form.Text>
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                Update Status
                            </Button>
                            <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default Projects;
