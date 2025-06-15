import { useState } from 'react';
import axios from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
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
      console.log('Login isteği gönderiliyor...');
      const res = await axios.post('/users/login', form);
      console.log('Login yanıtı:', res.data);

      const { token, user } = res.data;
      
      if (!token) {
        throw new Error('Token alınamadı');
      }

      // Önce mevcut token'ı temizle
      localStorage.removeItem('token');
      
      // Yeni token'ı kaydet
      localStorage.setItem('token', token);
      console.log('Token kaydedildi:', token);

      // Token'ın kaydedildiğini kontrol et
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        throw new Error('Token kaydedilemedi');
      }
      console.log('Kaydedilen token kontrol edildi:', savedToken);

      // Kullanıcı bilgilerini de kaydet
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Kullanıcı bilgileri kaydedildi:', user);
      }
      
      console.log('Profile sayfasına yönlendiriliyor...');
      navigate('/profile', { replace: true });
    } catch (err: any) {
      console.error('Login hatası:', err);
      console.error('Hata detayları:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(err.response?.data?.message || 'Giriş başarısız');
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>LOGIN</h2>
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
            {loading ? 'Giriş yapılıyor...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <span
            onClick={() => !loading && navigate('/signup')}
            style={{ 
              color: 'blue', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              textDecoration: 'underline',
              opacity: loading ? 0.5 : 1
            }}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

