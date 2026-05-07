import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Table } from 'react-bootstrap';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import { FaTasks, FaPlus, FaCrown, FaUser } from 'react-icons/fa';
import './PageHeader.css';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project_id: '',
        assigned_to: '',
        status: 'todo',
        priority: 'medium',
        due_date: ''
    });
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getAllTasks();
            setTasks(response.data);
        } catch (err) {
            setError('Failed to load tasks.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAllProjects();
            setProjects(response.data);
        } catch (err) {
            console.error('Failed to load projects');
        }
    };

    const handleProjectChange = async (projectId) => {
        setFormData({...formData, project_id: projectId, assigned_to: ''});
        
        if (projectId) {
            try {
                const response = await projectService.getProject(projectId);
                setProjectMembers(response.data.members || []);
            } catch (err) {
                console.error('Failed to load project members:', err);
                setProjectMembers([]);
            }
        } else {
            setProjectMembers([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await taskService.createTask(formData);
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                project_id: '',
                assigned_to: '',
                status: 'todo',
                priority: 'medium',
                due_date: ''
            });
            setProjectMembers([]);
            fetchTasks();
        } catch (err) {
            setError('Failed to create task.');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            await taskService.updateTask(taskId, { ...task, status: newStatus });
            fetchTasks();
        } catch (err) {
            setError('Failed to update task status.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (err) {
                setError('Failed to delete task.');
            }
        }
    };

    const getPriorityBadge = (priority) => {
        const variants = {
            low: 'info',
            medium: 'primary',
            high: 'warning',
            urgent: 'danger'
        };
        return <Badge bg={variants[priority]}>{priority}</Badge>;
    };

    if (loading) return <Container className="mt-4"><Alert variant="info">Loading...</Alert></Container>;

    return (
        <Container className="mt-4">
            <div className="page-header d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="page-title">
                        <FaTasks className="page-title-icon" />
                        Tasks
                        {isAdmin && (
                            <Badge bg="warning" text="dark" className="ms-2" style={{ fontSize: '0.6em', verticalAlign: 'middle' }}>
                                <FaCrown className="me-1" />
                                Admin
                            </Badge>
                        )}
                    </h2>
                    <p className="page-subtitle">
                        {isAdmin 
                            ? 'Create tasks and assign them to team members' 
                            : 'View and manage your assigned tasks'}
                    </p>
                </div>
                {isAdmin && (
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        <FaPlus className="me-2" />
                        New Task
                    </Button>
                )}
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            {!isAdmin && (
                <Alert variant="info" className="mb-4">
                    <FaUser className="me-2" />
                    You are logged in as a <strong>Member</strong>. You can only update and manage tasks that are assigned to you.
                </Alert>
            )}

            <Card>
                <Card.Body>
                    {tasks.length === 0 ? (
                        <Alert variant="info">No tasks yet. Create your first task!</Alert>
                    ) : (
                        <Table responsive hover style={{ color: 'var(--color-text, #1e293b)' }}>
                            <thead style={{ backgroundColor: 'var(--color-cardBg, #f8fafc)', color: 'var(--color-text, #1e293b)' }}>
                                <tr>
                                    <th style={{ color: 'var(--color-text, #1e293b)', fontWeight: '600' }}>Task</th>
                                    <th style={{ color: 'var(--color-text, #1e293b)', fontWeight: '600' }}>Project</th>
                                    <th style={{ color: 'var(--color-text, #1e293b)', fontWeight: '600' }}>Assigned To</th>
                                    <th style={{ color: 'var(--color-text, #1e293b)', fontWeight: '600' }}>Priority</th>
                                    <th style={{ color: 'var(--color-text, #1e293b)', fontWeight: '600' }}>Status</th>
                                    <th style={{ color: 'var(--color-text, #1e293b)', fontWeight: '600' }}>Due Date</th>
                                    <th style={{ color: 'var(--color-text, #1e293b)', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task.id} style={{ color: 'var(--color-text, #1e293b)' }}>
                                        <td style={{ color: 'var(--color-text, #1e293b)' }}>
                                            <strong style={{ color: 'var(--color-text, #1e293b)' }}>{task.title}</strong>
                                            {task.description && (
                                                <div className="text-muted small" style={{ color: 'var(--color-textMuted, #64748b)' }}>{task.description}</div>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--color-text, #1e293b)' }}>{task.project_name}</td>
                                        <td style={{ color: 'var(--color-text, #1e293b)' }}>
                                            {task.assigned_to_name ? (
                                                <span>
                                                    <FaUser className="me-1" style={{ color: 'var(--color-textMuted, #64748b)' }} />
                                                    {task.assigned_to_name}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--color-textMuted, #64748b)' }}>Unassigned</span>
                                            )}
                                        </td>
                                        <td>{getPriorityBadge(task.priority)}</td>
                                        <td>
                                            {/* Admin can update any task, Member can only update their own assigned tasks */}
                                            {isAdmin || task.assigned_to === currentUser.id ? (
                                                <Form.Select
                                                    size="sm"
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    style={{ width: 'auto', color: '#1e293b', backgroundColor: '#fff' }}
                                                >
                                                    <option value="todo">To Do</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="review">Review</option>
                                                    <option value="completed">Completed</option>
                                                </Form.Select>
                                            ) : (
                                                <Badge bg="secondary">{task.status.replace('_', ' ')}</Badge>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--color-text, #1e293b)' }}>
                                            {task.due_date 
                                                ? new Date(task.due_date).toLocaleDateString()
                                                : '-'
                                            }
                                        </td>
                                        <td>
                                            {/* Admin can delete any task, Member can only delete their own assigned tasks */}
                                            {isAdmin || task.assigned_to === currentUser.id ? (
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(task.id)}
                                                >
                                                    Delete
                                                </Button>
                                            ) : (
                                                <Badge bg="secondary" style={{ opacity: 0.5 }}>
                                                    No Access
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Create Task Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                        <Form.Group className="mb-3">
                            <Form.Label>Project</Form.Label>
                            <Form.Select
                                value={formData.project_id}
                                onChange={(e) => handleProjectChange(e.target.value)}
                                required
                            >
                                <option value="">Select Project</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        
                        {/* Assign To - Only show if Admin and project is selected */}
                        {isAdmin && formData.project_id && (
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Assign To
                                    <Badge bg="warning" text="dark" className="ms-2" style={{ fontSize: '0.7em' }}>
                                        Admin Only
                                    </Badge>
                                </Form.Label>
                                <Form.Select
                                    value={formData.assigned_to}
                                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                                >
                                    <option value="">Unassigned</option>
                                    {projectMembers.length > 0 ? (
                                        projectMembers.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.name} ({member.email}) - {member.role}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No team members in this project</option>
                                    )}
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    {projectMembers.length > 0 
                                        ? `Assign to any team member (Admin or Member) in this project (${projectMembers.length} members available)`
                                        : '⚠️ No team members found. Go to Projects → Team to add members first.'}
                                </Form.Text>
                            </Form.Group>
                        )}

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Priority</Form.Label>
                                    <Form.Select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="completed">Completed</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
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
        </Container>
    );
}

export default Tasks;
