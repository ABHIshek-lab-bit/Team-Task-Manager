import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { authService } from '../services/authService';
import { FaEnvelope, FaLock, FaRocket, FaCheckCircle, FaUsers, FaTasks } from 'react-icons/fa';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(formData);
            window.scrollTo(0, 0); // Scroll to top before navigation
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Animated Background Elements */}
            <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>

            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    {/* Left Side - Branding */}
                    <Col lg={6} className="d-none d-lg-block">
                        <div className="branding-section animate-fade-in">
                            <div className="logo-container">
                                <FaRocket className="logo-icon" />
                            </div>
                            <h1 className="brand-title">
                                Welcome to <span className="gradient-text">TaskFlow</span>
                            </h1>
                            <p className="brand-subtitle">
                                Manage your projects and tasks with style
                            </p>
                            
                            <div className="features-list">
                                <div className="feature-item">
                                    <FaCheckCircle className="feature-icon" />
                                    <span>Powerful Project Management</span>
                                </div>
                                <div className="feature-item">
                                    <FaUsers className="feature-icon" />
                                    <span>Team Collaboration</span>
                                </div>
                                <div className="feature-item">
                                    <FaTasks className="feature-icon" />
                                    <span>Task Tracking & Analytics</span>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Side - Login Form */}
                    <Col lg={5} md={8} sm={10}>
                        <Card className="login-card animate-slide-in">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <div className="login-icon-wrapper">
                                        <FaRocket className="login-icon" />
                                    </div>
                                    <h2 className="login-title">Welcome Back!</h2>
                                    <p className="login-subtitle">Login to continue to TaskFlow</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="modern-alert">
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <div className="input-group-modern">
                                            <div className="input-icon">
                                                <FaEnvelope />
                                            </div>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="modern-input"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <div className="input-group-modern">
                                            <div className="input-icon">
                                                <FaLock />
                                            </div>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="modern-input"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        className="w-100 modern-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Logging in...
                                            </>
                                        ) : (
                                            <>
                                                <FaRocket className="me-2" />
                                                Login
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                <div className="text-center mt-4">
                                    <p className="signup-text">
                                        Don't have an account? 
                                        <Link to="/signup" className="signup-link"> Sign up</Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
