export default function TrackPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{
          display: 'inline-flex',
          padding: '8px 14px',
          borderRadius: '999px',
          backgroundColor: '#f2e5d7',
          color: '#7b5433',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '14px'
        }}>
          Pickup status
        </span>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 62px)', margin: '0 0 10px', color: '#2f2118' }}>Track your brew</h1>
        <p style={{ color: '#6e5747', lineHeight: 1.7, margin: 0, maxWidth: '60ch' }}>
          A warm order-tracking screen that fits the same cafe aesthetic as the rest of the site.
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '18px'
      }}>
        <article style={{ padding: '24px', borderRadius: '24px', background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,239,229,0.96) 100%)', border: '1px solid rgba(141, 108, 79, 0.14)', boxShadow: '0 16px 36px rgba(77, 46, 27, 0.08)' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#2f2118' }}>
            Order ID
          </label>
          <input
            type="text"
            placeholder="Enter your order number"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(141, 108, 79, 0.22)',
              fontSize: '16px',
              boxSizing: 'border-box',
              backgroundColor: '#fff'
            }}
          />
          <button type="button" style={{ marginTop: '14px', width: '100%', border: 'none', borderRadius: '999px', padding: '14px 18px', background: 'linear-gradient(135deg, #6f3f1f 0%, #9b6237 100%)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            Check status
          </button>
        </article>

        <article style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.72)', border: '1px solid rgba(141, 108, 79, 0.14)', boxShadow: '0 16px 36px rgba(77, 46, 27, 0.08)' }}>
          <h2 style={{ margin: '0 0 12px', color: '#2f2118' }}>Current flow</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {['Order received', 'Brewing started', 'Ready for pickup'].map((step, index) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', backgroundColor: index === 1 ? '#f2e5d7' : '#fff' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: '#6f3f1f', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                  {index + 1}
                </div>
                <span style={{ color: '#4b3628', fontWeight: 600 }}>{step}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}