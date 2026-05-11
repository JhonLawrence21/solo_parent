import { Router } from 'express';
import { query } from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    let queryStr = 'SELECT * FROM notifications WHERE user_id = $1';
    const params = [req.user.id];

    if (req.query.unread === 'true') {
      queryStr += ' AND is_read = false';
    }

    queryStr += ' ORDER BY created_at DESC';

    if (req.query.limit) {
      queryStr += ` LIMIT ${parseInt(req.query.limit)}`;
    }

    const { rows: notifications } = await query(queryStr, params);
    const { rows: countResult } = await query(
      'SELECT COUNT(*)::int as unreadCount FROM notifications WHERE user_id = $1 AND is_read = false',
      [req.user.id]
    );

    res.json({ notifications, unreadCount: countResult[0].unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/read', auth, async (req, res) => {
  try {
    await query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/read-all', auth, async (req, res) => {
  try {
    await query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
