import React, { useEffect, useState } from 'react';
import {
  Card, Table, Input, Tag, Typography, Avatar, message,
  Tabs, Button, Drawer, Descriptions, Image, Space, Badge,
} from 'antd';
import {
  SearchOutlined, UserOutlined, EyeOutlined,
  DownloadOutlined, TeamOutlined, ManOutlined, WomanOutlined,
  CalendarOutlined, PhoneOutlined, MailOutlined, HomeOutlined,
} from '@ant-design/icons';
import { dashboardService } from '../../services/adminService';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

// ── Palette identité visuelle ──────────────────────────────────────────────
const BRAND = {
  blue: '#1a3a8a',
  blueMid: '#1e4fbd',
  blueLight: '#3b6fd4',
  gold: '#FFB900',
  goldLight: '#FFD700',
  bg: '#f0f4fb',
  textDark: '#0d1f4a',
  textMid: '#4b5a7a',
  textLight: '#8a9abf',
};

const AdminMembers: React.FC = () => {
  const { hasPermission, user } = useAuthStore();
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

  // Seuls admin et super admin peuvent télécharger
  const canDownload = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (activeTab === 'members' && canViewMembers) loadMembers();
    else if (activeTab === 'children' && canViewChildren) loadChildren();
  }, [membersPage, childrenPage, search, activeTab]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getMembers(membersPage, 10, search);
      if (response.data) { setMembers(response.data.data); setMembersTotal(response.data.total); }
    } catch { message.error('Erreur lors du chargement des membres'); }
    finally { setLoading(false); }
  };

  const loadChildren = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getChildren(childrenPage, 10, search);
      if (response.data) { setChildren(response.data.data); setChildrenTotal(response.data.total); }
    } catch { message.error('Erreur lors du chargement des enfants'); }
    finally { setLoading(false); }
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

  const handleDownload = (person: any) => {
    message.info(`Téléchargement de la fiche de ${person.nomPrenoms}…`);
    // TODO: implémenter l'export PDF de la fiche individuelle
  };

  const getPhotoUrl = (person: any) => {
    if (person.images && person.images.length > 0) return person.images[0].filePath;
    return null;
  };

  // ── Colonne photo ──────────────────────────────────────────────────────────
  const photoCol = {
    title: '',
    key: 'photo',
    width: 64,
    render: (record: any) => {
      const url = getPhotoUrl(record);
      return url ? (
        <Avatar
          src={import.meta.env.VITE_ENV === 'production' ? url : `https://api.dicebear.com/9.x/toon-head/svg?seed=avatar`}
          size={44}
          style={{ border: `2px solid ${BRAND.gold}`, boxShadow: '0 2px 8px rgba(26,58,138,0.15)' }}
        />
      ) : (
        <Avatar
          icon={<UserOutlined />}
          size={44}
          style={{
            background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueMid})`,
            border: `2px solid ${BRAND.gold}`,
          }}
        />
      );
    },
  };

  // ── Colonne actions commune ────────────────────────────────────────────────
  const actionsCol = (record: any) => (
    <Space size={4}>
      <Button
      className='mr-2'
        size="small"
        icon={<EyeOutlined />}
        onClick={() => handleViewDetails(record)}
        style={{
          borderRadius: '8px',
          borderColor: BRAND.blue,
          color: BRAND.blue,
          fontWeight: 600,
          fontSize: '12px',
        }}
      >
        Détails
      </Button>
      {/* {canDownload && ( */}
      <Button
        size="small"
        icon={<DownloadOutlined />}
        onClick={() => handleDownload(record)}
        style={{
          borderRadius: '8px',
          borderColor: BRAND.blue,
          color: BRAND.blue,
          fontWeight: 600,
          fontSize: '12px',
        }}
      >
        Fiche
      </Button>
      {/* )} */}
    </Space>
  );

  const membersColumns = [
    photoCol,
    {
      title: 'Nom & Prénoms',
      dataIndex: 'nomPrenoms',
      key: 'nomPrenoms',
      render: (text: string) => (
        <Text strong style={{ color: BRAND.textDark, fontSize: '14px' }}>{text}</Text>
      ),
    },
    {
      title: 'Sexe',
      dataIndex: 'sexe',
      key: 'sexe',
      render: (sexe: string) => (
        <Tag style={{
          borderRadius: '20px', fontWeight: 600, fontSize: '11px', border: 'none',
          background: sexe === 'homme' ? `${BRAND.blue}15` : '#fce7f3',
          color: sexe === 'homme' ? BRAND.blue : '#db2777',
        }}>
          {sexe === 'homme' ? '♂ Homme' : '♀ Femme'}
        </Tag>
      ),
    },
    {
      title: 'Téléphone',
      key: 'telephone',
      render: (record: any) => (
        <Text style={{ color: BRAND.textMid, fontSize: '13px' }}>
          {record.memberDetails?.telephone || '—'}
        </Text>
      ),
    },
    {
      title: 'Résidence',
      dataIndex: 'lieuResidence',
      key: 'lieuResidence',
      render: (v: string) => <Text style={{ color: BRAND.textMid, fontSize: '13px' }}>{v || '—'}</Text>,
    },
    {
      title: 'Inscription',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text style={{ color: BRAND.textLight, fontSize: '12px' }}>
          {new Date(date).toLocaleDateString('fr-FR')}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: actionsCol,
    },
  ];

  const childrenColumns = [
    photoCol,
    {
      title: 'Nom & Prénoms',
      dataIndex: 'nomPrenoms',
      key: 'nomPrenoms',
      render: (text: string) => (
        <Text strong style={{ color: BRAND.textDark, fontSize: '14px' }}>{text}</Text>
      ),
    },
    {
      title: 'Sexe',
      dataIndex: 'sexe',
      key: 'sexe',
      render: (sexe: string) => (
        <Tag style={{
          borderRadius: '20px', fontWeight: 600, fontSize: '11px', border: 'none',
          background: sexe === 'masculin' ? `${BRAND.blue}15` : '#fce7f3',
          color: sexe === 'masculin' ? BRAND.blue : '#db2777',
        }}>
          {sexe === 'masculin' ? '♂ Garçon' : '♀ Fille'}
        </Tag>
      ),
    },
    {
      title: 'Âge',
      key: 'age',
      render: (record: any) => {
        const age = record.childDetails?.age;
        return <Text style={{ color: BRAND.textMid, fontSize: '13px' }}>{age ? `${age} ans` : '—'}</Text>;
      },
    },
    {
      title: 'Parent',
      key: 'parent',
      render: (record: any) => (
        <Text style={{ color: BRAND.textMid, fontSize: '13px' }}>
          {record.childDetails?.nomParent || '—'}
        </Text>
      ),
    },
    {
      title: 'Inscription',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text style={{ color: BRAND.textLight, fontSize: '12px' }}>
          {new Date(date).toLocaleDateString('fr-FR')}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: actionsCol,
    },
  ];

  // ── Drawer : détails membre ────────────────────────────────────────────────
  const renderMemberDetails = () => {
    if (!selectedPerson) return null;
    const details = selectedPerson.memberDetails || {};
    const photoUrl = getPhotoUrl(selectedPerson);

    return (
      <div>
        {/* En-tête du profil */}
        <div style={{
          background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.blueMid} 100%)`,
          margin: '-24px -24px 24px',
          padding: '32px 24px 28px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{
            width: '100px', height: '133px',   /* ratio 3:4 */
            borderRadius: '12px',
            overflow: 'hidden',
            border: `3px solid ${BRAND.gold}`,
            margin: '0 auto 14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            background: BRAND.blueLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {photoUrl ? (
              <img
                src={import.meta.env.VITE_ENV === 'production' ? photoUrl : `https://api.dicebear.com/9.x/toon-head/svg?seed=avatar`}
                alt={selectedPerson.nomPrenoms}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
            ) : (
              <UserOutlined style={{ fontSize: '40px', color: 'rgba(255,255,255,0.5)' }} />
            )}
          </div>

          <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: '18px', fontFamily: 'Georgia, serif' }}>
            {selectedPerson.nomPrenoms}
          </h2>
          <Tag style={{
            background: 'rgba(255,185,0,0.2)', color: BRAND.gold,
            border: `1px solid ${BRAND.gold}50`, borderRadius: '20px', fontWeight: 700,
          }}>
            MEMBRE
          </Tag>

          {canDownload && (
            <div style={{ marginTop: '14px' }}>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(selectedPerson)}
                size="small"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
                  border: 'none', borderRadius: '8px',
                  color: BRAND.textDark, fontWeight: 700, fontSize: '12px',
                }}
              >
                Télécharger la fiche
              </Button>
            </div>
          )}
        </div>

        {/* Infos rapides */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '10px', marginBottom: '20px',
        }}>
          {[
            { icon: <ManOutlined />, label: 'Sexe', value: selectedPerson.sexe },
            { icon: <CalendarOutlined />, label: 'Naissance', value: details.anneeNaissance || '—' },
            { icon: <PhoneOutlined />, label: 'Téléphone', value: details.telephone || '—' },
            { icon: <MailOutlined />, label: 'Email', value: details.email || '—' },
          ].map((item, i) => (
            <div key={i} style={{
              background: BRAND.bg, borderRadius: '10px', padding: '10px 12px',
              display: 'flex', gap: '8px', alignItems: 'center',
            }}>
              <span style={{ color: BRAND.gold, fontSize: '14px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '10px', color: BRAND.textLight, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: BRAND.textDark }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <DescSection title="Situation familiale" items={[
          ['Situation matrimoniale', details.situationMatrimoniale],
          ["Nombre d'enfants", details.nombreEnfants],
          ['Nom du conjoint', details.nomConjoint || '—'],
        ]} />
        <DescSection title="Vie spirituelle" items={[
          ["Baptême d'eau", details.baptemeEau === 'oui' ? 'Oui' : 'Non'],
          ['Baptême Saint-Esprit', selectedPerson.baptiseSaintEsprit === 'oui' ? 'Oui' : 'Non'],
          ['Année à La Transfiguration', details.anneeTransfiguration],
          ['Satisfaction', details.satisfactionTransfiguration === 'oui' ? 'Oui' : 'Non'],
        ]} />
        <DescSection title="Vie professionnelle" items={[
          ['Profession', details.profession],
          ["Secteur d'activité", details.secteurActivite],
          ['Situation professionnelle', details.situationProfessionnelle],
        ]} />
      </div>
    );
  };

  // ── Drawer : détails enfant ────────────────────────────────────────────────
  const renderChildDetails = () => {
    if (!selectedPerson) return null;
    const details = selectedPerson.childDetails || {};
    const photoUrl = getPhotoUrl(selectedPerson);

    return (
      <div>
        <div style={{
          background: `linear-gradient(135deg, ${BRAND.blueLight} 0%, ${BRAND.blueMid} 100%)`,
          margin: '-24px -24px 24px',
          padding: '32px 24px 28px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '100px', height: '133px',
            borderRadius: '12px', overflow: 'hidden',
            border: `3px solid ${BRAND.gold}`,
            margin: '0 auto 14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            background: BRAND.blueLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={selectedPerson.nomPrenoms}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
            ) : (
              <UserOutlined style={{ fontSize: '40px', color: 'rgba(255,255,255,0.5)' }} />
            )}
          </div>
          <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: '18px', fontFamily: 'Georgia, serif' }}>
            {selectedPerson.nomPrenoms}
          </h2>
          <Tag style={{
            background: 'rgba(255,185,0,0.2)', color: BRAND.gold,
            border: `1px solid ${BRAND.gold}50`, borderRadius: '20px', fontWeight: 700,
          }}>
            ECODIM
          </Tag>
          {canDownload && (
            <div style={{ marginTop: '14px' }}>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(selectedPerson)}
                size="small"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
                  border: 'none', borderRadius: '8px',
                  color: BRAND.textDark, fontWeight: 700, fontSize: '12px',
                }}
              >
                Télécharger la fiche
              </Button>
            </div>
          )}
        </div>

        <DescSection title="Informations de l'enfant" items={[
          ['Sexe', selectedPerson.sexe],
          ['Âge', details.age ? `${details.age} ans` : '—'],
          ["Niveau d'études", selectedPerson.niveauEtudes],
        ]} />
        <DescSection title="Informations du parent" items={[
          ['Nom du parent', details.nomParent],
          ['Téléphone', details.telephoneParent],
        ]} />
        <DescSection title="Vie spirituelle" items={[
          ['Baptisé', details.baptise === 'oui' ? 'Oui' : 'Non'],
          ['École du dimanche', details.frequenteEcoleDimanche === 'oui' ? 'Oui' : 'Non'],
          ['Groupe de jeunes', details.groupeJeunes || '—'],
        ]} />
      </div>
    );
  };

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
        <Title level={3} style={{ color: '#fff', margin: '0 0 2px', fontFamily: 'Georgia, serif' }}>
          Liste des Inscrits
        </Title>
        <Text style={{ color: 'rgba(255,185,0,0.9)', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Temple La Transfiguration — Gestion des fidèles
        </Text>
        <div style={{ display: 'flex', gap: '20px', marginTop: '14px', flexWrap: 'wrap' }}>
          <StatBadge label="Membres" value={membersTotal} icon={<UserOutlined />} />
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <StatBadge label="Enfants" value={childrenTotal} icon={<TeamOutlined />} />
        </div>
      </div>

      {/* ── Corps ── */}
      <Card
        bordered={false}
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(26,58,138,0.08)' }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        {/* Barre de recherche */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Input.Search
            placeholder="Rechercher par nom…"
            onSearch={handleSearch}
            allowClear
            style={{ maxWidth: '360px' }}
            size="large"
            styles={{
              input: { borderRadius: '10px', borderColor: '#d1d5db', fontSize: '14px' },
            } as any}
          />
          {canDownload && (
            <Tag style={{
              background: `${BRAND.gold}20`, color: BRAND.textDark,
              border: `1px solid ${BRAND.gold}60`, borderRadius: '20px',
              padding: '2px 10px', fontSize: '11px', fontWeight: 600,
            }}>
              🔑 Téléchargement activé
            </Tag>
          )}
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ fontFamily: 'Georgia, serif' }}
          tabBarStyle={{ borderBottom: `2px solid ${BRAND.blue}20` }}
          items={[
            ...(canViewMembers ? [{
              key: 'members',
              label: (
                <span style={{ fontWeight: activeTab === 'members' ? 700 : 500, color: activeTab === 'members' ? BRAND.blue : BRAND.textMid }}>
                  <UserOutlined /> Membres{' '}
                  <Badge count={membersTotal} style={{ background: BRAND.blue, marginLeft: '4px' }} />
                </span>
              ),
              children: (
                <Table
                  dataSource={members}
                  columns={membersColumns}
                  rowKey="id"
                  loading={loading}
                  size="middle"
                  pagination={{
                    current: membersPage,
                    total: membersTotal,
                    pageSize: 10,
                    onChange: setMembersPage,
                    showTotal: (total) => `${total} membres`,
                  }}
                  rowClassName={(_, i) => i % 2 === 0 ? 'row-even' : 'row-odd'}
                />
              ),
            }] : []),
            ...(canViewChildren ? [{
              key: 'children',
              label: (
                <span style={{ fontWeight: activeTab === 'children' ? 700 : 500, color: activeTab === 'children' ? BRAND.blue : BRAND.textMid }}>
                  <TeamOutlined /> Enfants{' '}
                  <Badge count={childrenTotal} style={{ background: BRAND.blue, marginLeft: '4px' }} />
                </span>
              ),
              children: (
                <Table
                  dataSource={children}
                  columns={childrenColumns}
                  rowKey="id"
                  loading={loading}
                  size="middle"
                  pagination={{
                    current: childrenPage,
                    total: childrenTotal,
                    pageSize: 10,
                    onChange: setChildrenPage,
                    showTotal: (total) => `${total} enfants`,
                  }}
                  rowClassName={(_, i) => i % 2 === 0 ? 'row-even' : 'row-odd'}
                />
              ),
            }] : []),
          ]}
        />
      </Card>

      {/* ── Drawer détails ── */}
      <Drawer
        title={null}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={440}
        styles={{ body: { padding: '24px', background: '#fff' }, header: { display: 'none' } }}
      >
        {selectedPerson?.type === 'member' ? renderMemberDetails() : renderChildDetails()}
      </Drawer>

      {/* ── Styles globaux ── */}
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
        .ant-tabs-ink-bar { background: ${BRAND.blue} !important; height: 3px !important; border-radius: 2px !important; }
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn { color: ${BRAND.blue} !important; }
        .ant-table-row:hover td { background: ${BRAND.blue}08 !important; }
      `}</style>
    </div>
  );
};

// ── Composants utilitaires ─────────────────────────────────────────────────
const StatBadge: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div>
    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </span>
    <div style={{ color: '#fff', fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>
      {value.toLocaleString('fr-FR')}
    </div>
  </div>
);

const DescSection: React.FC<{ title: string; items: [string, any][] }> = ({ title, items }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
    }}>
      <div style={{ width: '3px', height: '16px', background: '#FFB900', borderRadius: '2px' }} />
      <span style={{ fontWeight: 700, fontSize: '13px', color: '#0d1f4a', fontFamily: 'Georgia, serif' }}>
        {title}
      </span>
    </div>
    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e8edf8' }}>
      {items.map(([label, value], i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '9px 14px',
          background: i % 2 === 0 ? '#f8faff' : '#fff',
          borderBottom: i < items.length - 1 ? '1px solid #eef2fb' : 'none',
        }}>
          <span style={{ fontSize: '12px', color: '#4b5a7a', fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: '12px', color: '#0d1f4a', fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>
            {value || '—'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default AdminMembers;