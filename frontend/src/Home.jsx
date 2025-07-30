import React from 'react';
import { ReactTyped } from 'react-typed';
import { transform } from 'typescript';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div
      className="min-vh-100 w-100 d-flex align-items-center justify-content-center position-relative overflow-hidden py-5"
      style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff, #e2e8f0)' }} // approximate gradient bg
    >
      
      

      <div className="container text-center position-relative px-3" style={{ zIndex: 1, maxWidth: '64rem' }}>
        <div className="mb-4"
          style={{transform: 'scale(1.3)'}}>
          <div
            className="fw-light text-secondary fs-3 fs-md-1"
            style={{
              letterSpacing: '.1em',
              transition: 'transform 0.3s',
              display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Here
          </div>
          <br />
          <div
            className="fw-light text-secondary fs-3 fs-md-1"
            style={{
              letterSpacing: '.1em',
              transition: 'transform 0.3s',
              display: 'inline-block',
              transitionDelay: '0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Is The
          </div>
        </div>

        
        <h1
          className="fw-bold display-4 mb-1"
          style={{
            background:
              'linear-gradient(to right, #1f2937, #374151, #1f2937)', // gray/ slate gradient approx
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'transform 0.5s',
            cursor: 'default',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Data Visualization
        </h1>
        <h2
          className="fw-bold display-4 mt-1"
          style={{
            background:
              'linear-gradient(to right, #1f2937, #374151, #1f2937)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'transform 0.5s',
            transitionDelay: '75ms',
            cursor: 'default',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Dashboard
        </h2>

        <div
          className="mx-auto my-4"
          style={{
            width: '8rem',
            height: '0.25rem',
            background:
              'linear-gradient(to right, transparent, #d1d5db, transparent)',
            animation: 'pulse 2s infinite',
            borderRadius: '0.125rem',
          }}
        ></div>

        <div className="d-inline-flex align-items-center bg-white bg-opacity-50 rounded-pill px-4 py-2 border border-secondary shadow-sm mb-5 "
        style={{transform:'scale(1.33)'}}>
          <span className="fs-5 text-secondary me-3 fw-medium">Built with</span>
          <ReactTyped
            className="fs-5 fw-bold text-dark text-start"
            strings={['MERN', 'Bootstrap', 'Chart.js']}
            typeSpeed={80}
            backSpeed={50}
            backDelay={2000}
            loop={true}
            style={{ minWidth: '7.5rem' }}
          />
        </div>

        <div className="d-flex flex-column align-items-center gap-3">
          <Link to="/dashboard" className="text-decoration-none">
          <button
            type="button"
            className="btn btn-dark btn-lg rounded-3 fw-semibold shadow-lg px-5 py-3 border-2 border-transparent"
            style={{ transition: 'all 0.3s ease' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1e293b'; // darker slate
              e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
              e.currentTarget.style.borderColor = '#475569';
              e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            Explore Dashboard
          </button>
          </Link>
        </div>
      </div>

      {/* CSS keyframes for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

export default Home;
