import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useEffect, useState } from 'https://esm.sh/preact@10.19.3/hooks';

const safeText = (v) => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return String(v);
};

const ApplicantDetails = () => {
  const [applicant, setApplicant] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = window.location.pathname.split('/').pop();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.applicants.getOne(id);
      setApplicant(data);
      setFamilyMembers(data.family_members || []);
      setDocuments(data.documents || []);
    } catch (e) {
      setError(e.message || 'Failed to load applicant');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const boolPill = (v) => {
    const on = !!v;
    return html`<span class="px-2 py-1 rounded-full text-xs font-medium ${on ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">${on ? 'Yes' : 'No'}</span>`;
  };

  if (loading) {
    return html`<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`;
  }

  if (error) {
    return html`
      <div class="max-w-6xl mx-auto">
        <div class="card p-6">
          <div class="text-red-600 font-medium mb-2">${error}</div>
          <a href="/admin/applicants" class="btn-outline inline-block">Back</a>
        </div>
      </div>
    `;
  }

  if (!applicant) {
    return html`
      <div class="max-w-6xl mx-auto">
        <div class="card p-6">
          <div class="text-gray-600">Applicant not found.</div>
          <a href="/admin/applicants" class="btn-outline inline-block">Back</a>
        </div>
      </div>
    `;
  }

  const Field = ({ label, value }) => html`
    <div>
      <div class="text-xs uppercase tracking-wide text-gray-500">${label}</div>
      <div class="mt-1 text-sm text-gray-900 break-words">${safeText(value) || '-'}</div>
    </div>
  `;

  const WideField = ({ label, value }) => html`
    <div class="sm:col-span-2">
      <div class="text-xs uppercase tracking-wide text-gray-500">${label}</div>
      <div class="mt-1 text-sm text-gray-900 break-words">${safeText(value) || '-'}</div>
    </div>
  `;

  return html`
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Applicant Details</h1>
          <p class="text-gray-600">${applicant.last_name}, ${applicant.first_name} ${applicant.middle_name || ''}</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="/admin/applicants" class="btn-outline">Back</a>
          <a href="/admin/reports" class="btn-outline">Reports</a>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Application Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Application Type" value={applicant.application_type} />
          <Field label="ID Number" value={applicant.id_number} />
          <Field label="Expiry Date" value={applicant.expiry_date} />
          <Field label="Age" value={applicant.age} />
          <Field label="Sex" value={applicant.sex} />
          <Field label="Civil Status" value={applicant.civil_status} />
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Last Name" value={applicant.last_name} />
          <Field label="First Name" value={applicant.first_name} />
          <Field label="Middle Name" value={applicant.middle_name} />
          <Field label="Birthdate" value={applicant.birthdate ? new Date(applicant.birthdate).toLocaleDateString() : ''} />
          <Field label="Birth Place" value={applicant.birth_place} />
          <WideField label="Address" value={applicant.address} />
          <Field label="Contact Number" value={applicant.contact_number} />
          <Field label="Number of Dependents" value={applicant.number_of_dependents} />
          <Field label="Facebook Account" value={applicant.facebook_account} />
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Education / Purpose / Employment</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Educational Attainment" value={applicant.educational_attainment} />
          <Field label="Purpose of Application" value={applicant.purpose_of_application} />
          <Field label="Classification" value={applicant.classification} />
          <Field label="Employment Type" value={applicant.employment_type} />
          <Field label="Type of Employment" value={applicant.type_of_employment} />
          <Field label="Other Source of Income" value={applicant.other_source_of_income} />
          <Field label="Total Monthly Income" value={applicant.total_monthly_income} />
          <Field label="Type of Occupancy" value={applicant.type_of_occupancy} />
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Memberships</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><div class="text-xs uppercase tracking-wide text-gray-500">4P's</div>${boolPill(applicant.member_4ps)}</div>
          <div><div class="text-xs uppercase tracking-wide text-gray-500">IP's</div>${boolPill(applicant.member_ip)}</div>
          <div><div class="text-xs uppercase tracking-wide text-gray-500">PhilHealth</div>${boolPill(applicant.member_philhealth)}</div>
          <div><div class="text-xs uppercase tracking-wide text-gray-500">SSS</div>${boolPill(applicant.member_sss)}</div>
          <div><div class="text-xs uppercase tracking-wide text-gray-500">GSIS</div>${boolPill(applicant.member_gsis)}</div>
          <div><div class="text-xs uppercase tracking-wide text-gray-500">PAG-IBIG</div>${boolPill(applicant.member_pagibig)}</div>
          <div class="sm:col-span-2"><div class="text-xs uppercase tracking-wide text-gray-500">COMELEC Registered</div>${boolPill(applicant.comelec_registered === 'Yes' || applicant.comelec_registered === true)}</div>
        </div>
        <div class="mt-3 text-sm text-gray-600">
          <span class="font-medium">COMELEC Registered (raw):</span> ${safeText(applicant.comelec_registered)}
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Guardian / Zone Leader</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Guardian Name" value={applicant.guardian_name} />
          <Field label="Guardian Relation" value={applicant.guardian_relation} />
          <Field label="Guardian Contact" value={applicant.guardian_contact} />
          <Field label="Zone Leader Name" value={applicant.zone_leader_name} />
          <Field label="Zone Leader Contact" value={applicant.zone_leader_contact} />
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Family Composition</h2>
        ${familyMembers.length === 0 ? html`<div class="text-gray-500">No family members added.</div>` : html`
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr class="text-left">
                  <th class="px-3 py-2">#</th>
                  <th class="px-3 py-2">Name</th>
                  <th class="px-3 py-2">Relation</th>
                  <th class="px-3 py-2">Age</th>
                  <th class="px-3 py-2">Birthdate</th>
                  <th class="px-3 py-2">Educational Attainment</th>
                  <th class="px-3 py-2">Occupation</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                ${familyMembers.map((m, i) => html`
                  <tr>
                    <td class="px-3 py-2 text-gray-600">${i + 1}</td>
                    <td class="px-3 py-2">${safeText(m.name)}</td>
                    <td class="px-3 py-2">${safeText(m.relation)}</td>
                    <td class="px-3 py-2">${safeText(m.age)}</td>
                    <td class="px-3 py-2">${m.birthdate ? new Date(m.birthdate).toLocaleDateString() : '-'}</td>
                    <td class="px-3 py-2">${safeText(m.educational_attainment)}</td>
                    <td class="px-3 py-2">${safeText(m.occupation)}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <div class="card">
        <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Status & Documents</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Status" value={applicant.status} />
          <Field label="Date Applied" value={applicant.created_at ? new Date(applicant.created_at).toLocaleDateString() : ''} />
          <Field label="Admin Notes" value={applicant.admin_notes} />
        </div>
        ${documents?.length
          ? html`
              <div class="mt-4">
                <div class="text-sm font-medium text-gray-800 mb-2">Documents</div>
                <div class="space-y-2">
                  ${documents.map(d => html`
                    <div class="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2">
                      <div>
                        <div class="text-sm font-medium">${safeText(d.type)}</div>
                        <div class="text-xs text-gray-500 break-all">${safeText(d.file_name)}</div>
                      </div>
                      <div class="text-xs text-gray-500">${safeText(d.created_at ? new Date(d.created_at).toLocaleDateString() : '')}</div>
                    </div>
                  `)}
                </div>
              </div>
            `
          : html`<div class="mt-4 text-gray-500">No documents uploaded.</div>`}
      </div>
    </div>
  `;
};

export default ApplicantDetails;

