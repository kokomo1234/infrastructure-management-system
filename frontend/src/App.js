import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TDLManager from './components/TDLManager';
import TSFManager from './components/TSFManager';
import ACManager from './components/ACManager';
import DCManager from './components/DCManager';
import HVACManager from './components/HVACManager';
import GenTswManager from './components/GenTswManager';
import AutreManager from './components/AutreManager';
import BesoinManager from './components/BesoinManager';
import FournisseursManager from './components/FournisseursManager';
import FabricantManager from './components/FabricantManager';
// Performance: Lazy load location components
import TDLList from './components/TDLList';
import TSFList from './components/TSFList';
import TDLDetail from './components/TDLDetail';
import TSFDetail from './components/TSFDetail';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Container fluid className="mt-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                
                {/* Location Routes - Performance Optimized */}
                <Route path="/locations/tdl" element={<TDLList />} />
                <Route path="/locations/tsf" element={<TSFList />} />
                <Route path="/tdl/:id" element={<TDLDetail />} />
                <Route path="/tsf/:id" element={<TSFDetail />} />
                
                {/* Management Routes */}
                <Route path="/tdl" element={<TDLManager />} />
                <Route path="/tsf" element={<TSFManager />} />
                <Route path="/ac" element={<ACManager />} />
                <Route path="/dc" element={<DCManager />} />
                <Route path="/hvac" element={<HVACManager />} />
                <Route path="/gen-tsw" element={<GenTswManager />} />
                <Route path="/autre" element={<AutreManager />} />
                <Route path="/besoin" element={<BesoinManager />} />
                <Route path="/fournisseurs" element={<FournisseursManager />} />
                <Route path="/fabricant" element={<FabricantManager />} />
              </Routes>
            </Container>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
