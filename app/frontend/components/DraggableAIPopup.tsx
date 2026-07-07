"use client";
import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { MessageSquare, X, Send } from 'lucide-react';

const DraggableComponent = Draggable as any;

export default function DraggableAIPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Hi there! I am your AI Barista. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const nodeRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    
    try {
      const response = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, my backend is currently offline. Please try again later!' }]);
    }
  };

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '40px', right: '40px', width: '60px', height: '60px',
          backgroundColor: '#000', color: '#fff', borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000,
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageSquare size={24} />
      </div>
    );
  }

  return (
    <DraggableComponent handle=".chat-header" bounds="parent" nodeRef={nodeRef}>
      <div ref={nodeRef} style={{
        position: 'fixed', top: '100px', right: '100px', width: '360px', height: '550px',
        backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000,
        border: '1px solid rgba(0,0,0,0.08)'
      }}>
        {/* Header */}
        <div className="chat-header" style={{
          padding: '20px', backgroundColor: '#fafafa', borderBottom: '1px solid #eaeaea',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'grab'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#4CAF50', borderRadius: '50%', boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)' }} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#333' }}>AI Barista</span>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
            <X size={20} color="#888" />
          </button>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fff' }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: m.role === 'user' ? '#000' : '#f4f4f4',
              color: m.role === 'user' ? '#fff' : '#333',
              padding: '14px 18px', borderRadius: '20px', maxWidth: '85%',
              lineHeight: 1.5, fontSize: '0.95rem',
              borderBottomRightRadius: m.role === 'user' ? '4px' : '20px',
              borderBottomLeftRadius: m.role === 'ai' ? '4px' : '20px'
            }}>
              {m.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div style={{ padding: '15px 20px', borderTop: '1px solid #eaeaea', display: 'flex', gap: '12px', backgroundColor: '#fafafa' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '12px 18px', borderRadius: '30px', border: '1px solid #ddd', outline: 'none', fontSize: '0.95rem' }}
          />
          <button onClick={handleSend} style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#000', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000'}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </DraggableComponent>
  );
}
