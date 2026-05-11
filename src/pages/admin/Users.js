import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'staff' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.admin.updateUser(editingUser.id, formData);
        toast.success('User updated');
      } else {
        await api.admin.createUser(formData);
        toast.success('User created');
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ email: user.email, password: '', role: user.role });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.admin.deleteUser(id);
      toast.success('User deleted');
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return html`
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
          <p class="text-gray-600">Manage admin and staff accounts</p>
        </div>
        <button onClick="${() => { setEditingUser(null); setFormData({ email: '', password: '', role: 'staff' }); setShowModal(true); }}" class="btn-primary">+ Add User</button>
      </div>
      <div class="card">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr class="text-left text-sm text-gray-500">
              <th class="px-4 py-3">User</th>
              <th class="px-4 py-3">Role</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            ${loading ? html`<tr><td colspan="4" class="px-4 py-8 text-center">Loading...</td></tr>` :
            users.map(user => html`
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="text-blue-600 font-medium">${user.email.charAt(0).toUpperCase()}</span>
                    </div>
                    <span class="font-medium">${user.email}</span>
                  </div>
                </td>
                <td class="px-4 py-3 capitalize">${user.role}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${user.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td class="px-4 py-3">
                  <button onClick="${() => handleEdit(user)}" class="p-2 hover:bg-gray-100 rounded-lg mr-2">Edit</button>
                  <button onClick="${() => handleDelete(user.id)}" class="p-2 hover:bg-red-50 rounded-lg text-red-600">Delete</button>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
      ${showModal && html`
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick="${() => setShowModal(false)}">
          <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick="${e => e.stopPropagation()}">
            <h2 class="text-xl font-bold text-gray-800 mb-4">${editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit="${handleSubmit}" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value="${formData.email}" onInput="${e => setFormData(prev => ({...prev, email: e.target.value}))}" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password ${editingUser ? '(leave blank)' : ''}</label>
                <input type="password" value="${formData.password}" onInput="${e => setFormData(prev => ({...prev, password: e.target.value}))}" class="input-field" ${!editingUser ? 'required' : ''} />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value="${formData.role}" onChange="${e => setFormData(prev => ({...prev, role: e.target.value}))}" class="input-field">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="flex justify-end gap-3 pt-4">
                <button type="button" onClick="${() => setShowModal(false)}" class="btn-outline">Cancel</button>
                <button type="submit" class="btn-primary">${editingUser ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      `}
    </div>
  `;
};

export default Users;
