import React, { useState } from 'react';
import './App.css';

function App() {
  const [page, setPage] = useState('home');

  const navigateTo = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React SPA Demo</h1>
        <nav>
          <button onClick={() => navigateTo('home')}>Home</button>
          <button onClick={() => navigateTo('about')}>About</button>
          <button onClick={() => navigateTo('contact')}>Contact</button>
        </nav>
      </header>
      <main>
        {page === 'home' && (
          <div>
            <h2>Home Page</h2>
            <p>Welcome to the home page!</p>
          </div>
        )}
        {page === 'about' && (
          <div>
            <h2>About Page</h2>
            <p>This is a simple React Single Page Application (SPA) demo.</p>
          </div>
        )}
        {page === 'contact' && (
          <div>
            <h2>Contact Page</h2>
            <p>Feel free to reach out to us!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
