import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { authService } from '../services/authService';
import { FaSun, FaMoon, FaRocket, FaChartLine, FaFolderOpen, FaTasks, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useTheme } from '../ThemeContext';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <BSNavbar className="modern-navbar" expand="lg">
            <Container>
                <BSNavbar.Brand as={Link} to="/" className="brand-logo">
                    <div className="logo-wrapper">
                        <FaRocket className="logo-icon" />
                        <span className="logo-text">TaskFlow</span>
                    </div>
                </BSNavbar.Brand>
                
                <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
                
                <BSNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto nav-links">
                        <Nav.Link as={Link} to="/dashboard" className="nav-link-modern">
                            <FaChartLine className="nav-icon" />
                            <span>Dashboard</span>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/projects" className="nav-link-modern">
                            <FaFolderOpen className="nav-icon" />
                            <span>Projects</span>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/tasks" className="nav-link-modern">
                            <FaTasks className="nav-icon" />
                            <span>Tasks</span>
                        </Nav.Link>
                    </Nav>
                    
                    <Nav className="align-items-center">
                        {/* Theme Toggle */}
                        <button 
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <FaSun className="theme-icon" />
                            ) : (
                                <FaMoon className="theme-icon" />
                            )}
                        </button>
                        
                        {/* User Info */}
                        {user && (
                            <>
                                <div className="user-info">
                                    <div className="user-avatar">
                                        <FaUser />
                                    </div>
                                    <div className="user-details">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-role">{user.role}</span>
                                    </div>
                                </div>
                                
                                <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    className="logout-btn"
                                >
                                    <FaSignOutAlt className="me-2" />
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
}

export default Navbar;
