import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  message,
  Popconfirm,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  userService,
  roleService,
  User,
  Role,
} from '../../services/adminService';
import { useAuthStore } from '../../stores/authStore';

const { Title } = Typography;

const AdminUsers: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const canCreate = hasPermission('create_users');
  const canEdit = hasPermission('edit_users');
  const canDelete = hasPermission('delete_users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        userService.getAll(),
        roleService.getAll(),
      ]);
      if (usersRes.data) setUsers(usersRes.data);
      if (rolesRes.data) setRoles(rolesRes.data);
    } catch (error) {
      message.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        roleId: user.role.id,
      });
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

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
    } catch (error) {
      message.error('Erreur lors du changement de statut');
    }
  };

  const columns = [
    {
      title: 'Utilisateur',
      key: 'user',
      render: (record: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserOutlined className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{record.fullName}</div>
            <div className="text-gray-500 text-sm">@{record.username}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rôle',
      key: 'role',
      render: (record: User) => (
        <Tag color={record.role.name === 'super_admin' ? 'gold' : 'blue'}>
          {record.role.name}
        </Tag>
      ),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (record: User) => (
        <Tag
          icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={record.isActive ? 'success' : 'error'}
        >
          {record.isActive ? 'Actif' : 'Inactif'}
        </Tag>
      ),
    },
    {
      title: 'Dernière connexion',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date: string) =>
        date ? new Date(date).toLocaleString('fr-FR') : 'Jamais',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Space>
          {canEdit && (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleOpenModal(record)}
              />
              <Button
                type="text"
                icon={record.isActive ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                onClick={() => handleToggleActive(record.id)}
              />
            </>
          )}
          {canDelete && record.role.name !== 'super_admin' && (
            <Popconfirm
              title="Supprimer cet utilisateur ?"
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
        <Title level={2}>👥 Gestion des Utilisateurs</Title>
        {canCreate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Nouvel utilisateur
          </Button>
        )}
      </div>

      <Card className="shadow-md">
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="fullName"
            label="Nom complet"
            rules={[{ required: true, message: 'Champ requis' }]}
          >
            <Input placeholder="Nom complet" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Nom d'utilisateur"
            rules={[{ required: true, message: 'Champ requis' }]}
          >
            <Input placeholder="Nom d'utilisateur" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Champ requis' },
              { type: 'email', message: 'Email invalide' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label={editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
            rules={editingUser ? [] : [{ required: true, message: 'Champ requis' }]}
          >
            <Input.Password placeholder="Mot de passe" />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Rôle"
            rules={[{ required: true, message: 'Champ requis' }]}
          >
            <Select placeholder="Sélectionner un rôle">
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name} {role.isSystemRole && '(Système)'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={handleCloseModal}>Annuler</Button>
            <Button type="primary" htmlType="submit">
              {editingUser ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
