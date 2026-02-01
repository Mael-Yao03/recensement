import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  Tag,
  Spin,
  message,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  RiseOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { dashboardService, DashboardStats } from '../../services/adminService';

const { Title, Text } = Typography;

// Composant KPI Card
const KpiCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}> = ({ title, value, icon, color, suffix }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <Statistic
        title={<span className="text-gray-600">{title}</span>}
        value={value}
        suffix={suffix}
        valueStyle={{ color }}
      />
      <div
        className="text-4xl p-4 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      message.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return <div>Erreur de chargement</div>;
  }

  const recentRegistrationsColumns = [
    {
      title: 'Nom & Prénoms',
      dataIndex: 'nomPrenoms',
      key: 'nomPrenoms',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'member' ? 'blue' : 'green'}>
          {type === 'member' ? 'Membre' : 'Enfant'}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">
        📊 Tableau de bord
      </Title>

      {/* KPIs principaux */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <KpiCard
            title="Total Membres"
            value={stats.totalMembers}
            icon={<UserOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KpiCard
            title="Total Enfants"
            value={stats.totalChildren}
            icon={<TeamOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KpiCard
            title="Nouveaux ce mois"
            value={stats.newMembersThisMonth + stats.newChildrenThisMonth}
            icon={<RiseOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KpiCard
            title="Utilisateurs Admin"
            value={stats.totalUsers}
            icon={<UserOutlined />}
            color="#fa8c16"
          />
        </Col>
      </Row>

      {/* Statistiques par genre */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} lg={12}>
          <Card title="Répartition par genre - Membres" className="shadow-md">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Hommes"
                  value={stats.membersByGender.homme}
                  prefix={<ManOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Femmes"
                  value={stats.membersByGender.femme}
                  prefix={<WomanOutlined style={{ color: '#eb2f96' }} />}
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Répartition par genre - Enfants" className="shadow-md">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Garçons"
                  value={stats.childrenByGender.homme}
                  prefix={<ManOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Filles"
                  value={stats.childrenByGender.femme}
                  prefix={<WomanOutlined style={{ color: '#eb2f96' }} />}
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Statistiques par tranche d'âge */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} lg={12}>
          <Card title="Membres par tranche d'âge" className="shadow-md">
            <div className="space-y-3">
              {Object.entries(stats.membersByAge).map(([age, count]) => (
                <div key={age} className="flex justify-between items-center">
                  <Text>{age === 'non_specifie' ? 'Non spécifié' : `${age} ans`}</Text>
                  <Tag color="blue">{count}</Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Situation matrimoniale" className="shadow-md">
            <div className="space-y-3">
              {Object.entries(stats.membersByMaritalStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <Text className="capitalize">
                    {status === 'non_specifie' ? 'Non spécifié' : status.replace('_', ' ')}
                  </Text>
                  <Tag color="purple">{count}</Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Dernières inscriptions */}
      <Card title="🆕 Dernières inscriptions" className="shadow-md">
        <Table
          dataSource={stats.recentRegistrations}
          columns={recentRegistrationsColumns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
