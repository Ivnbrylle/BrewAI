import React from 'react';
import AiChat from '../components/AiChat';

export default function HomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: '#2c1d11', marginBottom: '16px' }}>
        Welcome to the Future of Coffee Crafting
      </h1>
      <p style={{ fontSize: '18px', color: '#705e52', lineHeight: '1.6', marginBottom: '40px' }}>
        BrewAI combines high-end artisan bean sourcing with automated cloud-native microservices. 
        Browse our dynamic menu online or let our intelligent transactional AI agent curate and 
        assemble your coffee basket right inside the chat bubble.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <a href="/menu" style={{ backgroundColor: '#2c1d11', color: '#ffffff', textDecoration: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold' }}>
          View Digital Menu
        </a>
        <a href="/track" style={{ backgroundColor: '#ffffff', color: '#2c1d11', border: '1px solid #2c1d11', textDecoration: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold' }}>
          Track Existing Order
        </a>
      </div>

      {/* Persistent conversational component overlay */}
      <AiChat />
    </div>
  );
}