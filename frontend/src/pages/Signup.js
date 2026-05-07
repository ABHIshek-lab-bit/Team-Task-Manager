import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { authService } from '../services/authService';
import { FaEnvelope, FaLock, FaUser, FaRocket, FaUserShield } from 'react-icons/fa';
import './Login.css';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'member'
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
            await authService.signup(formData);
            window.scrollTo(0, 0); // Scroll to top before navigation
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
                    <Col lg={6} md={8} sm={10}>
                        <Card className="login-card animate-slide-in">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <div className="login-icon-wrapper">
                                        <FaRocket className="login-icon" />
                                    </div>
                                    <h2 className="login-title">Create Account</h2>
                                    <p className="login-subtitle">Join TaskFlow and boost your productivity</p>
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
                                                <FaUser />
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                placeholder="Enter your name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="modern-input"
                                            />
                                        </div>
                                    </Form.Group>

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
                                                placeholder="Create a password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                minLength={6}
                                                className="modern-input"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <div className="input-group-modern">
                                            <div className="input-icon">
                                                <FaUserShield />
                                            </div>
                                            <Form.Select
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                className="modern-input"
                                                style={{ color: '#0f172a' }}
                                            >
                                                <option value="member" style={{ color: '#0f172a' }}>Member</option>
                                                <option value="admin" style={{ color: '#0f172a' }}>Admin</option>
                                            </Form.Select>
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
                                                Creating account...
                                            </>
                                        ) : (
                                            <>
                                                <FaRocket className="me-2" />
                                                Sign Up
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                <div className="text-center mt-4">
                                    <p className="signup-text">
                                        Already have an account? 
                                        <Link to="/login" className="signup-link"> Login</Link>
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

export default Signup;
