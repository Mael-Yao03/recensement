import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/adminService';
import LogoImg from '../../assets/trans.png'

const { Text } = Typography;

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth, setLoading, isLoading } = useAuthStore();
  const [form] = Form.useForm();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      if (response.data) {
        setAuth(response.data);
        message.success('Connexion réussie !');
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0a1628 0%, #0d2550 40%, #1a3a7a 70%, #0f1e3d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>

      {/* Motifs décoratifs de fond */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        {/* Grand cercle lumineux */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,185,0,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,80,180,0.15) 0%, transparent 70%)',
        }} />
        {/* Lignes géométriques subtiles */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.04 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Card principale */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,185,0,0.2)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Bandeau supérieur doré */}
        <div style={{
          background: 'linear-gradient(135deg, #1a3a8a 0%, #1e4fbd 50%, #1a3a8a 100%)',
          padding: '36px 40px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Reflet doré */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '200px', height: '2px',
            background: 'linear-gradient(90deg, transparent, #FFB900, transparent)',
          }} />

          {/* Logo */}
          <div style={{
            width: '90px', height: '90px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            border: '2px solid rgba(255,185,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            padding: '8px',
          }}>
            <img src={LogoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <h1 style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: 700,
            margin: '0 0 4px',
            fontFamily: "'Georgia', serif",
            letterSpacing: '0.5px',
          }}>
            TEMPLE LA TRANSFIGURATION
          </h1>
          <p style={{
            color: 'rgba(255,185,0,0.9)',
            fontSize: '12px',
            margin: 0,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: "'Georgia', serif",
          }}>
            Espace Administration
          </p>
        </div>

        {/* Séparateur doré */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #FFB900 30%, #FFD700 50%, #FFB900 70%, transparent 100%)',
        }} />

        {/* Formulaire */}
        <div style={{ padding: '36px 40px 32px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '28px',
          }}>
            <SafetyCertificateOutlined style={{ color: '#1a3a8a', fontSize: '16px' }} />
            <Text style={{ color: '#1a3a8a', fontSize: '14px', fontWeight: 600, letterSpacing: '0.3px' }}>
              Connexion sécurisée
            </Text>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item
              name="username"
              label={<span style={{ color: '#374151', fontWeight: 600, fontSize: '13px' }}>Nom d'utilisateur ou Email</span>}
              rules={[{ required: true, message: "Veuillez entrer votre nom d'utilisateur" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Nom d'utilisateur"
                size="large"
                style={{
                  borderColor: '#d1d5db',
                  borderRadius: '10px',
                  height: '48px',
                  fontSize: '14px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ color: '#374151', fontWeight: 600, fontSize: '13px' }}>Mot de passe</span>}
              rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Mot de passe"
                size="large"
                style={{
                  borderColor: '#d1d5db',
                  borderRadius: '10px',
                  height: '48px',
                  fontSize: '14px',
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: '8px' }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(135deg, #1a3a8a 0%, #1e4fbd 100%)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(26,58,138,0.4)',
                }}
              >
                Se connecter
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f9fafb',
          borderTop: '1px solid #f0f0f0',
          padding: '14px 40px',
          textAlign: 'center',
        }}>
          <Text style={{ color: '#9ca3af', fontSize: '11px', letterSpacing: '0.3px' }}>
            🔒 Accès réservé aux administrateurs autorisés
          </Text>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;