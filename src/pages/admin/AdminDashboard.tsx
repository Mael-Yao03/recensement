import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Statistic, Typography, Table, Tag, Spin, message, Badge,
} from 'antd';
import {
  UserOutlined, TeamOutlined, RiseOutlined, ManOutlined, WomanOutlined,
  CalendarOutlined, TrophyOutlined,
} from '@ant-design/icons';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
  AreaChart, Area,
} from 'recharts';
import { dashboardService, DashboardStats } from '../../services/adminService';

const { Title, Text } = Typography;

// ── Palette identité visuelle ──────────────────────────────────────────────
const BRAND = {
  blue:       '#1a3a8a',
  blueMid:    '#1e4fbd',
  blueLight:  '#3b6fd4',
  gold:       '#FFB900',
  goldLight:  '#FFD700',
  goldSoft:   '#FFF3CC',
  white:      '#ffffff',
  bg:         '#f0f4fb',
  textDark:   '#0d1f4a',
  textMid:    '#4b5a7a',
  textLight:  '#8a9abf',
};

const PIE_COLORS_GENDER  = [BRAND.blueMid, '#e83e8c'];
const PIE_COLORS_AGE     = ['#1e4fbd','#3b6fd4','#5d8de8','#85aaee','#afc6f5','#d0defa'];
const BAR_COLOR_MARIAGE  = [BRAND.gold, BRAND.blueMid, BRAND.blueLight, '#d0defa', '#ffd97a'];

