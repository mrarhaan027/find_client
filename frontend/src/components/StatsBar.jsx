const StatsBar = ({ stats = { total: 0, pending: 0, interested: 0, not_interested: 0 } }) => {
  const statsData = [
    {
      label: 'Total Leads',
      icon: 'groups',
      iconColor: '#c9a84c',
      value: stats.total,
      trend: 'All time',
      trendColor: '#755b00',
      showTrendArrow: false,
    },
    {
      label: 'Pending',
      icon: 'schedule',
      iconColor: '#d97706',
      value: stats.pending,
      trend: 'Requires attention',
      trendColor: '#6b7280',
      showTrendArrow: false,
    },
    {
      label: 'Interested',
      icon: 'thumb_up',
      iconColor: '#059669',
      value: stats.interested,
      trend: 'Hot leads',
      trendColor: '#059669',
      showTrendArrow: false,
    },
    {
      label: 'Not Interested',
      icon: 'thumb_down',
      iconColor: '#dc2626',
      value: stats.not_interested,
      trend: 'Archived',
      trendColor: '#6b7280',
      showTrendArrow: false,
    },
  ];
  return (
    <>
    <div
      className="scrollbar-hide stats-bar-container"
      style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '4px',
        scrollSnapType: 'x mandatory',
      }}
    >
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="glass-card stat-card"
          style={{
            minWidth: '220px',
            flexShrink: 0,
            scrollSnapAlign: 'start',
            borderRadius: '12px',
            padding: '20px 24px',
            position: 'relative',
            overflow: 'hidden',
            marginLeft: index === 0 ? '5px' : '0',
          }}
        >
          {/* Label Row */}
          <div className="stat-label-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              {stat.label}
            </span>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '22px',
                color: stat.iconColor,
                fontVariationSettings: "'FILL' 1",
              }}
            >
              {stat.icon}
            </span>
          </div>

          {/* Value */}
          <div
            className="stat-value"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--text-main)',
              lineHeight: 1.1,
              marginBottom: '8px',
            }}
          >
            {stat.value}
          </div>

          {/* Trend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {stat.showTrendArrow && (
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '15px', color: stat.trendColor }}
              >
                trending_up
              </span>
            )}
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                color: stat.trendColor,
              }}
            >
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
    <style>{`
      .stat-card {
        padding: 20px 24px !important;
      }
      @media (max-width: 767px) {
        .stat-card {
          min-width: 180px !important;
          padding: 12px 16px !important;
        }
        .stat-label-row {
          margin-bottom: 8px !important;
        }
        .stat-value {
          font-size: 24px !important;
          margin-bottom: 4px !important;
        }
        .stats-bar-container {
          margin-bottom: 12px !important;
        }
      }
    `}</style>
    </>
  );
};

export default StatsBar;
