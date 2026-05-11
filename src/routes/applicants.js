import { Router } from 'express';
import { query } from '../config/database.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', auth, async (req, res) => {
  try {
    const {
      application_type, id_number, expiry_date,
      last_name, first_name, middle_name, age, sex, birthdate, birth_place,
      address, contact_number, civil_status, number_of_dependents, facebook_account,
      educational_attainment, purpose_of_application,
      employment_type, type_of_employment, other_source_of_income, total_monthly_income, type_of_occupancy,
      classification,
      member_4ps, member_ip, member_philhealth, member_sss, member_gsis, member_pagibig, comelec_registered,
      guardian_name, guardian_relation, guardian_contact,
      zone_leader_name, zone_leader_contact,
      family_members
    } = req.body;

    const { rows } = await query(`
      INSERT INTO applicants (
        user_id, application_type, id_number, expiry_date,
        last_name, first_name, middle_name, age, sex, birthdate, birth_place,
        address, contact_number, civil_status, number_of_dependents, facebook_account,
        educational_attainment, purpose_of_application,
        employment_type, type_of_employment, other_source_of_income, total_monthly_income, type_of_occupancy,
        classification,
        member_4ps, member_ip, member_philhealth, member_sss, member_gsis, member_pagibig, comelec_registered,
        guardian_name, guardian_relation, guardian_contact,
        zone_leader_name, zone_leader_contact
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37
      ) RETURNING id
    `, [
      req.user.id, application_type, id_number, expiry_date,
      last_name, first_name, middle_name, age, sex, birthdate, birth_place,
      address, contact_number, civil_status, number_of_dependents, facebook_account,
      educational_attainment, purpose_of_application,
      employment_type, type_of_employment, other_source_of_income, total_monthly_income, type_of_occupancy,
      classification,
      member_4ps || false, member_ip || false, member_philhealth || false, member_sss || false, member_gsis || false, member_pagibig || false, comelec_registered || 'No',
      guardian_name, guardian_relation, guardian_contact,
      zone_leader_name, zone_leader_contact
    ]);

    const applicantId = rows[0].id;

    if (family_members && family_members.length > 0) {
      for (const member of family_members) {
        await query(
          `INSERT INTO family_members (applicant_id, name, relation, age, birthdate, educational_attainment, occupation) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [applicantId, member.name, member.relation, member.age, member.birthdate, member.educational_attainment, member.occupation]
        );
      }
    }

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: applicantId
    });
  } catch (error) {
    console.error('Create applicant error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let queryStr = 'SELECT * FROM applicants WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (req.user.role === 'applicant') {
      paramCount++;
      queryStr += ` AND user_id = $${paramCount}`;
      params.push(req.user.id);
    }

    if (status) {
      paramCount++;
      queryStr += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      queryStr += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR id_number ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    queryStr += ' ORDER BY created_at DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount++;
    queryStr += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const { rows: applicants } = await query(queryStr, params);

    const { rows: countResult } = await query(
      `SELECT COUNT(*) as total FROM applicants WHERE ${req.user.role === 'applicant' ? 'user_id = $1' : '1=1'}`,
      req.user.role === 'applicant' ? [req.user.id] : []
    );

    res.json({
      applicants,
      pagination: {
        total: parseInt(countResult[0].total),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(parseInt(countResult[0].total) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const { rows: applicants } = await query('SELECT * FROM applicants WHERE id = $1', [req.params.id]);
    if (applicants.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    if (req.user.role === 'applicant' && applicants[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { rows: family_members } = await query('SELECT * FROM family_members WHERE applicant_id = $1', [req.params.id]);
    const { rows: documents } = await query('SELECT * FROM documents WHERE applicant_id = $1', [req.params.id]);

    res.json({
      ...applicants[0],
      family_members,
      documents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { rows: applicants } = await query('SELECT * FROM applicants WHERE id = $1', [req.params.id]);
    if (applicants.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    if (req.user.role === 'applicant' && applicants[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const allowedFields = [
      'application_type', 'id_number', 'expiry_date',
      'last_name', 'first_name', 'middle_name', 'age', 'sex', 'birthdate', 'birth_place',
      'address', 'contact_number', 'civil_status', 'number_of_dependents', 'facebook_account',
      'educational_attainment', 'purpose_of_application',
      'employment_type', 'type_of_employment', 'other_source_of_income', 'total_monthly_income', 'type_of_occupancy',
      'classification',
      'member_4ps', 'member_ip', 'member_philhealth', 'member_sss', 'member_gsis', 'member_pagibig', 'comelec_registered',
      'guardian_name', 'guardian_relation', 'guardian_contact',
      'zone_leader_name', 'zone_leader_contact'
    ];

    const updates = [];
    const values = [];
    let paramCount = 0;

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        values.push(req.body[field]);
      }
    }

    if (updates.length > 0) {
      paramCount++;
      values.push(req.params.id);
      await query(`UPDATE applicants SET ${updates.join(', ')} WHERE id = $${paramCount}`, values);
    }

    if (req.body.family_members) {
      await query('DELETE FROM family_members WHERE applicant_id = $1', [req.params.id]);
      for (const member of req.body.family_members) {
        await query(
          `INSERT INTO family_members (applicant_id, name, relation, age, birthdate, educational_attainment, occupation) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [req.params.id, member.name, member.relation, member.age, member.birthdate, member.educational_attainment, member.occupation]
        );
      }
    }

    res.json({ message: 'Application updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows: applicants } = await query('SELECT * FROM applicants WHERE id = $1', [req.params.id]);
    if (applicants.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    if (req.user.role === 'applicant' && applicants[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await query('DELETE FROM applicants WHERE id = $1', [req.params.id]);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/documents', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type } = req.body;
    const { rows } = await query(
      `INSERT INTO documents (applicant_id, type, file_path, file_name, file_size, mime_type) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.params.id, type, req.file.path, req.file.originalname, req.file.size, req.file.mimetype]
    );

    res.status(201).json({
      message: 'Document uploaded successfully',
      documentId: rows[0].id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