// ── KPI Card ───────────────────────────────────────────────────────────────
const KpiCard: React.FC<{
  title: string; value: number; icon: React.ReactNode;
  gradient: [string, string]; suffix?: string; trend?: string;
}> = ({ title, value, icon, gradient, suffix, trend }) => (
  <Card
    bordered={false}
    style={{
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(26,58,138,0.10)',
      background: '#fff',
      height: '100%',      // s'étire pour matcher la card voisine la plus haute
    }}
    bodyStyle={{ padding: 0, height: '100%' }}
  >
    {/* Barre supérieure dégradée */}
    <div style={{
      height: '4px',
      background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
    }} />
    {/* Contenu avec hauteur fixe pour uniformité */}
    <div style={{
      padding: '20px 22px',
      minHeight: '110px',
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <Text style={{ fontSize: '11px', color: BRAND.textMid, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
            {title}
          </Text>
          <div style={{ fontSize: '34px', fontWeight: 800, color: BRAND.textDark,
            lineHeight: 1.15, marginTop: '6px', fontFamily: 'Georgia, serif' }}>
            {value.toLocaleString('fr-FR')}{suffix && <span style={{ fontSize: '18px' }}>{suffix}</span>}
          </div>
          {/* Toujours réserver la hauteur de la ligne trend */}
          <div style={{ height: '18px', marginTop: '4px' }}>
            {trend && (
              <Text style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>
                {trend}
              </Text>
            )}
          </div>
        </div>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${gradient[0]}55`,
          fontSize: '22px', color: '#fff',
        }}>
          {icon}
        </div>
      </div>
    </div>
  </Card>
);

// ── Section title ──────────────────────────────────────────────────────────
const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
    {icon && <span style={{ color: BRAND.gold, fontSize: '18px' }}>{icon}</span>}
    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: BRAND.textDark,
      fontFamily: 'Georgia, serif' }}>
      {children}
    </h3>
    <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${BRAND.gold}60, transparent)` }} />
  </div>
);

// ── Tooltip personnalisé ───────────────────────────────────────────────────
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: BRAND.textDark, borderRadius: '10px', padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)', border: `1px solid ${BRAND.blueMid}`,
    }}>
      {label && <p style={{ color: BRAND.textLight, fontSize: '11px', margin: '0 0 4px' }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || BRAND.gold, fontSize: '13px', fontWeight: 700, margin: 0 }}>
          {p.name ? `${p.name} : ` : ''}{p.value}
        </p>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.data) setStats(response.data);
    } catch {
      message.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <Spin size="large" />
    </div>
  );

  if (!stats) return <div>Erreur de chargement</div>;

  // ── Données pour les graphiques ─────────────────────────────────────────
  const genderMemberData = [
    { name: 'Hommes', value: stats.membersByGender.homme },
    { name: 'Femmes', value: stats.membersByGender.femme },
  ];
  const genderChildData = [
    { name: 'Garçons', value: stats.childrenByGender.homme },
    { name: 'Filles',  value: stats.childrenByGender.femme },
  ];

  const ageData = Object.entries(stats.membersByAge)
    .filter(([, v]) => v > 0)
    .map(([age, count]) => ({
      name: age === 'non_specifie' ? 'N/S' : `${age}`,
      value: count,
    }));

  const mariageData = Object.entries(stats.membersByMaritalStatus)
    .filter(([, v]) => v > 0)
    .map(([status, count]) => ({
      name: status === 'non_specifie' ? 'N/S' : status.replace('_', ' '),
      count,
    }));

  // Données fictives tendance mensuelle (à remplacer par vraies données si disponibles)
  const trendData = [
    { mois: 'Oct', membres: 0, enfants: 0 },
    { mois: 'Nov', membres: 0, enfants: 0 },
    { mois: 'Déc', membres: 0, enfants: 0 },
    { mois: 'Jan', membres: stats.newMembersThisMonth, enfants: stats.newChildrenThisMonth },
  ];

  const recentColumns = [
    {
      title: 'Nom & Prénoms',
      dataIndex: 'nomPrenoms',
      key: 'nomPrenoms',
      render: (v: string) => (
        <span style={{ fontWeight: 600, color: BRAND.textDark }}>{v}</span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag style={{
          background: type === 'member' ? `${BRAND.blue}15` : '#f0fdf4',
          color: type === 'member' ? BRAND.blue : '#16a34a',
          border: `1px solid ${type === 'member' ? `${BRAND.blue}40` : '#86efac'}`,
          borderRadius: '20px', fontWeight: 600, fontSize: '11px',
        }}>
          {type === 'member' ? 'Membre' : 'Enfant'}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span style={{ color: BRAND.textMid, fontSize: '13px' }}>
          {new Date(date).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
  ];

  const totalFlock = stats.totalMembers + stats.totalChildren;
  const newTotal   = stats.newMembersThisMonth + stats.newChildrenThisMonth;

  return (
    <div style={{ background: BRAND.bg, minHeight: '100vh', padding: '28px 24px', fontFamily: 'Georgia, serif' }}>

      {/* ── En-tête ── */}
      <div style={{
        background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.blueMid} 60%, ${BRAND.blueLight} 100%)`,
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '28px',
        boxShadow: `0 8px 32px ${BRAND.blue}40`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'rgba(255,185,0,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-50px', right: '120px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <Title level={3} style={{ color: '#fff', margin: 0, fontFamily: 'Georgia, serif' }}>
          Tableau de bord
        </Title>
        <Text style={{ color: 'rgba(255,185,0,0.9)', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Temple La Transfiguration — Espace Administration
        </Text>
        <div style={{ marginTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>COMMUNAUTÉ TOTALE</span>
            <div style={{ color: '#fff', fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>
              {totalFlock.toLocaleString('fr-FR')}
            </div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>NOUVEAUX CE MOIS</span>
            <div style={{ color: BRAND.gold, fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>
              +{newTotal}
            </div>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <Row gutter={[16, 16]} align="stretch" style={{ marginBottom: '28px' }}>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <KpiCard title="Membres adultes" value={stats.totalMembers}
            icon={<UserOutlined />} gradient={[BRAND.blue, BRAND.blueMid]} />
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <KpiCard title="Enfants (ECODIM)" value={stats.totalChildren}
            icon={<TeamOutlined />} gradient={['#0d9488', '#14b8a6']} />
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <KpiCard title="Nouveaux ce mois" value={newTotal}
            icon={<RiseOutlined />} gradient={[BRAND.gold, BRAND.goldLight]} trend="↑ Ce mois-ci" />
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <KpiCard title="Administrateurs" value={stats.totalUsers}
            icon={<TrophyOutlined />} gradient={['#7c3aed', '#a78bfa']} />
        </Col>
      </Row>

      {/* ── Répartition genre ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: '28px' }}>
        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(26,58,138,0.08)' }}>
            <SectionTitle icon={<ManOutlined />}>Genre — Membres</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={genderMemberData} cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {genderMemberData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS_GENDER[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {genderMemberData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%',
                        background: PIE_COLORS_GENDER[i] }} />
                      <Text style={{ color: BRAND.textMid, fontSize: '13px' }}>{d.name}</Text>
                    </div>
                    <Text style={{ fontWeight: 700, color: BRAND.textDark, fontSize: '16px' }}>{d.value}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(26,58,138,0.08)' }}>
            <SectionTitle icon={<WomanOutlined />}>Genre — Enfants</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={genderChildData} cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {genderChildData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS_GENDER[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {genderChildData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%',
                        background: PIE_COLORS_GENDER[i] }} />
                      <Text style={{ color: BRAND.textMid, fontSize: '13px' }}>{d.name}</Text>
                    </div>
                    <Text style={{ fontWeight: 700, color: BRAND.textDark, fontSize: '16px' }}>{d.value}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Âge + Situation matrimoniale ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: '28px' }}>
        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(26,58,138,0.08)' }}>
            <SectionTitle icon={<CalendarOutlined />}>Tranches d'âge — Membres</SectionTitle>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={ageData} cx="50%" cy="50%"
                  outerRadius={80} dataKey="value" label={({ name, percent }) =>
                    percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
                  }
                  labelLine={false}>
                  {ageData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS_AGE[i % PIE_COLORS_AGE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: BRAND.textMid }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(26,58,138,0.08)' }}>
            <SectionTitle>Situation matrimoniale</SectionTitle>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mariageData} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8edf8" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: BRAND.textMid }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: BRAND.textLight }}
                  axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Membres" radius={[6, 6, 0, 0]}>
                  {mariageData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLOR_MARIAGE[i % BAR_COLOR_MARIAGE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* ── Tendance mensuelle ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: '28px' }}>
        <Col xs={24}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(26,58,138,0.08)' }}>
            <SectionTitle icon={<RiseOutlined />}>Inscriptions mensuelles</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={BRAND.blueMid} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={BRAND.blueMid} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradChildren" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={BRAND.gold} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={BRAND.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8edf8" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: BRAND.textMid }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: BRAND.textLight }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="membres" name="Membres"
                  stroke={BRAND.blueMid} strokeWidth={2.5} fill="url(#gradMembers)" dot={{ r: 4, fill: BRAND.blueMid }} />
                <Area type="monotone" dataKey="enfants" name="Enfants"
                  stroke={BRAND.gold} strokeWidth={2.5} fill="url(#gradChildren)" dot={{ r: 4, fill: BRAND.gold }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* ── Dernières inscriptions ── */}
      <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(26,58,138,0.08)' }}>
        <SectionTitle icon={<CalendarOutlined />}>Dernières inscriptions</SectionTitle>
        <Table
          dataSource={stats.recentRegistrations}
          columns={recentColumns}
          rowKey="id"
          pagination={false}
          size="small"
          style={{ borderRadius: '12px', overflow: 'hidden' }}
          rowClassName={(_, i) => i % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        />
      </Card>

      <style>{`
        .table-row-light td { background: #fff !important; }
        .table-row-dark  td { background: #f8faff !important; }
        .ant-table-thead > tr > th {
          background: ${BRAND.blue} !important;
          color: #fff !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          letter-spacing: 0.5px !important;
          border: none !important;
        }
        .ant-table-thead > tr > th::before { display: none !important; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;