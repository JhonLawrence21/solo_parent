import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useAuth } from '../context/AuthContext.js';
import { useState } from 'https://esm.sh/preact@10.19.3/hooks';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  const navItems = isAdmin ? [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/admin/applicants', label: 'Applicants', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { path: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z', adminOnly: true },
    { path: '/admin/reports', label: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
  ] : [
    { path: '/apply', label: 'Apply Now', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { path: '/track-application', label: 'My Applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
  ];

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return html`
    <div class="min-h-screen bg-gray-50 flex">
      <aside class="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
        <div class="flex flex-col h-full">
          <div class="p-6 border-b">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-lg">SP</span>
              </div>
              <div>
                <h2 class="font-bold text-gray-800">Solo Parent</h2>
                <p class="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          </div>
          <nav class="flex-1 p-4 space-y-2">
            ${navItems.map(item => html`
              <a href="${item.path}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${window.location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path></svg>
                <span class="font-medium">${item.label}</span>
              </a>
            `)}
          </nav>
          <div class="p-4 border-t">
            <button onClick="${logout}" class="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span class="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
      <div class="flex-1 flex flex-col">
        <header class="bg-white shadow-sm sticky top-0 z-20">
          <div class="flex items-center justify-between px-4 lg:px-6 py-4">
            <button onClick="${() => setSidebarOpen(!sidebarOpen)}" class="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div class="flex items-center gap-4 ml-auto">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium">${user?.email?.charAt(0).toUpperCase()}</span>
                </div>
                <div class="hidden sm:block">
                  <p class="font-medium text-sm">${user?.email}</p>
                  <p class="text-xs text-gray-500 capitalize">${user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main class="flex-1 p-4 lg:p-6">${children}</main>
      </div>
      ${sidebarOpen && html`<div class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick="${() => setSidebarOpen(false)}"></div>`}
    </div>
  `;
};

export default Layout;
