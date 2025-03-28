import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import PlannerPage from './pages/PlannerPage';
import AssetsPage from './pages/AssetsPage';
// import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
// Changes in app.js
  function App() {
    return (
      <Router>
        {/* Navigation Bar */}
        <nav className="p-4 bg-gray-800 text-white flex gap-4">
          <Link to="/planner">Planner</Link>
          <Link to="/assets">Assets</Link>
        </nav>
  
        {/* Route Definitions */}
        <Routes>
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/assets" element={<AssetsPage />} />
        </Routes>
      </Router>
    );
  }
  
export default App;
