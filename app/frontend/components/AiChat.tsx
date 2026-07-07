"use client";

import { useState } from 'react';

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside style={{
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      zIndex: 30,
      width: 'min(380px, calc(100vw - 40px))'
    }}>
      {isOpen ? (
        <div style={{
          borderRadius: '26px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,239,230,0.98) 100%)',
          border: '1px solid rgba(141, 108, 79, 0.18)',
          boxShadow: '0 24px 60px rgba(77, 46, 27, 0.24)',
          overflow: 'hidden',
          backdropFilter: 'blur(14px)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 18px',
            background: 'linear-gradient(135deg, #6f3f1f 0%, #a56b3f 100%)',
            color: '#fff'
          }}>
            <div>
              <div style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.84 }}>AI Barista</div>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>Ask BrewAI</div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.18)',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer'
              }}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div style={{ padding: '16px 18px 18px' }}>
            <div style={{
              padding: '14px 16px',
              borderRadius: '18px',
              backgroundColor: '#fff',
              border: '1px solid rgba(141, 108, 79, 0.16)',
              boxShadow: '0 10px 24px rgba(77, 46, 27, 0.06)'
            }}>
              <p style={{ margin: '0 0 10px', color: '#6e5747', lineHeight: 1.6 }}>
                Hello. I can help you choose a drink, explain the menu, or track an order.
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {['Best seller', 'Low caffeine', 'Oat milk'].map((item) => (
                  <span key={item} style={{ padding: '8px 10px', borderRadius: '999px', backgroundColor: '#f2e5d7', color: '#7b5433', fontSize: '12px', fontWeight: 700 }}>
                    {item}
                  </span>
                ))}
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '14px', backgroundColor: '#f7f1ea', color: '#473326' }}>
                  What should I get if I like sweet espresso drinks?
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '14px', backgroundColor: '#6f3f1f', color: '#fff', marginLeft: 'auto', maxWidth: '85%' }}>
                  Try the Honey Almond Latte or the Caramel Macchiato.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <input
                  type="text"
                  placeholder="Ask the AI barista..."
                  style={{
                    flex: 1,
                    border: '1px solid rgba(141, 108, 79, 0.22)',
                    borderRadius: '999px',
                    padding: '12px 14px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  style={{
                    border: 'none',
                    borderRadius: '999px',
                    padding: '0 16px',
                    background: 'linear-gradient(135deg, #6f3f1f 0%, #9b6237 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            border: 'none',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #6f3f1f 0%, #a56b3f 100%)',
            color: '#fff',
            boxShadow: '0 18px 36px rgba(77, 46, 27, 0.28)',
            cursor: 'pointer',
            fontWeight: 800
          }}
          aria-label="Open chat"
        >
          <span style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)' }}>✦</span>
          Chat with BrewAI
        </button>
      )}
    </aside>
  );
}