import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import { taskService } from '../services/taskService';
import { FaTasks, FaCheckCircle, FaSpinner, FaExclamationTriangle, FaChartLine, FaFolderOpen } from 'react-icons/fa';
import './Dashboard.css';
import './PageHeader.css';

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await taskService.getDashboard();
            setDashboard(response.data);
        } catch (err) {
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            todo: 'secondary',
            in_progress: 'primary',
            review: 'warning',
            completed: 'success'
        };
        return <Badge bg={variants[status]} className="modern-badge">{status.replace('_', ' ')}</Badge>;
    };

    const getProjectStatusBadge = (status) => {
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
        return <Badge bg={variants[status]} className="modern-badge">{labels[status]}</Badge>;
    };

    const getPriorityBadge = (priority) => {
        const variants = {
            low: 'info',
            medium: 'primary',
            high: 'warning',
            urgent: 'danger'
        };
        return <Badge bg={variants[priority]} className="modern-badge">{priority}</Badge>;
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner">
                <FaSpinner className="spinner-icon" />
                <p>Loading your dashboard...</p>
            </div>
        </div>
    );

    if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <div className="dashboard-page">
            <Container className="mt-4">
                <div className="page-header">
                    <div>
                        <h2 className="page-title">
                            <FaChartLine className="page-title-icon" />
                            Dashboard
                        </h2>
                        <p className="page-subtitle">Welcome back! Here's your overview</p>
                    </div>
                </div>
                
                {/* Statistics Cards */}
                <Row className="mb-4 g-4">
                    <Col md={6} lg={3}>
                        <div className="stat-card stat-card-total">
                            <div className="stat-icon-wrapper stat-icon-total">
                                <FaTasks />
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-number">{dashboard.stats.total_tasks}</h3>
                                <p className="stat-label">Total Tasks</p>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="stat-card stat-card-progress">
                            <div className="stat-icon-wrapper stat-icon-progress">
                                <FaSpinner />
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-number">{dashboard.stats.in_progress_tasks}</h3>
                                <p className="stat-label">In Progress</p>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="stat-card stat-card-completed">
                            <div className="stat-icon-wrapper stat-icon-completed">
                                <FaCheckCircle />
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-number">{dashboard.stats.completed_tasks}</h3>
                                <p className="stat-label">Completed</p>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="stat-card stat-card-overdue">
                            <div className="stat-icon-wrapper stat-icon-overdue">
                                <FaExclamationTriangle />
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-number">{dashboard.stats.overdue_tasks}</h3>
                                <p className="stat-label">Overdue</p>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                    </Col>
                </Row>

                {/* Overdue Tasks */}
                {dashboard.overdueTasks.length > 0 && (
                    <Card className="modern-card mb-4">
                        <Card.Header className="modern-card-header overdue-header">
                            <h5 className="mb-0">
                                <FaExclamationTriangle className="me-2" />
                                Overdue Tasks
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="modern-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Project</th>
                                            <th>Due Date</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.overdueTasks.map(task => (
                                            <tr key={task.id}>
                                                <td><strong>{task.title}</strong></td>
                                                <td>{task.project_name}</td>
                                                <td>{new Date(task.due_date).toLocaleDateString()}</td>
                                                <td>{getPriorityBadge(task.priority)}</td>
                                                <td>{getStatusBadge(task.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                )}

                {/* Recent Projects */}
                <Card className="modern-card mb-4">
                    <Card.Header className="modern-card-header">
                        <h5 className="mb-0">
                            <FaFolderOpen className="me-2" />
                            Recent Projects
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {dashboard.recentProjects && dashboard.recentProjects.length === 0 ? (
                            <div className="empty-state">
                                <FaFolderOpen className="empty-icon" />
                                <p>No projects yet. Create your first project to get started!</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="modern-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Project</th>
                                            <th>Status</th>
                                            <th>Members</th>
                                            <th>Tasks</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.recentProjects && dashboard.recentProjects.map(project => (
                                            <tr key={project.id}>
                                                <td>
                                                    <strong>{project.name}</strong>
                                                    {project.description && (
                                                        <div style={{ fontSize: '0.85em', marginTop: '4px', opacity: 0.7 }}>
                                                            {project.description.substring(0, 50)}{project.description.length > 50 ? '...' : ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>{getProjectStatusBadge(project.status)}</td>
                                                <td>👥 {project.member_count}</td>
                                                <td>📝 {project.task_count}</td>
                                                <td>{new Date(project.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Recent Tasks */}
                <Card className="modern-card">
                    <Card.Header className="modern-card-header">
                        <h5 className="mb-0">
                            <FaTasks className="me-2" />
                            Recent Tasks
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {dashboard.recentTasks.length === 0 ? (
                            <div className="empty-state">
                                <FaTasks className="empty-icon" />
                                <p>No tasks yet. Create your first task to get started!</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="modern-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Project</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.recentTasks.map(task => (
                                            <tr key={task.id}>
                                                <td><strong>{task.title}</strong></td>
                                                <td>{task.project_name}</td>
                                                <td>{getPriorityBadge(task.priority)}</td>
                                                <td>{getStatusBadge(task.status)}</td>
                                                <td>
                                                    {task.due_date 
                                                        ? new Date(task.due_date).toLocaleDateString()
                                                        : '-'
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Dashboard;
