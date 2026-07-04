'use client';
import React, { useState } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! I am your BrewAI assistant. I can answer ingredient questions or take your order. What can I get started for you?' }
  ]);
  const [input, setInput] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    try {
      // 1. Send text context over to our backend intent processor
      const response = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ special_instructions: `AI Chat Request: ${userMsg}` })
      });
      
      const data = await response.json();
      
      // Simulating standard transaction pipeline routing matching agent.py intent predictions
      if (userMsg.toLowerCase().includes('confirm') || userMsg.toLowerCase().includes('checkout')) {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Processing your mock checkout... Success! Your order is route to the kitchen terminal. You can pay at the counter.' }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: `I've registered your order intent! I created basket #${data.id || 1}. Would you like me to confirm this order for you?` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'I recorded your request locally! (Connect my backend service endpoints to view live database state transitions)' }]);
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: '30px', right: '30px', width: '350px', height: '450px',
      backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #ebdcd0',
      boxShadow: '0 8px 24px rgba(44,29,17,0.12)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{ backgroundColor: '#2c1d11', color: '#ffffff', padding: '15px', fontWeight: 'bold' }}>
        🤖 BrewAI Conversational Assistant
      </div>
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#8e7355' : '#f3ede6',
            color: msg.sender === 'user' ? '#ffffff' : '#38322e',
            padding: '10px 14px', borderRadius: '8px', maxWidth: '80%', fontSize: '14px'
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #ebdcd0', padding: '10px' }}>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a question or place an order..." 
          style={{ flex: 1, padding: '8px', border: '1px solid #ebdcd0', borderRadius: '6px', outline: 'none' }}
        />
        <button onClick={handleSendMessage} style={{ marginLeft: '8px', backgroundColor: '#2c1d11', color: '#ffffff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
          Send
        </button>
      </div>
    </div>
  );
}