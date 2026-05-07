const jwt = require('jsonwebtoken');

// Verify JWT token
exports.authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token.' 
        });
    }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Admin privileges required.' 
        });
    }
    next();
};

// Check if user is project admin or owner
exports.isProjectAdmin = async (req, res, next) => {
    try {
        const db = require('../config/database');
        const projectId = req.params.id || req.params.projectId;
        
        // Check if user is project owner or project admin
        const [rows] = await db.query(
            `SELECT p.owner_id, pm.role 
             FROM projects p 
             LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ?
             WHERE p.id = ?`,
            [req.user.id, projectId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Project not found.' 
            });
        }

        const isOwner = rows[0].owner_id === req.user.id;
        const isProjectAdmin = rows[0].role === 'admin';

        if (!isOwner && !isProjectAdmin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Project admin privileges required.' 
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};
