import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.getStats()
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return html`<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`;
  }

  const cards = [
    { title: 'Total Applicants', value: stats?.overview?.total || 0, color: 'bg-blue-500' },
    { title: 'Approved', value: stats?.overview?.approved || 0, color: 'bg-green-500' },
    { title: 'Pending', value: stats?.overview?.pending || 0, color: 'bg-yellow-500' },
    { title: 'Rejected', value: stats?.overview?.rejected || 0, color: 'bg-red-500' }
  ];

  return html`
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p class="text-gray-600">Overview of Solo Parent applications</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${cards.map(card => html`
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">${card.title}</p>
                <p class="text-3xl font-bold text-gray-800 mt-1">${card.value}</p>
              </div>
              <div class="${card.color} p-3 rounded-xl">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
            </div>
          </div>
        `)}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Classification Breakdown</h3>
          <div class="space-y-3">
            ${(stats?.classifications || []).map(c => html`
              <div class="flex items-center justify-between">
                <span class="text-gray-600">${c.classification}</span>
                <div class="flex items-center gap-2">
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${Math.min((c.count / (stats?.overview?.total || 1)) * 100, 100)}%"></div>
                  </div>
                  <span class="text-sm font-medium">${c.count}</span>
                </div>
              </div>
            `)}
          </div>
        </div>
        <div class="card">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Purpose Distribution</h3>
          <div class="space-y-3">
            ${(stats?.purposes || []).map(p => html`
              <div class="flex items-center justify-between">
                <span class="text-gray-600">${p.purpose}</span>
                <div class="flex items-center gap-2">
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div class="bg-yellow-500 h-2 rounded-full" style="width: ${Math.min((p.count / (stats?.overview?.total || 1)) * 100, 100)}%"></div>
                  </div>
                  <span class="text-sm font-medium">${p.count}</span>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Recent Applications</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr class="text-left text-sm text-gray-500">
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Classification</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              ${(stats?.recentApplications || []).map(app => html`
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium">${app.last_name}, ${app.first_name}</td>
                  <td class="px-4 py-3">${app.classification}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${app.status === 'approved' ? 'bg-green-100 text-green-700' : app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">${app.status}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500">${new Date(app.created_at).toLocaleDateString()}</td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

export default Dashboard;
