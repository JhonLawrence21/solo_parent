import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reports.getDemographics()
      .then(setData)
      .catch(err => toast.error('Failed to fetch reports'))
      .finally(() => setLoading(false));
  }, []);

  const exportExcel = async () => {
    try {
      const excelData = await api.reports.exportExcel({});
      const csv = ['Name,Age,Sex,Classification,Purpose,Income,Status,Date\n',
        ...excelData.map(r => `${r['Full Name']},${r.Age},${r.Sex},${r.Classification},${r.Purpose},${r['Monthly Income']},${r.Status},${r['Date Applied']}`)].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success('Report exported');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return html`<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`;
  }

  return html`
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p class="text-gray-600">Generate reports and view statistics</p>
        </div>
        <button onClick="${exportExcel}" class="btn-primary">Export to CSV</button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Gender Distribution</h3>
          <div class="space-y-3">
            ${(data?.sexStats || []).map(s => html`
              <div class="flex items-center justify-between">
                <span class="text-gray-600">${s.sex || 'Unknown'}</span>
                <span class="font-medium">${s.count}</span>
              </div>
            `)}
          </div>
        </div>
        <div class="card">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Age Distribution</h3>
          <div class="space-y-3">
            ${(data?.ageStats || []).map(a => html`
              <div class="flex items-center justify-between">
                <span class="text-gray-600">${a.age_range}</span>
                <span class="font-medium">${a.count}</span>
              </div>
            `)}
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Civil Status Distribution</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          ${(data?.civilStats || []).map(c => html`
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-blue-600">${c.count}</div>
              <div class="text-sm text-gray-600">${c.civil_status}</div>
            </div>
          `)}
        </div>
      </div>
    </div>
  `;
};

export default Reports;
