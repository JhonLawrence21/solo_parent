import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { adminAuth, auth } from '../middleware/auth.js';

const router = Router();

router.get('/users', adminAuth, async (req, res) => {
  try {
    const { rows } = await query('SELECT id, email, role, is_active, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', adminAuth, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const { rows: existing } = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, role || 'staff']
    );

    res.status(201).json({ message: 'User created successfully', userId: rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { email, role, is_active, password } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 0;

    if (email) {
      paramCount++;
      updates.push(`email = $${paramCount}`);
      values.push(email);
    }
    if (role) {
      paramCount++;
      updates.push(`role = $${paramCount}`);
      values.push(role);
    }
    if (is_active !== undefined) {
      paramCount++;
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      paramCount++;
      updates.push(`password = $${paramCount}`);
      values.push(hashedPassword);
    }

    if (updates.length > 0) {
      paramCount++;
      values.push(req.params.id);
      await query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}`, values);
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    await query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/applicants/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'under_review'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { rows: applicants } = await query('SELECT * FROM applicants WHERE id = $1', [req.params.id]);
    if (applicants.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    await query(
      'UPDATE applicants SET status = $1, admin_notes = $2, approved_by = $3, approved_at = $4 WHERE id = $5',
      [status, admin_notes, status === 'approved' ? req.user.id : null, status === 'approved' ? new Date() : null, req.params.id]
    );

    if (applicants[0].user_id) {
      const title = status === 'approved' ? 'Application Approved' : status === 'rejected' ? 'Application Rejected' : 'Application Update';
      const message = status === 'approved' ? 'Congratulations! Your Solo Parent application has been approved.' :
        status === 'rejected' ? 'We regret to inform you that your application has been rejected.' :
          'Your application is now under review.';

      await query(
        'INSERT INTO notifications (user_id, applicant_id, title, message, type) VALUES ($1, $2, $3, $4, $5)',
        [applicants[0].user_id, req.params.id, title, message, 'status_update']
      );
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
