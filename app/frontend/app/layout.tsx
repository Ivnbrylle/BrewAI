import React from 'react';

export const metadata = {
  title: 'BrewAI - Cloud-Native AI Coffee Shop',
  description: 'Order premium espresso blends managed by intelligent transactional AI agents.',
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
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#fbf9f6',
        color: '#38322e'
      }}>
        {/* Global Navigation Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #ebdcd0'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c1d11' }}>
            ☕ Brew<span style={{ color: '#8e7355' }}>AI</span>
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <a href="/" style={{ textDecoration: 'none', color: '#61554d', fontWeight: 500 }}>Home</a>
            <a href="/menu" style={{ textDecoration: 'none', color: '#61554d', fontWeight: 500 }}>Menu</a>
            <a href="/track" style={{ textDecoration: 'none', color: '#61554d', fontWeight: 500 }}>Track Order</a>
          </nav>
        </header>

        {/* Dynamic Page Content Injector */}
        <main style={{ padding: '40px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}