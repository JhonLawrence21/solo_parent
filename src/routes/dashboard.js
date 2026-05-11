import { Router } from 'express';
import { query } from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const { rows: stats } = await query(`
      SELECT 
        COUNT(*)::int as total,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END)::int as approved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)::int as pending,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END)::int as rejected,
        SUM(CASE WHEN status = 'under_review' THEN 1 ELSE 0 END)::int as under_review
      FROM applicants
    `);

    const { rows: monthlyStats } = await query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*)::int as total,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END)::int as approved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)::int as pending
      FROM applicants
      WHERE created_at >= NOW() - INTERVAL '12 MONTHS'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month ASC
    `);

    const { rows: purposeStats } = await query(`
      SELECT purpose_of_application as purpose, COUNT(*)::int as count
      FROM applicants
      GROUP BY purpose_of_application
    `);

    const { rows: classificationStats } = await query(`
      SELECT classification, COUNT(*)::int as count
      FROM applicants
      GROUP BY classification
    `);

    const { rows: incomeStats } = await query(`
      SELECT 
        CASE 
          WHEN total_monthly_income < 10000 THEN 'Below 10,000'
          WHEN total_monthly_income BETWEEN 10000 AND 20000 THEN '10,000 - 20,000'
          WHEN total_monthly_income BETWEEN 20001 AND 30000 THEN '20,001 - 30,000'
          WHEN total_monthly_income BETWEEN 30001 AND 40000 THEN '30,001 - 40,000'
          ELSE 'Above 40,000'
        END as income_range,
        COUNT(*)::int as count
      FROM applicants
      GROUP BY income_range
    `);

    const { rows: recentApplications } = await query(`
      SELECT a.*, u.email 
      FROM applicants a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `);

    res.json({
      overview: stats[0],
      monthly: monthlyStats,
      purposes: purposeStats,
      classifications: classificationStats,
      incomeRanges: incomeStats,
      recentApplications: recentApplications
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
