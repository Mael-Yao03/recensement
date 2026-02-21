import React, { useEffect, useState } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Checkbox,
  Tag, Space, message, Popconfirm, Typography, Collapse, Divider, Badge,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  SafetyOutlined, LockOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import { roleService, Role, Permission } from '../../services/adminService';
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

const categoryLabels: Record<string, { label: string; color: string }> = {
  dashboard: { label: 'Tableau de bord',     color: '#7c3aed' },
  members:   { label: 'Membres',             color: BRAND.blue },
  children:  { label: 'Enfants',             color: '#0d9488' },
  users:     { label: 'Utilisateurs',        color: '#dc2626' },
  roles:     { label: 'Rôles & Permissions', color: BRAND.gold },
};

const categoryIcons: Record<string, string> = {
  dashboard: '📊',
  members:   '👥',
  children:  '👶',
  users:     '🔐',
  roles:     '🛡️',
};

const AdminRoles: React.FC = () => {
  const { hasPermission, isSuperAdmin } = useAuthStore();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionsByCategory, setPermissionsByCategory] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [form] = Form.useForm();

  const canCreate           = hasPermission('create_roles');
  const canEdit             = hasPermission('edit_roles');
  const canDelete           = hasPermission('delete_roles');
  const canManagePermissions = hasPermission('manage_permissions') || isSuperAdmin();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        roleService.getAll(),
        roleService.getPermissionsByCategory(),
      ]);
      if (rolesRes.data) setRoles(rolesRes.data);
      if (permissionsRes.data) setPermissionsByCategory(permissionsRes.data);
    } catch {
      message.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      form.setFieldsValue({ name: role.name, description: role.description });
      setSelectedPermissions(role.permissions.map((p) => p.id));
    } else {
      setEditingRole(null);
      form.resetFields();
      setSelectedPermissions([]);
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingRole(null);
    form.resetFields();
    setSelectedPermissions([]);
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = { ...values, permissionIds: selectedPermissions };
      if (editingRole) {
        await roleService.update(editingRole.id, data);
        message.success('Rôle modifié avec succès');
      } else {
        await roleService.create(data);
        message.success('Rôle créé avec succès');
      }
      handleCloseModal();
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await roleService.delete(id);
      message.success('Rôle supprimé');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleCategoryPermissions = (category: string, checked: boolean) => {
    const ids = permissionsByCategory[category]?.map((p) => p.id) || [];
    setSelectedPermissions((prev) =>
      checked ? [...new Set([...prev, ...ids])] : prev.filter((id) => !ids.includes(id))
    );
  };

  // ── Colonnes du tableau ────────────────────────────────────────────────────
  const columns = [
    {
      title: 'Rôle',
      key: 'role',
      render: (record: Role) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: record.isSystemRole
              ? `linear-gradient(135deg, #f59e0b, #fbbf24)`
              : `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueMid})`,
            boxShadow: record.isSystemRole
              ? '0 2px 8px rgba(245,158,11,0.35)'
              : `0 2px 8px ${BRAND.blue}40`,
            fontSize: '18px',
          }}>
            {record.isSystemRole
              ? <LockOutlined style={{ color: '#fff', fontSize: '16px' }} />
              : <SafetyOutlined style={{ color: '#fff', fontSize: '16px' }} />}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: BRAND.textDark, fontSize: '14px' }}>
              {record.name}
            </div>
            <div style={{ color: BRAND.textLight, fontSize: '12px', marginTop: '1px' }}>
              {record.description || '—'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (record: Role) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: `${BRAND.blue}12`, borderRadius: '20px',
            padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px',
          }}>
            {/* <ShieldOutlined style={{ color: BRAND.blue, fontSize: '11px' }} /> */}
            <span style={{ color: BRAND.blue, fontWeight: 700, fontSize: '12px' }}>
              {record.permissions.length}
            </span>
          </div>
          <Text style={{ color: BRAND.textLight, fontSize: '12px' }}>permissions</Text>
        </div>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      render: (record: Role) => (
        <Tag style={{
          borderRadius: '20px', fontWeight: 600, fontSize: '11px', border: 'none',
          background: record.isSystemRole ? '#fef3c7' : `${BRAND.blue}12`,
          color: record.isSystemRole ? '#b45309' : BRAND.blue,
          padding: '2px 10px',
        }}>
          {record.isSystemRole ? '🔒 Système' : '⚙️ Personnalisé'}
        </Tag>
      ),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (record: Role) => (
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
      title: 'Actions',
      key: 'actions',
      render: (record: Role) => (
        <Space size={6}>
          {(canEdit && !record.isSystemRole) || (canManagePermissions && record.isSystemRole) ? (
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
          ) : null}
          {canDelete && !record.isSystemRole && (
            <Popconfirm
              title="Supprimer ce rôle ?"
              description="Cette action est irréversible."
              onConfirm={() => handleDelete(record.id)}
              okText="Supprimer"
              cancelText="Annuler"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                danger
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

  const totalPermissions = Object.values(permissionsByCategory).reduce((acc, p) => acc + p.length, 0);

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
              Gestion des Rôles
            </Title>
            <Text style={{ color: 'rgba(255,185,0,0.9)', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Temple La Transfiguration — Permissions & Accès
            </Text>
            <div style={{ display: 'flex', gap: '20px', marginTop: '14px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rôles</div>
                <div style={{ color: '#fff', fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>{roles.length}</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Permissions totales</div>
                <div style={{ color: BRAND.gold, fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>{totalPermissions}</div>
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
              Nouveau rôle
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
          dataSource={roles}
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
        width={680}
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
              <SafetyOutlined style={{ color: BRAND.gold, fontSize: '18px' }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', fontFamily: 'Georgia, serif' }}>
                {editingRole ? `Modifier : ${editingRole.name}` : 'Créer un nouveau rôle'}
              </div>
              <div style={{ color: 'rgba(255,185,0,0.8)', fontSize: '11px', letterSpacing: '1px' }}>
                GESTION DES ACCÈS
              </div>
            </div>
          </div>
        </div>

        {/* Corps modal */}
        <div style={{ padding: '24px 28px' }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '4px' }}>
              <Form.Item
                name="name"
                label={<span style={{ fontWeight: 600, color: BRAND.textDark, fontSize: '13px' }}>Nom du rôle</span>}
                rules={[{ required: true, message: 'Champ requis' }]}
              >
                <Input
                  placeholder="Ex: modérateur"
                  disabled={editingRole?.isSystemRole}
                  style={{ borderRadius: '10px', height: '42px' }}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={<span style={{ fontWeight: 600, color: BRAND.textDark, fontSize: '13px' }}>Description</span>}
              >
                <Input
                  placeholder="Description courte"
                  style={{ borderRadius: '10px', height: '42px' }}
                />
              </Form.Item>
            </div>

            {/* Séparateur permissions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0 14px' }}>
              <div style={{ width: '3px', height: '18px', background: BRAND.gold, borderRadius: '2px' }} />
              <span style={{ fontWeight: 700, fontSize: '14px', color: BRAND.textDark, fontFamily: 'Georgia, serif' }}>
                Permissions
              </span>
              <div style={{
                background: `${BRAND.blue}12`, borderRadius: '20px', padding: '2px 10px',
              }}>
                <span style={{ color: BRAND.blue, fontWeight: 700, fontSize: '12px' }}>
                  {selectedPermissions.length} sélectionnées
                </span>
              </div>
              <div style={{ flex: 1, height: '1px', background: `${BRAND.gold}40` }} />
            </div>

            {/* Catégories de permissions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
              {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                const allSelected  = permissions.every((p) => selectedPermissions.includes(p.id));
                const someSelected = permissions.some((p) => selectedPermissions.includes(p.id)) && !allSelected;
                const meta = categoryLabels[category] || { label: category, color: BRAND.blue };
                const icon = categoryIcons[category] || '⚙️';
                const selectedCount = permissions.filter((p) => selectedPermissions.includes(p.id)).length;

                return (
                  <div key={category} style={{
                    border: `1px solid ${allSelected ? meta.color + '50' : '#e8edf8'}`,
                    borderRadius: '12px',
                    background: allSelected ? `${meta.color}05` : '#fff',
                    transition: 'all 0.2s',
                    marginBottom: '2px',
                  }}>
                    {/* Header catégorie — cliquable pour tout cocher/décocher */}
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '11px 16px', cursor: 'pointer',
                        background: allSelected ? `${meta.color}10` : '#f8faff',
                        borderBottom: '1px solid #e8edf8',
                        borderRadius: '12px 12px 0 0',
                        userSelect: 'none',
                      }}
                      onClick={() => toggleCategoryPermissions(category, !allSelected)}
                    >
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => toggleCategoryPermissions(category, e.target.checked)}
                      />
                      <span style={{ fontSize: '15px' }}>{icon}</span>
                      <span style={{ fontWeight: 700, color: BRAND.textDark, fontSize: '13px', flex: 1 }}>
                        {meta.label}
                      </span>
                      <span style={{
                        background: allSelected ? meta.color : (someSelected ? `${meta.color}30` : '#e8edf8'),
                        color: allSelected ? '#fff' : (someSelected ? meta.color : BRAND.textMid),
                        borderRadius: '20px', padding: '2px 10px',
                        fontSize: '11px', fontWeight: 700,
                        transition: 'all 0.2s', minWidth: '36px', textAlign: 'center',
                      }}>
                        {selectedCount}/{permissions.length}
                      </span>
                    </div>

                    {/* Permissions individuelles */}
                    <div style={{ padding: '6px 8px 8px' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: permissions.length === 1 ? '1fr' : '1fr 1fr',
                        gap: '4px',
                      }}>
                        {permissions.map((permission) => {
                          const isChecked = selectedPermissions.includes(permission.id);
                          return (
                            <div
                              key={permission.id}
                              onClick={() => togglePermission(permission.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 12px', cursor: 'pointer',
                                borderRadius: '8px',
                                background: isChecked ? `${meta.color}12` : 'transparent',
                                border: `1px solid ${isChecked ? meta.color + '30' : 'transparent'}`,
                                transition: 'all 0.15s',
                                userSelect: 'none',
                              }}
                            >
                              <Checkbox
                                checked={isChecked}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => togglePermission(permission.id)}
                              />
                              <span style={{
                                fontSize: '12px',
                                color: isChecked ? BRAND.textDark : BRAND.textMid,
                                fontWeight: isChecked ? 600 : 400,
                                lineHeight: 1.35,
                              }}>
                                {permission.description}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
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
                {editingRole ? 'Enregistrer les modifications' : 'Créer le rôle'}
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

export default AdminRoles;