import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useState } from 'https://esm.sh/preact@10.19.3/hooks';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.auth.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login successful!');
      if (data.user.role === 'admin' || data.user.role === 'staff') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/apply';
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return html`
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-white font-bold text-2xl">SP</span></div>
          <h1 class="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p class="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        <div class="card">
          <form onSubmit="${handleSubmit}" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value="${email}" onInput="${e => setEmail(e.target.value)}" class="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value="${password}" onInput="${e => setPassword(e.target.value)}" class="input-field" placeholder="Enter your password" required />
            </div>
            <button type="submit" disabled="${loading}" class="btn-primary w-full flex items-center justify-center gap-2">
              ${loading ? html`<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>` : 'Sign In'}
            </button>
          </form>
          <div class="mt-6 text-center">
            <p class="text-gray-600">Don't have an account? <a href="/register" class="text-blue-600 hover:text-blue-700 font-medium">Register here</a></p>
          </div>
        </div>
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800"><strong>Demo Admin:</strong> admin@barangay.gov.ph / admin123</p>
        </div>
      </div>
    </div>
  `;
};

export default Login;
