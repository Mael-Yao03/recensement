import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Typography, Button, theme } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission, isSuperAdmin } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Menu items avec vérification des permissions
  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tableau de bord',
      show: hasPermission('view_dashboard') || isSuperAdmin(),
    },
    {
      key: '/admin/members',
      icon: <TeamOutlined />,
      label: 'Inscrits',
      show: hasPermission('view_members') || hasPermission('view_children') || isSuperAdmin(),
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Utilisateurs',
      show: hasPermission('view_users') || isSuperAdmin(),
    },
    {
      key: '/admin/roles',
      icon: <SafetyOutlined />,
      label: 'Rôles',
      show: hasPermission('view_roles') || isSuperAdmin(),
    },
  ].filter((item) => item.show);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Mon profil',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-slate-900"
        width={250}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          {!collapsed ? (
            <Text className="text-white text-lg font-bold">
              🏛️ La Transfiguration
            </Text>
          ) : (
            <Text className="text-white text-2xl">🏛️</Text>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          className="!bg-slate-900 mt-4"
          onClick={({ key }) => navigate(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer }}
          className="px-4 flex items-center justify-between shadow-sm"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-xl"
          />
          <div className="flex items-center gap-4">
            <Text type="secondary" className="hidden sm:inline">
              {user?.role.name === 'super_admin' ? '👑' : '👤'} {user?.fullName}
            </Text>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                className="cursor-pointer bg-blue-600"
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 0,
            minHeight: 280,
            background: 'transparent',
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
