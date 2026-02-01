import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/adminService';

const { Title, Text } = Typography;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            🏛️ Temple La Transfiguration
          </Title>
          <Text type="secondary">Espace Administration</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label="Nom d'utilisateur ou Email"
            rules={[{ required: true, message: "Veuillez entrer votre nom d'utilisateur" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nom d'utilisateur"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mot de passe"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Se connecter
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 text-center">
          <Text type="secondary" className="text-xs">
            Accès réservé aux administrateurs autorisés
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
