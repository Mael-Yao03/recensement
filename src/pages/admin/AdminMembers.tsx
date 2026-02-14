import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Input,
  Tag,
  Typography,
  Avatar,
  message,
  Tabs,
  Button,
  Drawer,
  Descriptions,
  Image,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { dashboardService } from '../../services/adminService';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminMembers: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const [members, setMembers] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [membersTotal, setMembersTotal] = useState(0);
  const [childrenTotal, setChildrenTotal] = useState(0);
  const [membersPage, setMembersPage] = useState(1);
  const [childrenPage, setChildrenPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('members');

  const canViewMembers = hasPermission('view_members');
  const canViewChildren = hasPermission('view_children');

  useEffect(() => {
    if (activeTab === 'members' && canViewMembers) {
      loadMembers();
    } else if (activeTab === 'children' && canViewChildren) {
      loadChildren();
    }
  }, [membersPage, childrenPage, search, activeTab]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getMembers(membersPage, 10, search);
      if (response.data) {
        setMembers(response.data.data);
        setMembersTotal(response.data.total);
      }
    } catch (error) {
      message.error('Erreur lors du chargement des membres');
    } finally {
      setLoading(false);
    }
  };

  const loadChildren = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getChildren(childrenPage, 10, search);
      if (response.data) {
        setChildren(response.data.data);
        setChildrenTotal(response.data.total);
      }
    } catch (error) {
      message.error('Erreur lors du chargement des enfants');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setMembersPage(1);
    setChildrenPage(1);
  };

  const handleViewDetails = (person: any) => {
    setSelectedPerson(person);
    setDrawerVisible(true);
  };

  const getPhotoUrl = (person: any) => {
    if (person.images && person.images.length > 0) {
      return person.images[0].filePath;
    }
    return null;
  };

  const membersColumns = [
    {
      title: 'Photo',
      key: 'photo',
      width: 80,
      render: (record: any) => {
        const photoUrl = getPhotoUrl(record);
        return photoUrl ? (
          <Avatar src={import.meta.env.VITE_ENV == 'production' ? photoUrl : `https://api.dicebear.com/9.x/toon-head/svg?seed=avatar`} size={50} />
        ) : (
          <Avatar icon={<UserOutlined />} size={50} />
        );
      },
    },
    {
      title: 'Nom & Prénoms',
      dataIndex: 'nomPrenoms',
      key: 'nomPrenoms',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Sexe',
      dataIndex: 'sexe',
      key: 'sexe',
      render: (sexe: string) => (
        <Tag color={sexe === 'homme' ? 'blue' : 'pink'}>
          {sexe === 'homme' ? '♂ Homme' : '♀ Femme'}
        </Tag>
      ),
    },
    {
      title: 'Téléphone',
      key: 'telephone',
      render: (record: any) => record.memberDetails?.telephone || '-',
    },
    {
      title: 'Résidence',
      dataIndex: 'lieuResidence',
      key: 'lieuResidence',
    },
    {
      title: 'Date inscription',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Détails
        </Button>
      ),
    },
  ];

  const childrenColumns = [
    {
      title: 'Photo',
      key: 'photo',
      width: 80,
      render: (record: any) => {
        const photoUrl = getPhotoUrl(record);
        return photoUrl ? (
          <Avatar src={photoUrl} size={50} />
        ) : (
          <Avatar icon={<UserOutlined />} size={50} />
        );
      },
    },
    {
      title: 'Nom & Prénoms',
      dataIndex: 'nomPrenoms',
      key: 'nomPrenoms',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Sexe',
      dataIndex: 'sexe',
      key: 'sexe',
      render: (sexe: string) => (
        <Tag color={sexe === 'masculin' ? 'blue' : 'pink'}>
          {sexe === 'masculin' ? '♂ Garçon' : '♀ Fille'}
        </Tag>
      ),
    },
    {
      title: 'Âge',
      key: 'age',
      render: (record: any) => {
        const age = record.childDetails?.age;
        return age ? `${age} ans` : '-';
      },
    },
    {
      title: 'Parent',
      key: 'parent',
      render: (record: any) => record.childDetails?.nomParent || '-',
    },
    {
      title: 'Date inscription',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Détails
        </Button>
      ),
    },
  ];

  const renderMemberDetails = () => {
    if (!selectedPerson) return null;
    const details = selectedPerson.memberDetails || {};
    const photoUrl = getPhotoUrl(selectedPerson);

    return (
      <div className="space-y-6">
        <div className="text-center">
          
            <Image
              src={import.meta.env.VITE_ENV == 'production' || !photoUrl ? photoUrl : `https://api.dicebear.com/9.x/toon-head/svg?seed=avatar`}
              alt={selectedPerson.nomPrenoms}
              width={150}
              height={150}
              className="rounded-lg object-cover"
            />

          <Title level={4} className="mt-4">
            {selectedPerson.nomPrenoms}
          </Title>
        </div>

        <Descriptions title="Informations générales" bordered column={1} size="small">
          <Descriptions.Item label="Sexe">{selectedPerson.sexe}</Descriptions.Item>
          <Descriptions.Item label="Nationalité">
            {selectedPerson.nationalite}
          </Descriptions.Item>
          <Descriptions.Item label="Ethnie">{selectedPerson.ethnie}</Descriptions.Item>
          <Descriptions.Item label="Résidence">
            {selectedPerson.lieuResidence}
          </Descriptions.Item>
          <Descriptions.Item label="Année de naissance">
            {details.anneeNaissance}
          </Descriptions.Item>
          <Descriptions.Item label="Téléphone">{details.telephone}</Descriptions.Item>
          <Descriptions.Item label="Email">{details.email}</Descriptions.Item>
        </Descriptions>

        <Descriptions title="Situation familiale" bordered column={1} size="small">
          <Descriptions.Item label="Situation matrimoniale">
            {details.situationMatrimoniale}
          </Descriptions.Item>
          <Descriptions.Item label="Nombre d'enfants">
            {details.nombreEnfants}
          </Descriptions.Item>
          <Descriptions.Item label="Nom du conjoint">
            {details.nomConjoint || '-'}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions title="Vie spirituelle" bordered column={1} size="small">
          <Descriptions.Item label="Baptême d'eau">
            {details.baptemeEau === 'oui' ? 'Oui' : 'Non'}
          </Descriptions.Item>
          <Descriptions.Item label="Baptême Saint-Esprit">
            {selectedPerson.baptiseSaintEsprit === 'oui' ? 'Oui' : 'Non'}
          </Descriptions.Item>
          <Descriptions.Item label="Année à La Transfiguration">
            {details.anneeTransfiguration}
          </Descriptions.Item>
          <Descriptions.Item label="Satisfaction">
            {details.satisfactionTransfiguration === 'oui' ? 'Oui' : 'Non'}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions title="Vie professionnelle" bordered column={1} size="small">
          <Descriptions.Item label="Profession">{details.profession}</Descriptions.Item>
          <Descriptions.Item label="Secteur d'activité">
            {details.secteurActivite}
          </Descriptions.Item>
          <Descriptions.Item label="Situation professionnelle">
            {details.situationProfessionnelle}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  const renderChildDetails = () => {
    if (!selectedPerson) return null;
    const details = selectedPerson.childDetails || {};
    const photoUrl = getPhotoUrl(selectedPerson);

    return (
      <div className="space-y-6">
        <div className="text-center">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={selectedPerson.nomPrenoms}
              width={150}
              height={150}
              className="rounded-lg object-cover"
            />
          ) : (
            <Avatar icon={<UserOutlined />} size={150} />
          )}
          <Title level={4} className="mt-4">
            {selectedPerson.nomPrenoms}
          </Title>
        </div>

        <Descriptions title="Informations de l'enfant" bordered column={1} size="small">
          <Descriptions.Item label="Sexe">{selectedPerson.sexe}</Descriptions.Item>
          <Descriptions.Item label="Âge">{details.age} ans</Descriptions.Item>
          <Descriptions.Item label="Niveau d'études">
            {selectedPerson.niveauEtudes}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions title="Informations du parent" bordered column={1} size="small">
          <Descriptions.Item label="Nom du parent">{details.nomParent}</Descriptions.Item>
          <Descriptions.Item label="Téléphone">{details.telephoneParent}</Descriptions.Item>
        </Descriptions>

        <Descriptions title="Vie spirituelle" bordered column={1} size="small">
          <Descriptions.Item label="Baptisé">
            {details.baptise === 'oui' ? 'Oui' : 'Non'}
          </Descriptions.Item>
          <Descriptions.Item label="École du dimanche">
            {details.frequenteEcoleDimanche === 'oui' ? 'Oui' : 'Non'}
          </Descriptions.Item>
          <Descriptions.Item label="Groupe de jeunes">
            {details.groupeJeunes || '-'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  return (
    <div className="p-6">
      <Title level={2}>📋 Liste des Inscrits</Title>

      <Card className="shadow-md">
        <div className="mb-4">
          <Input.Search
            placeholder="Rechercher par nom..."
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            allowClear
            style={{ maxWidth: 400 }}
          />
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {canViewMembers && (
            <TabPane tab={`👥 Membres (${membersTotal})`} key="members">
              <Table
                dataSource={members}
                columns={membersColumns}
                rowKey="id"
                loading={loading}
                pagination={{
                  current: membersPage,
                  total: membersTotal,
                  pageSize: 10,
                  onChange: setMembersPage,
                  showTotal: (total) => `${total} membres`,
                }}
              />
            </TabPane>
          )}
          {canViewChildren && (
            <TabPane tab={`👶 Enfants (${childrenTotal})`} key="children">
              <Table
                dataSource={children}
                columns={childrenColumns}
                rowKey="id"
                loading={loading}
                pagination={{
                  current: childrenPage,
                  total: childrenTotal,
                  pageSize: 10,
                  onChange: setChildrenPage,
                  showTotal: (total) => `${total} enfants`,
                }}
              />
            </TabPane>
          )}
        </Tabs>
      </Card>

      <Drawer
        title="Détails"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedPerson?.type === 'member'
          ? renderMemberDetails()
          : renderChildDetails()}
      </Drawer>
    </div>
  );
};

export default AdminMembers;
