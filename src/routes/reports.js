import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { query } from '../config/database.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = Router();

router.get('/applicants', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, status, classification, purpose } = req.query;
    let queryStr = 'SELECT * FROM applicants WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      queryStr += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
    }
    if (endDate) {
      paramCount++;
      queryStr += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
    }
    if (status) {
      paramCount++;
      queryStr += ` AND status = $${paramCount}`;
      params.push(status);
    }
    if (classification) {
      paramCount++;
      queryStr += ` AND classification = $${paramCount}`;
      params.push(classification);
    }
    if (purpose) {
      paramCount++;
      queryStr += ` AND purpose_of_application = $${paramCount}`;
      params.push(purpose);
    }

    queryStr += ' ORDER BY created_at DESC';
    const { rows } = await query(queryStr, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/export/excel', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let queryStr = 'SELECT * FROM applicants WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      queryStr += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
    }
    if (endDate) {
      paramCount++;
      queryStr += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
    }
    if (status) {
      paramCount++;
      queryStr += ` AND status = $${paramCount}`;
      params.push(status);
    }

    const { rows: applicants } = await query(queryStr, params);

    const excelData = applicants.map((app, index) => ({
      '#': index + 1,
      'ID Number': app.id_number || '',
      'Full Name': `${app.last_name}, ${app.first_name} ${app.middle_name || ''}`,
      'Age': app.age || '',
      'Sex': app.sex || '',
      'Address': app.address || '',
      'Contact': app.contact_number || '',
      'Classification': app.classification || '',
      'Purpose': app.purpose_of_application || '',
      'Employment': app.employment_type || '',
      'Monthly Income': app.total_monthly_income || 0,
      'Status': app.status || '',
      'Date Applied': app.created_at ? new Date(app.created_at).toLocaleDateString() : ''
    }));

    res.json(excelData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/export/applicants/csv', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, status, search } = req.query;

    let queryStr = `SELECT * FROM applicants WHERE 1=1`;
    const params = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      queryStr += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
    }
    if (endDate) {
      paramCount++;
      queryStr += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
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

    const { rows: applicants } = await query(queryStr, params);

    const columns = [
      'application_type','id_number','expiry_date','last_name','first_name','middle_name','age','sex','birthdate','birth_place','address','contact_number','civil_status','number_of_dependents','facebook_account','educational_attainment','purpose_of_application','employment_type','type_of_employment','other_source_of_income','total_monthly_income','type_of_occupancy','classification',
      'member_4ps','member_ip','member_philhealth','member_sss','member_gsis','member_pagibig','comelec_registered',
      'guardian_name','guardian_relation','guardian_contact','zone_leader_name','zone_leader_contact',
      'status','created_at'
    ];

    const csvEscape = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g,'""')}"`;
      return s;
    };

    const header = columns.join(',');
    const lines = applicants.map(app => {
      return columns.map(c => {
        let val = app[c];
        if (typeof val === 'boolean') val = val ? 'true' : 'false';
        if (c === 'comelec_registered' && val === null) val = 'No';
        if (c === 'total_monthly_income' && val !== null && val !== undefined) val = val;
        if (val === null || val === undefined) val = '';
        return csvEscape(val);
      }).join(',');
    });

    const csv = [header, ...lines].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=applicants-${new Date().toISOString().slice(0,10)}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/export/pdf', adminAuth, async (req, res) => {
  try {
    const { applicantId } = req.query;
    const { rows: applicants } = await query('SELECT * FROM applicants WHERE id = $1', [applicantId]);
    if (applicants.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    const applicant = applicants[0];
    const { rows: family_members } = await query('SELECT * FROM family_members WHERE applicant_id = $1', [applicantId]);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=application-${applicantId}.pdf`);
    doc.pipe(res);

    doc.fontSize(16).text('SOLO PARENT APPLICATION', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Barangay Solo Parent Information System', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(10).text('APPLICATION INFORMATION', { underline: true });
    doc.moveDown();
    doc.text(`Application Type: ${applicant.application_type}`);
    doc.text(`ID Number: ${applicant.id_number || 'N/A'}`);
    doc.moveDown();

    doc.text('PERSONAL INFORMATION', { underline: true });
    doc.moveDown();
    doc.text(`Name: ${applicant.last_name}, ${applicant.first_name} ${applicant.middle_name || ''}`);
    doc.text(`Age: ${applicant.age} | Sex: ${applicant.sex}`);
    doc.text(`Birthdate: ${applicant.birthdate ? new Date(applicant.birthdate).toLocaleDateString() : 'N/A'}`);
    doc.text(`Address: ${applicant.address || 'N/A'}`);
    doc.text(`Contact: ${applicant.contact_number || 'N/A'}`);
    doc.text(`Civil Status: ${applicant.civil_status}`);
    doc.text(`Classification: ${applicant.classification}`);
    doc.moveDown();

    doc.text('EMPLOYMENT', { underline: true });
    doc.moveDown();
    doc.text(`Type: ${applicant.employment_type}`);
    doc.text(`Monthly Income: ₱${parseFloat(applicant.total_monthly_income || 0).toLocaleString()}`);
    doc.moveDown();

    if (family_members.length > 0) {
      doc.text('FAMILY COMPOSITION', { underline: true });
      doc.moveDown();
      family_members.forEach((member, i) => {
        doc.fontSize(9).text(`${i + 1}. ${member.name} - ${member.relation}, ${member.age} years old`);
      });
    }

    doc.moveDown(2);
    doc.text(`Status: ${applicant.status.toUpperCase()}`, { align: 'center' });
    doc.text(`Date Applied: ${new Date(applicant.created_at).toLocaleDateString()}`, { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/demographics', adminAuth, async (req, res) => {
  try {
    const { rows: sexStats } = await query('SELECT sex, COUNT(*)::int as count FROM applicants GROUP BY sex');
    const { rows: ageStats } = await query(`
      SELECT 
        CASE 
          WHEN age < 20 THEN 'Below 20'
          WHEN age BETWEEN 20 AND 30 THEN '20-30'
          WHEN age BETWEEN 31 AND 40 THEN '31-40'
          WHEN age BETWEEN 41 AND 50 THEN '41-50'
          ELSE 'Above 50'
        END as age_range,
        COUNT(*)::int as count
      FROM applicants
      GROUP BY age_range
    `);
    const { rows: civilStats } = await query('SELECT civil_status, COUNT(*)::int as count FROM applicants GROUP BY civil_status');

    res.json({ sexStats, ageStats, civilStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
