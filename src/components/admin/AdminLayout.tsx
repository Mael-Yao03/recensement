import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Typography, Button, Tag, Space } from 'antd';
import {
  DashboardOutlined, TeamOutlined, UserOutlined, SafetyOutlined,
  LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  SettingOutlined, BellOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import LogoImg from '../../assets/trans.png';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// ── Palette ───────────────────────────────────────────────────────────────
const BRAND = {
  blue:      '#1a3a8a',
  blueMid:   '#1e4fbd',
  blueLight: '#3b6fd4',
  gold:      '#FFB900',
  sidebar:   '#0d1f4a',
  bg:        '#f0f4fb',
  textDark:  '#0d1f4a',
  textMid:   '#4b5a7a',
  textLight: '#8a9abf',
};

const getInitials = (name: string) =>
  (name || '').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

const AdminLayout: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout, hasPermission, isSuperAdmin } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const navItems = [
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
  ]
    .filter((item) => item.show)
    .map(({ show, ...rest }) => rest);

  const dropdownItems = [
    { key: 'profile', icon: <SettingOutlined />, label: 'Mon profil' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Déconnexion', danger: true, onClick: handleLogout },
  ];

  const isSuperAdminUser = user?.role?.name === 'super_admin';
  const roleLabel        = user?.role?.name || 'viewer';
  const roleBadgeColor   = isSuperAdminUser ? 'gold' : 'blue';
  const currentPage      = navItems.find((item) => item.key === location.pathname);

  return (
    <Layout style={{ minHeight: '100vh' }}>

      {/* ══════════════════════════════════
          SIDER
      ══════════════════════════════════ */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={72}
        style={{
          background: BRAND.sidebar,
          boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div style={{
          height: '64px',
          display: 'flex', alignItems: 'center',
          padding: collapsed ? '0 18px' : '0 20px',
          gap: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <div style={{
            width: '36px', height: '36px', flexShrink: 0,
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.08)',
            border: `1.5px solid ${BRAND.gold}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '4px',
          }}>
            <img src={LogoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: '#fff', fontWeight: 700, fontSize: '13px',
                fontFamily: 'Georgia, serif', lineHeight: 1.3,
                whiteSpace: 'nowrap',
              }}>
                La Transfiguration
              </div>
              <div style={{
                color: BRAND.gold, fontSize: '9px',
                letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.85,
              }}>
                Administration
              </div>
            </div>
          )}
        </div>

        {/* Bloc utilisateur */}
        {!collapsed && (
          <div style={{
            margin: '14px 12px',
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0,
          }}>
            <Avatar
              size={36}
              shape="square"
              style={{
                background: `linear-gradient(135deg, ${BRAND.blueMid}, ${BRAND.blueLight})`,
                fontWeight: 700, fontSize: '13px', flexShrink: 0,
                border: `1.5px solid ${BRAND.gold}40`,
                borderRadius: '9px',
              }}
            >
              {getInitials(user?.fullName || '')}
            </Avatar>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{
                color: '#fff', fontWeight: 600, fontSize: '12px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.fullName}
              </div>
              <Tag
                color={roleBadgeColor}
                style={{
                  marginTop: '3px', fontSize: '9px',
                  padding: '0 6px', lineHeight: '16px', fontWeight: 700,
                }}
              >
                {roleLabel}
              </Tag>
            </div>
          </div>
        )}

        {/* Menu navigation */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '0 8px' }}>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            items={navItems}
            style={{ background: 'transparent', border: 'none' }}
          />
        </div>

        {/* Déconnexion */}
        <div style={{
          padding: '8px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <Menu
            mode="inline"
            theme="dark"
            selectable={false}
            style={{ background: 'transparent', border: 'none' }}
            items={[{
              key: 'logout',
              icon: <LogoutOutlined style={{ color: '#f87171' }} />,
              label: <span style={{ color: '#f87171', fontWeight: 600 }}>Déconnexion</span>,
              onClick: handleLogout,
              style: { borderRadius: '10px' },
            }]}
          />
        </div>
      </Sider>

      {/* ══════════════════════════════════
          LAYOUT PRINCIPAL
      ══════════════════════════════════ */}
      <Layout style={{ background: BRAND.bg }}>

        {/* Header */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          height: '64px',
          lineHeight: '64px',
          boxShadow: '0 1px 0 #e8edf8, 0 4px 16px rgba(26,58,138,0.06)',
          display: 'flex', alignItems: 'center', gap: '16px',
          position: 'sticky', top: 0, zIndex: 50,
        }}>

          {/* Toggle sidebar */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '36px', height: '36px',
              background: BRAND.bg,
              border: `1px solid #e8edf8`,
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: BRAND.textMid, fontSize: '16px',
            }}
          />

          {/* Breadcrumb */}
          <div style={{ flex: 1 }}>
            {currentPage && (
              <Space size={6}>
                <Text style={{ color: BRAND.textLight, fontSize: '13px' }}>Admin</Text>
                <Text style={{ color: BRAND.textLight, fontSize: '13px' }}>/</Text>
                <Text style={{ color: BRAND.textDark, fontWeight: 700, fontSize: '14px', fontFamily: 'Georgia, serif' }}>
                  {currentPage.label}
                </Text>
              </Space>
            )}
          </div>

          {/* Actions droite */}
          <Space size={8}>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{
                width: '36px', height: '36px',
                background: BRAND.bg, border: `1px solid #e8edf8`,
                borderRadius: '10px', color: BRAND.textMid, fontSize: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            />

            <div style={{ width: '1px', height: '28px', background: '#e8edf8' }} />

            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" trigger={['click']}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '4px 10px 4px 4px',
                borderRadius: '12px',
                border: '1px solid #e8edf8',
                background: BRAND.bg,
                cursor: 'pointer',
              }}>
                <Avatar
                  size={32}
                  shape="square"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueMid})`,
                    fontWeight: 700, fontSize: '12px',
                    borderRadius: '8px',
                  }}
                >
                  {getInitials(user?.fullName || '')}
                </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <Text style={{ fontSize: '13px', fontWeight: 600, color: BRAND.textDark }}>
                    {user?.fullName}
                  </Text>
                  <Text style={{ fontSize: '10px', color: BRAND.textLight }}>
                    {roleLabel}
                  </Text>
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>

        {/* Contenu */}
        <Content style={{ minHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>

      {/* Surcharge Ant Design Menu dark pour la charte */}
      <style>{`
        .ant-menu-dark .ant-menu-item-selected {
          background: linear-gradient(135deg, ${BRAND.blueMid}, ${BRAND.blueLight}) !important;
          box-shadow: 0 4px 12px ${BRAND.blue}50 !important;
          border-radius: 10px !important;
          position: relative;
        }
        .ant-menu-dark .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 60%;
          background: ${BRAND.gold};
          border-radius: 0 2px 2px 0;
        }
        .ant-menu-dark .ant-menu-item {
          border-radius: 10px !important;
          margin-bottom: 4px !important;
        }
        .ant-menu-dark.ant-menu-inline .ant-menu-item {
          width: 100% !important;
          margin-inline: 0 !important;
        }
        .ant-menu-dark .ant-menu-item:not(.ant-menu-item-selected):hover {
          background: rgba(255,255,255,0.07) !important;
        }
      `}</style>
    </Layout>
  );
};

export default AdminLayout;