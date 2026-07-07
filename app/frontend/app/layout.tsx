
export const metadata = {
  title: 'BrewAI Cafe',
  description: 'A modern cafe shop experience with an AI chat popup and curated drinks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
        background:
          'radial-gradient(circle at top left, rgba(193, 141, 90, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(77, 46, 27, 0.14), transparent 24%), linear-gradient(180deg, #fffaf4 0%, #f5ede3 100%)',
        color: '#2f2118'
      }}>
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          padding: '18px 40px',
          background: 'rgba(255, 248, 240, 0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(141, 108, 79, 0.16)'
        }}>
          <a href="/" style={{ textDecoration: 'none', color: '#2f2118' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #6f3f1f 0%, #b57b45 100%)',
                color: '#fff',
                boxShadow: '0 12px 24px rgba(111, 63, 31, 0.25)'
              }}>
                ☕
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1 }}>BrewAI</div>
              </div>
            </div>
          </a>

          <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="/" style={{ textDecoration: 'none', color: '#4b3628', fontWeight: 600, padding: '10px 14px', borderRadius: '999px' }}>Home</a>
            <a href="/menu" style={{ textDecoration: 'none', color: '#4b3628', fontWeight: 600, padding: '10px 14px', borderRadius: '999px' }}>Menu</a>
            <a href="/track" style={{ textDecoration: 'none', color: '#4b3628', fontWeight: 600, padding: '10px 14px', borderRadius: '999px' }}>Track Order</a>
          </nav>
        </header>

        <main style={{ padding: '32px 24px 96px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}