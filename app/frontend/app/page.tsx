"use client";
import React from 'react';
import DraggableAIPopup from '../components/DraggableAIPopup';

export default function HomePage() {
  const images = [
    '/modern_cafe_interior_1783423238782.jpg',
    '/latte_art_coffee_1783423248294.jpg',
    '/cafe_pastries_display_1783423258736.jpg'
  ];

  return (
    <div style={{ margin: 0, padding: 0, overflowX: 'hidden', fontFamily: 'Inter, sans-serif', backgroundColor: '#fdfbf7', color: '#332722' }}>
      {/* Hero Section */}
      <section style={{ height: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Looping Image Background (Crossfade) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
           <style>{`
             @keyframes crossfade {
               0%, 25% { opacity: 1; }
               33%, 92% { opacity: 0; }
               100% { opacity: 1; }
             }
             .carousel-img {
               position: absolute;
               top: 0; left: 0; width: 100%; height: 100%;
               object-fit: cover;
               opacity: 0;
             }
             .img-1 { animation: crossfade 15s infinite; animation-delay: 0s; }
             .img-2 { animation: crossfade 15s infinite; animation-delay: 5s; }
             .img-3 { animation: crossfade 15s infinite; animation-delay: 10s; }
           `}</style>
           <img src={images[0]} className="carousel-img img-1" alt="Cafe interior" />
           <img src={images[1]} className="carousel-img img-2" alt="Latte art" />
           <img src={images[2]} className="carousel-img img-3" alt="Pastries" />
           {/* Dark overlay for text readability */}
           <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1 }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontSize: '6rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.03em', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            BrewAI
          </h1>
          <p style={{ fontSize: '1.6rem', color: '#f8f8f8', maxWidth: '650px', margin: '20px auto 40px', fontWeight: 300, lineHeight: 1.5, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Experience coffee reimagined. Modern aesthetics, exquisite taste, and your personal AI barista ready to serve.
          </p>
          <a href="#about" style={{ 
            display: 'inline-block', padding: '18px 45px', backgroundColor: '#fff', color: '#000', 
            textDecoration: 'none', borderRadius: '40px', fontWeight: 600, fontSize: '1.1rem', 
            transition: 'transform 0.2s, boxShadow 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' 
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Discover More
          </a>
        </div>
      </section>


      <DraggableAIPopup />
    </div>
  );
}