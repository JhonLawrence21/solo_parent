import { render } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect, createSignal } from 'https://esm.sh/preact@10.19.3/hooks';
import { html } from 'https://esm.sh/preact@10.19.3/html';
import htm from 'https://esm.sh/htm@3.1.1';
import { AuthProvider, useAuth } from '../context/AuthContext.js';
import Home from '../pages/Home.js';
import Login from '../pages/Login.js';
import Register from '../pages/Register.js';
import Dashboard from '../pages/Dashboard.js';
import Apply from '../pages/Apply.js';
import TrackApplication from '../pages/TrackApplication.js';
import Applicants from '../pages/admin/Applicants.js';
import ApplicantDetails from '../pages/admin/ApplicantDetails.js';
import Users from '../pages/admin/Users.js';
import Reports from '../pages/admin/Reports.js';
import Layout from '../components/Layout.js';
import toast from 'https://esm.sh/preact-toast@1.0.3?deps=preact@10.19.3';

const Toast = toast.Toast;

const App = () => {
  const [route, setRoute] = useState(window.location.pathname);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const handleRouteChange = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handleRouteChange);
    
    const token = localStorage.getItem('token');
    if (token) {
      api.auth.me().then(data => { setUser(data); setLoading(false); }).catch(() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setLoading(false); });
    } else {
      setLoading(false);
    }
    
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const navigate = (path) => {
    window.location.href = path;
  };

  if (loading) {
    return html`<div class="min-h-screen flex items-center justify-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`;
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'staff';
  const token = localStorage.getItem('token');

  const renderPage = () => {
    if (route === '/login') return html`<${Login} />`;
    if (route === '/register') return html`<${Register} />`;
    if (route === '/dashboard' && isAdmin) return html`<${Layout}><${Dashboard} /></${Layout}>`;
    if (route === '/apply' && token) return html`<${Layout}><${Apply} /></${Layout}>`;
    if (route === '/track-application' && token) return html`<${Layout}><${TrackApplication} /></${Layout}>`;
    if (route.startsWith('/admin/applicants/') && isAdmin) return html`<${Layout}><${ApplicantDetails} /></${Layout}>`;
    if (route === '/admin/applicants' && isAdmin) return html`<${Layout}><${Applicants} /></${Layout}>`;
    if (route === '/admin/users' && isAdmin) return html`<${Layout}><${Users} /></${Layout}>`;
    if (route === '/admin/reports' && isAdmin) return html`<${Layout}><${Reports} /></${Layout}>`;
    return html`<${Home} />`;
  };

  return html`
    <${Toast} />
    ${renderPage()}
  `;
};

const Root = () => html`<${App} />`;

render(html`<${Root} />`, document.getElementById('app'));
