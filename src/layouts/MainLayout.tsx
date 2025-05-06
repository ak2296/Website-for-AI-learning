import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </nav>
      </header>
      <main>
        {/* This Outlet renders the matched child routes */}
        <Outlet />
      </main>
      <footer>
        <p>© 2025 Your Website</p>
      </footer>
    </div>
  );
}
