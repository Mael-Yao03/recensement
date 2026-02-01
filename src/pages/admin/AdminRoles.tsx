import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Tag,
  Space,
  message,
  Popconfirm,
  Typography,
  Collapse,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
  LockOutlined,
} from '@ant-design/icons';
import {
  roleService,
  Role,
  Permission,
} from '../../services/adminService';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const AdminRoles: React.FC = () => {
  const { hasPermission, isSuperAdmin } = useAuthStore();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionsByCategory, setPermissionsByCategory] = useState<
    Record<string, Permission[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [form] = Form.useForm();

  const canCreate = hasPermission('create_roles');
  const canEdit = hasPermission('edit_roles');
  const canDelete = hasPermission('delete_roles');
  const canManagePermissions = hasPermission('manage_permissions') || isSuperAdmin();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        roleService.getAll(),
        roleService.getPermissionsByCategory(),
      ]);
      if (rolesRes.data) setRoles(rolesRes.data);
      if (permissionsRes.data) setPermissionsByCategory(permissionsRes.data);
    } catch (error) {
      message.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      form.setFieldsValue({
        name: role.name,
        description: role.description,
      });
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
      const data = {
        ...values,
        permissionIds: selectedPermissions,
      };

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
    const categoryPermissionIds = permissionsByCategory[category]?.map((p) => p.id) || [];
    setSelectedPermissions((prev) => {
      if (checked) {
        return [...new Set([...prev, ...categoryPermissionIds])];
      } else {
        return prev.filter((id) => !categoryPermissionIds.includes(id));
      }
    });
  };

  const categoryLabels: Record<string, string> = {
    dashboard: '📊 Tableau de bord',
    members: '👥 Membres',
    children: '👶 Enfants',
    users: '🔐 Utilisateurs',
    roles: '🛡️ Rôles & Permissions',
  };

  const columns = [
    {
      title: 'Rôle',
      key: 'role',
      render: (record: Role) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              record.isSystemRole ? 'bg-yellow-100' : 'bg-blue-100'
            }`}
          >
            {record.isSystemRole ? (
              <LockOutlined className="text-yellow-600" />
            ) : (
              <SafetyOutlined className="text-blue-600" />
            )}
          </div>
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-gray-500 text-sm">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (record: Role) => (
        <div>
          <Text type="secondary">{record.permissions.length} permissions</Text>
        </div>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      render: (record: Role) => (
        <Tag color={record.isSystemRole ? 'gold' : 'blue'}>
          {record.isSystemRole ? 'Système' : 'Personnalisé'}
        </Tag>
      ),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (record: Role) => (
        <Tag color={record.isActive ? 'success' : 'error'}>
          {record.isActive ? 'Actif' : 'Inactif'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Role) => (
        <Space>
          {canEdit && !record.isSystemRole && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
            />
          )}
          {canManagePermissions && record.isSystemRole && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              title="Modifier les permissions"
            />
          )}
          {canDelete && !record.isSystemRole && (
            <Popconfirm
              title="Supprimer ce rôle ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>🛡️ Gestion des Rôles</Title>
        {canCreate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Nouveau rôle
          </Button>
        )}
      </div>

      <Card className="shadow-md">
        <Table
          dataSource={roles}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingRole ? 'Modifier le rôle' : 'Nouveau rôle'}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Nom du rôle"
            rules={[{ required: true, message: 'Champ requis' }]}
          >
            <Input
              placeholder="Ex: administrateur"
              disabled={editingRole?.isSystemRole}
            />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Description du rôle"
              rows={2}
            />
          </Form.Item>

          <Divider>Permissions</Divider>

          <Collapse className="mb-4">
            {Object.entries(permissionsByCategory).map(([category, permissions]) => {
              const allSelected = permissions.every((p) =>
                selectedPermissions.includes(p.id)
              );
              const someSelected =
                permissions.some((p) => selectedPermissions.includes(p.id)) &&
                !allSelected;

              return (
                <Panel
                  key={category}
                  header={
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          toggleCategoryPermissions(category, e.target.checked)
                        }
                      />
                      <span>{categoryLabels[category] || category}</span>
                      <Tag>{permissions.length}</Tag>
                    </div>
                  }
                >
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map((permission) => (
                      <Checkbox
                        key={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                      >
                        <span className="text-sm">{permission.description}</span>
                      </Checkbox>
                    ))}
                  </div>
                </Panel>
              );
            })}
          </Collapse>

          <div className="flex justify-end gap-2">
            <Button onClick={handleCloseModal}>Annuler</Button>
            <Button type="primary" htmlType="submit">
              {editingRole ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminRoles;
