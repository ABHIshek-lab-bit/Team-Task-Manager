const db = require('../config/database');

// Get all tasks (with filters)
exports.getAllTasks = async (req, res) => {
    try {
        const { project_id, status, assigned_to } = req.query;
        
        let query = `
            SELECT t.*, 
                   p.name as project_name,
                   u1.name as assigned_to_name,
                   u2.name as created_by_name
            FROM tasks t
            LEFT JOIN projects p ON t.project_id = p.id
            LEFT JOIN users u1 ON t.assigned_to = u1.id
            LEFT JOIN users u2 ON t.created_by = u2.id
            WHERE (p.owner_id = ? OR EXISTS (
                SELECT 1 FROM project_members pm 
                WHERE pm.project_id = t.project_id AND pm.user_id = ?
            ))
        `;
        
        const params = [req.user.id, req.user.id];

        if (project_id) {
            query += ' AND t.project_id = ?';
            params.push(project_id);
        }

        if (status) {
            query += ' AND t.status = ?';
            params.push(status);
        }

        if (assigned_to) {
            query += ' AND t.assigned_to = ?';
            params.push(assigned_to);
        }

        query += ' ORDER BY t.created_at DESC';

        const [tasks] = await db.query(query, params);

        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Get single task
exports.getTask = async (req, res) => {
    try {
        const [tasks] = await db.query(
            `SELECT t.*, 
                    p.name as project_name,
                    u1.name as assigned_to_name,
                    u2.name as created_by_name
             FROM tasks t
             LEFT JOIN projects p ON t.project_id = p.id
             LEFT JOIN users u1 ON t.assigned_to = u1.id
             LEFT JOIN users u2 ON t.created_by = u2.id
             WHERE t.id = ?`,
            [req.params.id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found.' 
            });
        }

        res.json({
            success: true,
            data: tasks[0]
        });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Create task
exports.createTask = async (req, res) => {
    try {
        const { title, description, project_id, assigned_to, status, priority, due_date } = req.body;

        // Verify user is member of project
        const [membership] = await db.query(
            `SELECT 1 FROM projects p
             LEFT JOIN project_members pm ON p.id = pm.project_id
             WHERE p.id = ? AND (p.owner_id = ? OR pm.user_id = ?)`,
            [project_id, req.user.id, req.user.id]
        );

        if (membership.length === 0) {
            return res.status(403).json({ 
                success: false, 
                message: 'You are not a member of this project.' 
            });
        }

        const [result] = await db.query(
            `INSERT INTO tasks (title, description, project_id, assigned_to, created_by, status, priority, due_date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, project_id, assigned_to, req.user.id, status || 'todo', priority || 'medium', due_date]
        );

        const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Task created successfully.',
            data: tasks[0]
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, assigned_to, status, priority, due_date } = req.body;

        // Get the task to check permissions
        const [existingTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        
        if (existingTask.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found.' 
            });
        }

        // Check if user has permission to update this task
        // Admin can update any task, Member can only update tasks assigned to them
        if (req.user.role !== 'admin' && existingTask[0].assigned_to !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to update this task.' 
            });
        }

        // Convert due_date to MySQL format (YYYY-MM-DD) if it exists
        let formattedDueDate = due_date;
        if (due_date) {
            const date = new Date(due_date);
            formattedDueDate = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
        }

        await db.query(
            `UPDATE tasks 
             SET title = ?, description = ?, assigned_to = ?, status = ?, priority = ?, due_date = ?
             WHERE id = ?`,
            [title, description, assigned_to, status, priority, formattedDueDate, req.params.id]
        );

        const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Task updated successfully.',
            data: tasks[0]
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        // Get the task to check permissions
        const [existingTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        
        if (existingTask.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found.' 
            });
        }

        // Check if user has permission to delete this task
        // Admin can delete any task, Member can only delete tasks assigned to them
        if (req.user.role !== 'admin' && existingTask[0].assigned_to !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to delete this task.' 
            });
        }

        await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Task deleted successfully.'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// Get dashboard stats
exports.getDashboard = async (req, res) => {
    try {
        // Get task statistics - FIXED: Use same logic as getAllTasks to avoid duplicates
        const [stats] = await db.query(
            `SELECT 
                COUNT(DISTINCT t.id) as total_tasks,
                SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
                SUM(CASE WHEN t.status = 'todo' THEN 1 ELSE 0 END) as todo_tasks,
                SUM(CASE WHEN t.due_date < CURDATE() AND t.status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
             FROM tasks t
             JOIN projects p ON t.project_id = p.id
             LEFT JOIN project_members pm ON p.id = pm.project_id
             WHERE p.owner_id = ? OR pm.user_id = ?`,
            [req.user.id, req.user.id]
        );

        // Get recent tasks - FIXED: Use same logic as getAllTasks to avoid duplicates
        const [recentTasks] = await db.query(
            `SELECT DISTINCT t.*, p.name as project_name
             FROM tasks t
             JOIN projects p ON t.project_id = p.id
             LEFT JOIN project_members pm ON p.id = pm.project_id
             WHERE p.owner_id = ? OR pm.user_id = ?
             ORDER BY t.created_at DESC
             LIMIT 5`,
            [req.user.id, req.user.id]
        );

        // Get overdue tasks - FIXED: Use same logic as getAllTasks to avoid duplicates
        const [overdueTasks] = await db.query(
            `SELECT DISTINCT t.*, p.name as project_name
             FROM tasks t
             JOIN projects p ON t.project_id = p.id
             LEFT JOIN project_members pm ON p.id = pm.project_id
             WHERE (p.owner_id = ? OR pm.user_id = ?)
             AND t.due_date < CURDATE() 
             AND t.status != 'completed'
             ORDER BY t.due_date ASC`,
            [req.user.id, req.user.id]
        );

        // Get recent projects
        const [recentProjects] = await db.query(
            `SELECT DISTINCT p.*, u.name as owner_name,
             (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count,
             (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
             FROM projects p
             LEFT JOIN users u ON p.owner_id = u.id
             LEFT JOIN project_members pm ON p.id = pm.project_id
             WHERE p.owner_id = ? OR pm.user_id = ?
             ORDER BY p.created_at DESC
             LIMIT 5`,
            [req.user.id, req.user.id]
        );

        res.json({
            success: true,
            data: {
                stats: stats[0],
                recentTasks,
                overdueTasks,
                recentProjects
            }
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};
