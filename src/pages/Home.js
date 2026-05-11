import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useState } from 'https://esm.sh/preact@10.19.3/hooks';

const Home = () => {
  const requirements = ['Valid ID (any government-issued)', 'Barangay Certificate', 'Birth Certificate of dependents', 'Supporting documents', '2x2 Recent Photo'];
  const benefits = [
    { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', title: 'Medical Assistance', desc: 'Access to PhilHealth benefits' },
    { icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.4-3.2-6.4-3.2L12 3l-6.4 7.8 6.4 3.2z', title: 'Educational Support', desc: 'Scholarship programs for dependents' },
    { icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', title: 'Legal Aid', desc: 'Free legal consultation' },
    { icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Livelihood Programs', desc: 'Skills training and assistance' }
  ];

  const handleApply = () => {
    const user = localStorage.getItem('user');
    if (user) window.location.href = '/apply';
    else window.location.href = '/login';
  };

  return html`
    <div>
      <header class="bg-white shadow-sm sticky top-0 z-50">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"><span class="text-white font-bold text-lg">SP</span></div>
              <div><h1 class="font-bold text-gray-800">Solo Parent</h1><p class="text-xs text-gray-500">Barangay System</p></div>
            </div>
            <div class="hidden md:flex items-center gap-6">
              <a href="/#about" class="text-gray-600 hover:text-blue-600 font-medium">About</a>
              <a href="/#requirements" class="text-gray-600 hover:text-blue-600 font-medium">Requirements</a>
              <a href="/#benefits" class="text-gray-600 hover:text-blue-600 font-medium">Benefits</a>
              <a href="/login" class="text-gray-600 hover:text-blue-600 font-medium">Login</a>
              <button onClick="${handleApply}" class="btn-primary">Apply Now</button>
            </div>
          </div>
        </nav>
      </header>

      <section class="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 lg:py-32">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl">
            <span class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              Official Government Portal
            </span>
            <h1 class="text-4xl lg:text-5xl font-bold leading-tight mb-6">Barangay Solo Parent <span class="text-yellow-400">Information System</span></h1>
            <p class="text-lg text-blue-100 mb-8">Apply for Solo Parent ID online, track your application status, and access government benefits — all in one place.</p>
            <div class="flex flex-wrap gap-4">
              <button onClick="${handleApply}" class="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                Apply Now
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </button>
              <a href="/#about" class="btn-outline border-white text-white hover:bg-white hover:text-blue-700 text-lg px-8 py-4">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">About Solo Parent Program</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">The Solo Parent Program provides comprehensive support and assistance to solo parents and their families.</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="card text-center"><div class="text-4xl font-bold text-blue-600 mb-2">10,000+</div><div class="text-gray-600">Registered Solo Parents</div></div>
            <div class="card text-center"><div class="text-4xl font-bold text-blue-600 mb-2">95%</div><div class="text-gray-600">Approval Rate</div></div>
            <div class="card text-center"><div class="text-4xl font-bold text-blue-600 mb-2">24/7</div><div class="text-gray-600">Online Application</div></div>
          </div>
        </div>
      </section>

      <section id="requirements" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Requirements</h2>
            <p class="text-gray-600">Prepare the following documents for your application</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${requirements.map(req => html`
              <div class="card flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span class="text-gray-700">${req}</span>
              </div>
            `)}
          </div>
        </div>
      </section>

      <section id="benefits" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Benefits & Services</h2>
            <p class="text-gray-600">Access various programs designed for solo parent families</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            ${benefits.map((b, i) => html`
              <div class="card hover:border-blue-500 border border-transparent">
                <div class="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <svg class="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${b.icon}"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${b.title}</h3>
                <p class="text-gray-600">${b.desc}</p>
              </div>
            `)}
          </div>
        </div>
      </section>

      <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-gray-400">© ${new Date().getFullYear()} Barangay Solo Parent Information System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `;
};

export default Home;
