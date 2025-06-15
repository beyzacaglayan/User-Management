// src/pages/profilepage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Profile sayfası yüklendi');
        const token = localStorage.getItem('token');
        console.log('Local storage token:', token);

        if (!token) {
          console.log('Token bulunamadı, login sayfasına yönlendiriliyor');
          navigate('/login');
          return;
        }

        // Önce local storage'dan kullanıcı bilgilerini kontrol et
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          console.log('Local storage\'dan kullanıcı bilgileri bulundu:', savedUser);
          setUser(JSON.parse(savedUser));
        }

        console.log('Profile bilgileri isteniyor...');
        const response = await axiosInstance.get('/users/profile');
        console.log('Profile yanıtı:', response.data);

        if (response.data) {
          console.log('Kullanıcı bilgileri alındı:', response.data);
          setUser(response.data);
          // Local storage'ı güncelle
          localStorage.setItem('user', JSON.stringify(response.data));

          // Eğer kullanıcı admin ise tüm kullanıcıları getir
          if (response.data.role === 'ADMIN') {
            try {
              console.log('Admin kullanıcısı tespit edildi, tüm kullanıcılar getiriliyor...');
              const usersResponse = await axiosInstance.get('/users');
              console.log('Tüm kullanıcılar yanıtı:', usersResponse.data);
              
              if (usersResponse.data && usersResponse.data.users) {
                setAllUsers(usersResponse.data.users);
              } else {
                console.error('Geçersiz kullanıcı listesi formatı:', usersResponse.data);
                setError('Kullanıcı listesi alınamadı');
              }
            } catch (error) {
              console.error('Kullanıcı listesi alınırken hata:', error);
              setError('Kullanıcı listesi alınamadı');
            }
          }
        } else {
          console.error('Geçersiz profil yanıtı:', response.data);
          setError('Kullanıcı bilgileri alınamadı');
        }
      } catch (error: any) {
        console.error('Profile hatası:', error);
        if (error.response?.status === 401) {
          console.log('Yetkisiz erişim, login sayfasına yönlendiriliyor');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError(error.response?.data?.message || 'Profil bilgileri alınamadı');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    console.log('Çıkış yapılıyor');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
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
          minWidth: '320px',
          textAlign: 'center'
        }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
          minWidth: '320px',
          textAlign: 'center'
        }}>
          <div style={{ color: 'red', marginBottom: '20px' }}>
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Hata</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px 40px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '30px'
        }}>
          Profil Bilgileri
        </h1>
        
        {user ? (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontWeight: 'bold', color: '#666' }}>Kullanıcı adı: </span>
              <span style={{ color: '#333' }}>{user.username}</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontWeight: 'bold', color: '#666' }}>E-posta: </span>
              <span style={{ color: '#333' }}>{user.email}</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontWeight: 'bold', color: '#666' }}>Rol: </span>
              <span style={{ color: '#333' }}>{user.role}</span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
            Kullanıcı bilgileri bulunamadı
          </div>
        )}

        {user?.role === 'ADMIN' && allUsers.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Tüm Kullanıcılar
            </h2>
            <div style={{
              display: 'grid',
              gap: '15px'
            }}>
              {allUsers.map((u) => (
                <div key={u._id} style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px',
                  border: '1px solid #dee2e6'
                }}>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold', color: '#666' }}>Kullanıcı adı: </span>
                    <span style={{ color: '#333' }}>{u.username}</span>
                  </div>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold', color: '#666' }}>E-posta: </span>
                    <span style={{ color: '#333' }}>{u.email}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#666' }}>Rol: </span>
                    <span style={{ color: '#333' }}>{u.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
