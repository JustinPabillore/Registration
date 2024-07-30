import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './Registration';
import './index.css';
import '@fontsource/poppins'; // Default weight (400)
import '@fontsource/poppins/700.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// use "/" to make starting screen default
