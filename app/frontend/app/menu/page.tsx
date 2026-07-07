const MENU_ITEMS = [
  { name: 'Espresso', description: 'Bold single shot with a rich crema.', price: '$3.00' },
  { name: 'Caramel Macchiato', description: 'Velvety espresso with caramel and steamed milk.', price: '$5.50' },
  { name: 'Honey Almond Latte', description: 'Sweet, nutty, and silky with a warm finish.', price: '$5.90' },
  { name: 'Oat Milk Cold Brew', description: 'Smooth cold brew with oat milk over ice.', price: '$5.00' },
];

export default function MenuPage() {
  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
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
          House Menu
        </span>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 62px)', margin: '0 0 10px', color: '#2f2118' }}>Signature drinks and warm pastries</h1>
        <p style={{ color: '#6e5747', margin: 0, lineHeight: 1.7, maxWidth: '64ch' }}>
          A polished menu layout that matches the cafe storefront and keeps the browsing flow simple.
        </p>
      </div>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {MENU_ITEMS.map((item) => (
          <article
            key={item.name}
            style={{
              padding: '22px',
              borderRadius: '24px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,239,229,0.96) 100%)',
              border: '1px solid rgba(141, 108, 79, 0.14)',
              boxShadow: '0 16px 36px rgba(77, 46, 27, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 8px', color: '#2f2118', fontSize: '22px' }}>{item.name}</h2>
                <p style={{ margin: 0, color: '#6e5747', lineHeight: 1.7 }}>{item.description}</p>
              </div>
              <strong style={{ color: '#9b6237', whiteSpace: 'nowrap', fontSize: '18px' }}>{item.price}</strong>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}