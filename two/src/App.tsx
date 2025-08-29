import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IndexPage from './pages/index';
import { SPCatchProvider } from './context/SPCatchContext';

const App: React.FC = () => {
  return (
    <SPCatchProvider>
      <Routes>
        <Route path='/' element={<IndexPage />} />
      </Routes>
    </SPCatchProvider>
  );
};

export default App;
