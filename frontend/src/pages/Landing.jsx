import React, { useState } from 'react';

// Custom SVG Icons matching the Dispatch theme
const LandingIcons = {
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', opacity: 0.7 }}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  Profile: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )
};

function Landing({ onSignUpToDrive, onScheduleDelivery, onSignIn, onSignUp, isLoggedIn, onGoToDashboard, onLogout }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const industries = [
    {
      name: '🥦 Groceries & Supermarkets',
      short: 'Real-time retail inventory deliveries',
      desc: 'Our dispatcher handles high-volume supermarket deliveries. Perfect for grocery stores that need quick distribution of fresh food, vegetables, and pantry items to customers within minutes.'
    },
    {
      name: '🍔 Food & Restaurants',
      short: 'Instant hot meal dispatching',
      desc: 'Enables instant assignment of hot meals to nearby riders, ensuring thermal bag delivery constraints are met and orders arrive hot and fresh.'
    },
    {
      name: '💊 Pharmacy & Healthcare',
      short: 'Priority urgent medical transport',
      desc: 'Highly critical medical supplies, prescriptions, and diagnostics are routed with maximum priority. Utilizes the emergency dispatch pipeline for zero delay.'
    },
    {
      name: '📦 E-Commerce & Retail',
      short: 'Local store-to-door checkouts',
      desc: 'Bridge the gap between online checkouts and the front door. We route multi-stop packages to optimize delivery paths for retail couriers.'
    },
    {
      name: '📄 Documents & Couriers',
      short: 'Secure signature-verified handovers',
      desc: 'For confidential papers, contracts, or high-value items requiring secure handling. Fully backed by OTP security to ensure the right person receives the package.'
    }
  ];

  const features = [
    {
      name: '⚡ Instant Routing',
      short: 'Immediate courier matching and route optimization',
      desc: 'Book a courier to be dispatched immediately. Our intelligent routing engine searches for the closest available driver, checks their workload, and assigns the order instantly.'
    },
    {
      name: '📅 Scheduled Deliveries',
      short: 'Choose future date/time for bookings',
      desc: 'Schedule a delivery for any future date and time. The platform holds the order in a scheduled state and automatically activates it at the precise moment to assign to nearby riders.'
    },
    {
      name: '🚨 Emergency Priority',
      short: 'Flag urgent medicines or critical packages',
      desc: 'An urgent delivery mode specifically designed for emergency items. Bypasses standard queues, alerts all active riders with high-visibility warning indicators, and requests immediate accept/decline.'
    },
    {
      name: '🔑 Secure OTP Handover',
      short: 'Rider verifies delivery using a passcode',
      desc: 'Prevents package theft and ensures secure handovers. The customer receives a unique 4-digit OTP when booking, which must be keyed in and verified by the rider upon delivery.'
    },
    {
      name: '🤖 Auto-Assign Engine',
      short: 'Intelligent round-robin retry and alerts',
      desc: 'When an order is created, the system notifies matching riders in turn. If a rider does not respond in time or declines, the system automatically escalates to the next nearest rider.'
    },
    {
      name: '🗺️ Map-Based Tracking',
      short: 'Interactive map visualization with dynamic routes',
      desc: 'See real-time rider locations, starting coordinates, destination coordinates, and color-coded paths drawn dynamically on an interactive map of Hyderabad.'
    }
  ];

  const roles = [
    {
      name: '👤 Customer Console',
      short: 'Book instant or scheduled deliveries and track orders',
      desc: 'The portal designed for dispatchers and businesses to place orders, choose scheduled or emergency delivery flags, monitor dispatch status, and obtain delivery OTPs.'
    },
    {
      name: '🏍️ Rider Portal',
      short: 'Accept job offers, view routing, and complete OTPs',
      desc: 'The mobile-optimized interface for courier drivers. Shows incoming job offers with pick-up/drop-off details, route directions, and the OTP verification portal for completing handovers.'
    },
    {
      name: '👑 Admin Control Room',
      short: 'Oversee active orders, monitor riders, and check logs',
      desc: 'The supervisor dashboard. Shows a comprehensive live status panel of all orders, rider availability status (online/offline/busy), real-time map positions, and raw system activity logs.'
    }
  ];

  return (
    <div className="landing-container">
      {/* Landing Header */}
      <header className="landing-header">
        <div className="landing-logo" style={{ cursor: 'default' }}>
          {/* Brand Logo matching dark mock */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: '900',
            fontSize: '1.2rem',
            boxShadow: '0 4px 10px rgba(14, 165, 233, 0.25)'
          }}>
            H
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
            Hyperlocal Delivery
          </span>
        </div>

        {/* Top Navbar */}
        <nav className="landing-nav" style={{ position: 'relative', display: 'flex', gap: '24px' }}>
          {/* Industries Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveDropdown('industries')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="landing-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Industries <LandingIcons.ChevronDown />
            </span>
            {activeDropdown === 'industries' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '-80px',
                width: '280px',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: 'var(--shadow-premium)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 1000,
                marginTop: '8px'
              }}>
                <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>Supplying Markets</div>
                {industries.map((item, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', borderRadius: '8px', transition: 'all 0.2s', cursor: 'pointer' }}
                       onClick={() => setSelectedDetail({ ...item, type: 'industry' })}
                       onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                       onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.short}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveDropdown('features')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="landing-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Features <LandingIcons.ChevronDown />
            </span>
            {activeDropdown === 'features' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '-80px',
                width: '280px',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: 'var(--shadow-premium)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 1000,
                marginTop: '8px'
              }}>
                <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>Capabilities</div>
                {features.map((item, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', borderRadius: '8px', transition: 'all 0.2s', cursor: 'pointer' }}
                       onClick={() => setSelectedDetail({ ...item, type: 'feature' })}
                       onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                       onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.short}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Roles Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveDropdown('roles')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="landing-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              System Roles <LandingIcons.ChevronDown />
            </span>
            {activeDropdown === 'roles' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '-80px',
                width: '280px',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: 'var(--shadow-premium)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 1000,
                marginTop: '8px'
              }}>
                <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>Access Terminals</div>
                {roles.map((item, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', borderRadius: '8px', transition: 'all 0.2s', cursor: 'pointer' }}
                       onClick={() => setSelectedDetail({ ...item, type: 'role' })}
                       onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                       onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.short}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="landing-actions">
          {isLoggedIn ? (
            <>
              <button className="btn-landing-primary" onClick={onGoToDashboard}>
                Go to Dashboard
              </button>
              <button className="btn-landing-secondary" style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn-landing-primary" onClick={onSignUpToDrive}>
                Sign Up to Drive
              </button>
              <button className="btn-landing-secondary" onClick={onScheduleDelivery}>
                Schedule a Delivery
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-hero">
        <div className="hero-left">
          <h1 className="hero-title">
            Delivery Intelligence Redefined
          </h1>
          <p className="hero-subtitle">
            Hyperlocal Delivery is the orchestration engine behind modern delivery logistics — an AI-powered platform with a national driver network, built to give businesses control, confidence, and complete visibility over the last mile.
          </p>
          <div className="hero-buttons">
            <button className="btn-landing-primary" style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '8px' }} onClick={onScheduleDelivery}>
              Book a Delivery
            </button>
            <button 
              className="btn-landing-secondary" 
              style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              onClick={isLoggedIn ? onGoToDashboard : onSignUp}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              Get a Quote
            </button>
          </div>
        </div>

        <div className="hero-right" style={{ padding: '24px' }}>
          {/* Map Grid Blueprint lines */}
          <div className="map-mockup"></div>
          
          {/* Glowing Isometric 3D Logistics Image Graphic */}
          <img 
            src="/3d_logistics_glow.png" 
            alt="3D Holographic Logistics Box" 
            style={{
              width: '100%',
              maxHeight: '380px',
              objectFit: 'contain',
              zIndex: 2,
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(14, 165, 233, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          />
        </div>
      </main>

      {/* Glassmorphism Detail Modal */}
      {selectedDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '24px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: 'var(--shadow-premium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setSelectedDetail(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1.25rem'
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: '2.5rem', alignSelf: 'flex-start' }}>
              {selectedDetail.name.split(' ')[0]}
            </div>

            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                {selectedDetail.name.replace(/^[^\s]+\s+/, '')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {selectedDetail.short}
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {selectedDetail.desc}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                className="btn-landing-primary" 
                style={{ flex: 1, padding: '12px', cursor: 'pointer' }}
                onClick={() => {
                  const detailType = selectedDetail.type;
                  setSelectedDetail(null);
                  if (detailType === 'role') {
                    if (selectedDetail.name.includes('Rider')) {
                      onSignUpToDrive();
                    } else if (selectedDetail.name.includes('Customer')) {
                      onScheduleDelivery();
                    } else {
                      onSignIn();
                    }
                  } else {
                    onScheduleDelivery();
                  }
                }}
              >
                {selectedDetail.type === 'role' ? 'Access Portal' : 'Book Delivery Now'}
              </button>
              <button 
                className="btn-landing-secondary" 
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '12px 20px', cursor: 'pointer' }}
                onClick={() => setSelectedDetail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
