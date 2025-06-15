import { useState } from 'react';
import axios from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Kayıt isteği gönderiliyor...');
      const res = await axios.post('/users/register', {
        ...form,
        role: 'USER'
      });
      console.log('Kayıt yanıtı:', res.data);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log('Kayıt başarılı, profile yönlendiriliyor');
        navigate('/profile');
      } else {
        console.error('Token alınamadı:', res.data);
        setError('Kayıt işlemi tamamlandı fakat giriş yapılamadı');
      }
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      setError(err.response?.data?.message || 'Kayıt işlemi başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px 40px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minWidth: '320px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>SIGN UP</h2>
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '15px', 
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '5px'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label>
            Username
            <input
              name="username"
              placeholder="username"
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
              required
              disabled={loading}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
              required
              disabled={loading}
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="password"
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
              required
              disabled={loading}
            />
          </label>

          <button 
            type="submit" 
            style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: loading ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Kayıt yapılıyor...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          You have an account?{' '}
          <span
            onClick={() => !loading && navigate('/login')}
            style={{ 
              color: 'blue', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              textDecoration: 'underline',
              opacity: loading ? 0.5 : 1
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
