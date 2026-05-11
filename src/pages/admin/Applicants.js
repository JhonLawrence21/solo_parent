import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadApplicants();
  }, [search, status]);

  const loadApplicants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      params.append('limit', 20);
      const data = await api.applicants.getAll(params.toString());
      setApplicants(data.applicants);
    } catch (err) {
      toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    if (!confirm(`Update status to ${newStatus}?`)) return;
    try {
      await api.admin.updateStatus(id, { status: newStatus });
      toast.success('Status updated');
      loadApplicants();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getStatusBadge = (s) => {
    const cls = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', under_review: 'bg-blue-100 text-blue-700' };
    return html`<span class="px-2 py-1 rounded-full text-xs font-medium ${cls[s] || cls.pending}">${s}</span>`;
  };

  return html`
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manage Applicants</h1>
        <p class="text-gray-600">View and manage all Solo Parent applications</p>
      </div>
      <div class="card">
        <div class="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div class="flex-1">
            <input type="text" placeholder="Search by name or ID..." value="${search}" onInput="${e => setSearch(e.target.value)}" class="input-field" />
          </div>
          <select value="${status}" onChange="${e => setStatus(e.target.value)}" class="input-field w-full sm:w-48 lg:w-48">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="under_review">Under Review</option>
          </select>
          <div class="flex lg:justify-end">
            <button
              onClick="${async () => {
                try {
                  const params = new URLSearchParams();
                  if (search) params.set('search', search);
                  if (status) params.set('status', status);
                  await api.admin.exportApplicantsCSV(params);
                  toast.success('Export started');
                } catch (e) {
                  toast.error(e.message || 'Export failed');
                }
              }}"
              class="btn-primary w-full lg:w-auto"
            >Export CSV</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr class="text-left text-sm text-gray-500">
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Classification</th>
                <th class="px-4 py-3">Purpose</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Date</th>
                <th class="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              ${loading ? html`<tr><td colspan="6" class="px-4 py-8 text-center">Loading...</td></tr>` :
              applicants.length === 0 ? html`<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No applicants found</td></tr>` :
              applicants.map(app => html`
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium">${app.last_name}, ${app.first_name}</td>
                  <td class="px-4 py-3">${app.classification}</td>
                  <td class="px-4 py-3 text-sm">${app.purpose_of_application}</td>
                  <td class="px-4 py-3">${getStatusBadge(app.status)}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">${new Date(app.created_at).toLocaleDateString()}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <button onClick="${() => updateStatus(app.id, 'approved')}" class="p-2 hover:bg-green-50 rounded-lg" title="Approve">
                        <svg class="text-green-600" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                      <button onClick="${() => updateStatus(app.id, 'rejected')}" class="p-2 hover:bg-red-50 rounded-lg" title="Reject">
                        <svg class="text-red-600" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                      <a href="/admin/applicants/${app.id}" class="p-2 hover:bg-gray-100 rounded-lg" title="View">
                        <svg class="text-gray-600" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </a>
                    </div>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

export default Applicants;
