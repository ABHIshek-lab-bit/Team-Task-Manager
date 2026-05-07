const db = require('../config/database');

// Get all projects (user is member of)
exports.getAllProjects = async (req, res) => {
    try {
        const [projects] = await db.query(
            `SELECT DISTINCT p.*, u.name as owner_name,
             (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count,
             (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
             FROM projects p
             LEFT JOIN users u ON p.owner_id = u.id
             LEFT JOIN project_members pm ON p.id = pm.project_id
             WHERE p.owner_id = ? OR pm.user_id = ?
             ORDER BY p.created_at DESC`,
            [req.user.id, req.user.id]
        );

        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Get single project
exports.getProject = async (req, res) => {
    try {
        const [projects] = await db.query(
            `SELECT p.*, u.name as owner_name
             FROM projects p
             LEFT JOIN users u ON p.owner_id = u.id
             WHERE p.id = ?`,
            [req.params.id]
        );

        if (projects.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Project not found.' 
            });
        }

        // Get project members
        const [members] = await db.query(
            `SELECT u.id, u.name, u.email, pm.role, pm.joined_at
             FROM project_members pm
             JOIN users u ON pm.user_id = u.id
             WHERE pm.project_id = ?`,
            [req.params.id]
        );

        const project = projects[0];
        project.members = members;

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Create project
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const [result] = await db.query(
            'INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)',
            [name, description, req.user.id]
        );

        // Add owner as admin member
        await db.query(
            'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
            [result.insertId, req.user.id, 'admin']
        );

        const [projects] = await db.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Project created successfully.',
            data: projects[0]
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        await db.query(
            'UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?',
            [name, description, status, req.params.id]
        );

        const [projects] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Project updated successfully.',
            data: projects[0]
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Project deleted successfully.'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Add member to project
exports.addMember = async (req, res) => {
    try {
        const { user_id, role } = req.body;
        const projectId = req.params.id;

        // Check if user exists
        const [users] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found.' 
            });
        }

        // Check if already a member
        const [existing] = await db.query(
            'SELECT id FROM project_members WHERE project_id = ? AND user_id = ?',
            [projectId, user_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'User is already a member.' 
            });
        }

        await db.query(
            'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
            [projectId, user_id, role || 'member']
        );

        res.status(201).json({
            success: true,
            message: 'Member added successfully.'
        });
    } catch (error) {
        console.error('Add member error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Remove member from project
exports.removeMember = async (req, res) => {
    try {
        const { userId } = req.params;
        const projectId = req.params.id;

        await db.query(
            'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
            [projectId, userId]
        );

        res.json({
            success: true,
            message: 'Member removed successfully.'
        });
    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};
