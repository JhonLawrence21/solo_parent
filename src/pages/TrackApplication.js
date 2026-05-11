import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';

const TrackApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.applicants.getAll({ limit: 20 })
      .then(data => setApplications(data.applicants))
      .catch(err => toast.error('Failed to fetch applications'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      under_review: 'bg-blue-100 text-blue-700'
    };
    return html`<span class="px-2 py-1 rounded-full text-xs font-medium ${classes[status] || classes.pending}">${status}</span>`;
  };

  if (loading) {
    return html`<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`;
  }

  return html`
    <div class="max-w-6xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Track Applications</h1>
        <p class="text-gray-600">View and manage your submitted applications</p>
      </div>
      ${applications.length === 0 ? html`
        <div class="card text-center py-12">
          <svg class="mx-auto text-gray-400 mb-4" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h3 class="text-lg font-medium text-gray-800 mb-2">No Applications Found</h3>
          <p class="text-gray-500">You haven't submitted any applications yet.</p>
          <a href="/apply" class="btn-primary mt-4 inline-block">Apply Now</a>
        </div>
      ` : html`
        <div class="grid gap-4">
          ${applications.map(app => html`
            <div class="card flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="text-blue-600" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800">${app.last_name}, ${app.first_name} ${app.middle_name}</h3>
                  <p class="text-sm text-gray-500">ID: ${app.id_number || `SP-${app.id}`} | ${app.classification}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                ${getStatusBadge(app.status)}
                <a href="/apply?edit=${app.id}" class="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                  <svg class="text-gray-600" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </a>
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `;
};

export default TrackApplication;
