import React, { useEffect, useState } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select,
  Tag, Space, message, Popconfirm, Typography, Badge, Avatar,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined,
  CheckCircleOutlined, CloseCircleOutlined, LockOutlined,
  MailOutlined, ClockCircleOutlined, SafetyOutlined,
} from '@ant-design/icons';
import { userService, roleService, User, Role } from '../../services/adminService';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

// ── Palette identité visuelle ──────────────────────────────────────────────
const BRAND = {
  blue:      '#1a3a8a',
  blueMid:   '#1e4fbd',
  blueLight: '#3b6fd4',
  gold:      '#FFB900',
  goldLight: '#FFD700',
  bg:        '#f0f4fb',
  textDark:  '#0d1f4a',
  textMid:   '#4b5a7a',
  textLight: '#8a9abf',
};

// Couleur par rôle
const roleColor = (name: string) => {
  if (name === 'super_admin') return { bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' };
  if (name === 'admin')       return { bg: `${BRAND.blue}12`, color: BRAND.blue, dot: BRAND.blue };
  return { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' };
};

// Initiales depuis fullName
const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

// Couleur d'avatar déterministe
const avatarColors = [
  `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueMid})`,
  'linear-gradient(135deg, #0d9488, #14b8a6)',
  'linear-gradient(135deg, #7c3aed, #a78bfa)',
  'linear-gradient(135deg, #dc2626, #f87171)',
  `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
];
const getAvatarColor = (name: string) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const AdminUsers: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const [users, setUsers]     = useState<User[]>([]);
  const [roles, setRoles]     = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser]   = useState<User | null>(null);
  const [form] = Form.useForm();

  const canCreate = hasPermission('create_users');
  const canEdit   = hasPermission('edit_users');
  const canDelete = hasPermission('delete_users');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([userService.getAll(), roleService.getAll()]);
      if (usersRes.data) setUsers(usersRes.data);
      if (rolesRes.data) setRoles(rolesRes.data);
    } catch { message.error('Erreur lors du chargement des données'); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue({ username: user.username, email: user.email, fullName: user.fullName, roleId: user.role.id });
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => { setModalVisible(false); setEditingUser(null); form.resetFields(); };

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        const updateData: any = { ...values };
        if (!updateData.password) delete updateData.password;
        await userService.update(editingUser.id, updateData);
        message.success('Utilisateur modifié avec succès');
      } else {
        await userService.create(values);
        message.success('Utilisateur créé avec succès');
      }
      handleCloseModal();
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.delete(id);
      message.success('Utilisateur supprimé');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await userService.toggleActive(id);
      message.success('Statut modifié');
      loadData();
    } catch { message.error('Erreur lors du changement de statut'); }
  };

  const activeCount   = users.filter((u) => u.isActive).length;
  const inactiveCount = users.length - activeCount;

  const columns = [
    {
      title: 'Utilisateur',
      key: 'user',
      render: (record: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar avec initiales */}
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
            background: getAvatarColor(record.fullName || 'A'),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(26,58,138,0.2)',
            fontSize: '14px', fontWeight: 700, color: '#fff',
          }}>
            {record.fullName ? getInitials(record.fullName) : <UserOutlined />}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: BRAND.textDark, fontSize: '14px', lineHeight: 1.3 }}>
              {record.fullName}
            </div>
            <div style={{ color: BRAND.textLight, fontSize: '12px' }}>@{record.username}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MailOutlined style={{ color: BRAND.textLight, fontSize: '12px' }} />
          <Text style={{ color: BRAND.textMid, fontSize: '13px' }}>{email}</Text>
        </div>
      ),
    },
    {
      title: 'Rôle',
      key: 'role',
      render: (record: User) => {
        const rc = roleColor(record.role.name);
        return (
          <Tag style={{
            borderRadius: '20px', fontWeight: 700, fontSize: '11px', border: 'none',
            background: rc.bg, color: rc.color, padding: '2px 10px',
            display: 'inline-flex', alignItems: 'center', gap: '5px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: rc.dot, display: 'inline-block' }} />
            {record.role.name}
          </Tag>
        );
      },
    },
    {
      title: 'Statut',
      key: 'status',
      render: (record: User) => (
        <Tag style={{
          borderRadius: '20px', fontWeight: 600, fontSize: '11px', border: 'none',
          background: record.isActive ? '#f0fdf4' : '#fef2f2',
          color: record.isActive ? '#16a34a' : '#dc2626',
          padding: '2px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px',
        }}>
          {record.isActive
            ? <><CheckCircleOutlined /> Actif</>
            : <><CloseCircleOutlined /> Inactif</>}
        </Tag>
      ),
    },
    {
      title: 'Dernière connexion',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ClockCircleOutlined style={{ color: BRAND.textLight, fontSize: '11px' }} />
          <Text style={{ color: BRAND.textLight, fontSize: '12px' }}>
            {date ? new Date(date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Jamais'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Space size={4}>
          {canEdit && (
            <>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleOpenModal(record)}
                style={{
                  borderRadius: '8px', borderColor: BRAND.blue,
                  color: BRAND.blue, fontWeight: 600, fontSize: '12px',
                }}
              >
                Modifier
              </Button>
              <Button
                size="small"
                icon={record.isActive ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                onClick={() => handleToggleActive(record.id)}
                style={{
                  borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                  borderColor: record.isActive ? '#fca5a5' : '#86efac',
                  color: record.isActive ? '#dc2626' : '#16a34a',
                }}
              >
                {record.isActive ? 'Désactiver' : 'Activer'}
              </Button>
            </>
          )}
          {canDelete && record.role.name !== 'super_admin' && (
            <Popconfirm
              title="Supprimer cet utilisateur ?"
              description="Cette action est irréversible."
              onConfirm={() => handleDelete(record.id)}
              okText="Supprimer"
              cancelText="Annuler"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small" danger
                icon={<DeleteOutlined />}
                style={{ borderRadius: '8px', fontWeight: 600, fontSize: '12px' }}
              >
                Supprimer
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: BRAND.bg, minHeight: '100vh', padding: '28px 24px', fontFamily: 'Georgia, serif' }}>

      {/* ── En-tête ── */}
      <div style={{
        background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.blueMid} 60%, ${BRAND.blueLight} 100%)`,
        borderRadius: '20px', padding: '24px 32px', marginBottom: '24px',
        boxShadow: `0 8px 32px ${BRAND.blue}40`, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '140px', height: '140px', borderRadius: '50%',
          background: 'rgba(255,185,0,0.07)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Title level={3} style={{ color: '#fff', margin: '0 0 2px', fontFamily: 'Georgia, serif' }}>
              Gestion des Utilisateurs
            </Title>
            <Text style={{ color: 'rgba(255,185,0,0.9)', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Temple La Transfiguration — Comptes & Accès
            </Text>
            <div style={{ display: 'flex', gap: '20px', marginTop: '14px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
                <div style={{ color: '#fff', fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>{users.length}</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actifs</div>
                <div style={{ color: BRAND.gold, fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>{activeCount}</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inactifs</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>{inactiveCount}</div>
              </div>
            </div>
          </div>
          {canCreate && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
              style={{
                background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
                border: 'none', borderRadius: '12px',
                color: BRAND.textDark, fontWeight: 700,
                height: '44px', padding: '0 20px', fontSize: '14px',
                boxShadow: `0 4px 12px ${BRAND.gold}50`,
              }}
            >
              Nouvel utilisateur
            </Button>
          )}
        </div>
      </div>

      {/* ── Tableau ── */}
      <Card
        bordered={false}
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(26,58,138,0.08)' }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, style: { marginTop: '16px' } }}
          size="middle"
          rowClassName={(_, i) => i % 2 === 0 ? 'row-even' : 'row-odd'}
        />
      </Card>

      {/* ── Modal création/édition ── */}
      <Modal
        title={null}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={520}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        {/* En-tête modal */}
        <div style={{
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueMid})`,
          padding: '24px 28px 20px',
          borderRadius: '8px 8px 0 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,185,0,0.2)', border: `1px solid ${BRAND.gold}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UserOutlined style={{ color: BRAND.gold, fontSize: '18px' }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', fontFamily: 'Georgia, serif' }}>
                {editingUser ? `Modifier : ${editingUser.fullName}` : 'Créer un utilisateur'}
              </div>
              <div style={{ color: 'rgba(255,185,0,0.8)', fontSize: '11px', letterSpacing: '1px' }}>
                GESTION DES COMPTES
              </div>
            </div>
          </div>
        </div>

        {/* Corps modal */}
        <div style={{ padding: '24px 28px' }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>

            {/* Nom complet + username */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Form.Item
                name="fullName"
                label={<span style={{ fontWeight: 600, color: BRAND.textDark, fontSize: '13px' }}>Nom complet</span>}
                rules={[{ required: true, message: 'Champ requis' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: BRAND.textLight }} />}
                  placeholder="Jean Dupont"
                  style={{ borderRadius: '10px', height: '42px' }}
                />
              </Form.Item>
              <Form.Item
                name="username"
                label={<span style={{ fontWeight: 600, color: BRAND.textDark, fontSize: '13px' }}>Nom d'utilisateur</span>}
                rules={[{ required: true, message: 'Champ requis' }]}
              >
                <Input
                  prefix={<span style={{ color: BRAND.textLight, fontSize: '13px' }}>@</span>}
                  placeholder="jean.dupont"
                  style={{ borderRadius: '10px', height: '42px' }}
                />
              </Form.Item>
            </div>

            {/* Email */}
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 600, color: BRAND.textDark, fontSize: '13px' }}>Adresse email</span>}
              rules={[
                { required: true, message: 'Champ requis' },
                { type: 'email', message: 'Email invalide' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: BRAND.textLight }} />}
                placeholder="jean.dupont@exemple.com"
                style={{ borderRadius: '10px', height: '42px' }}
              />
            </Form.Item>

            {/* Mot de passe */}
            <Form.Item
              name="password"
              label={
                <span style={{ fontWeight: 600, color: BRAND.textDark, fontSize: '13px' }}>
                  {editingUser ? 'Nouveau mot de passe' : 'Mot de passe'}
                  {editingUser && (
                    <span style={{ color: BRAND.textLight, fontWeight: 400, marginLeft: '6px', fontSize: '11px' }}>
                      (laisser vide pour conserver)
                    </span>
                  )}
                </span>
              }
              rules={editingUser ? [] : [{ required: true, message: 'Champ requis' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: BRAND.textLight }} />}
                placeholder={editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                style={{ borderRadius: '10px', height: '42px' }}
              />
            </Form.Item>

            {/* Rôle */}
            <Form.Item
              name="roleId"
              label={<span style={{ fontWeight: 600, color: BRAND.textDark, fontSize: '13px' }}>Rôle</span>}
              rules={[{ required: true, message: 'Champ requis' }]}
            >
              <Select
                placeholder="Sélectionner un rôle"
                style={{ borderRadius: '10px', height: '42px' }}
                optionLabelProp="label"
              >
                {roles.map((role) => {
                  const rc = roleColor(role.name);
                  return (
                    <Select.Option key={role.id} value={role.id} label={role.name}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 0' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '8px',
                          background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <SafetyOutlined style={{ color: rc.color, fontSize: '13px' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: BRAND.textDark }}>{role.name}</div>
                          {role.description && (
                            <div style={{ fontSize: '11px', color: BRAND.textLight }}>{role.description}</div>
                          )}
                        </div>
                        {role.isSystemRole && (
                          <Tag style={{
                            marginLeft: 'auto', fontSize: '10px', borderRadius: '10px',
                            background: '#fef3c7', color: '#b45309', border: 'none',
                          }}>
                            Système
                          </Tag>
                        )}
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            {/* Boutons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <Button
                onClick={handleCloseModal}
                style={{ borderRadius: '10px', height: '42px', padding: '0 20px', fontWeight: 600 }}
              >
                Annuler
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  borderRadius: '10px', height: '42px', padding: '0 24px',
                  background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueMid})`,
                  border: 'none', fontWeight: 700,
                  boxShadow: `0 4px 12px ${BRAND.blue}40`,
                }}
              >
                {editingUser ? 'Enregistrer les modifications' : 'Créer le compte'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      <style>{`
        .row-even td { background: #fff !important; }
        .row-odd  td { background: #f8faff !important; }
        .ant-table-thead > tr > th {
          background: ${BRAND.blue} !important;
          color: #fff !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          letter-spacing: 0.5px !important;
          border: none !important;
        }
        .ant-table-thead > tr > th::before { display: none !important; }
        .ant-table-row:hover td { background: ${BRAND.blue}08 !important; }
      `}</style>
    </div>
  );
};

export default AdminUsers;