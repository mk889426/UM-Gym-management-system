// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {Button} from '../components/ui/button';
import Loader from '../components/Loader';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<'user'|'member'|'admin'>('user');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string|null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { username, password, role });
      // save token in redux or localStorage
      localStorage.setItem('token', res.data.token);
      navigate('/');  // redirect to dashboard
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded shadow"
      >
        <h2 className="text-2xl font-bold text-primary mb-6">Register</h2>

        {error && (
          <div className="mb-4 text-red-600">
            {error}
          </div>
        )}

        <label className="block mb-3">
          <span className="text-sm">Username</span>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm">Role</span>
          <select
            value={role}
            onChange={e => setRole(e.target.value as any)}
            className="mt-1 w-full p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
}