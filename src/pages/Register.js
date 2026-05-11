import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useState } from 'https://esm.sh/preact@10.19.3/hooks';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await api.auth.register({ email, password, confirmPassword });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Registration successful!');
      window.location.href = '/apply';
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
          <h1 class="text-2xl font-bold text-gray-800">Create Account</h1>
          <p class="text-gray-600 mt-2">Register to apply for Solo Parent ID</p>
        </div>
        <div class="card">
          <form onSubmit="${handleSubmit}" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value="${email}" onInput="${e => setEmail(e.target.value)}" class="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value="${password}" onInput="${e => setPassword(e.target.value)}" class="input-field" placeholder="Minimum 6 characters" minLength="6" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value="${confirmPassword}" onInput="${e => setConfirmPassword(e.target.value)}" class="input-field" placeholder="Re-enter your password" required />
            </div>
            <button type="submit" disabled="${loading}" class="btn-primary w-full">Create Account</button>
          </form>
          <div class="mt-6 text-center">
            <p class="text-gray-600">Already have an account? <a href="/login" class="text-blue-600 hover:text-blue-700 font-medium">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default Register;
