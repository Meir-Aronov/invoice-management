import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import DataTablePage from './pages/DataTablePage';

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* תפריט צדדי */}
        <div className="w-1/5 bg-[#bccad6] p-4">
          <h1 className="text-xl font-bold mb-4">Menu</h1>
          <ul>
            <li><Link to="/">Upload CSV</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/data-table">Data Table</Link></li>
          </ul>
        </div>

        {/* תוכן מרכזי */}
        <div className="w-4/5 p-4">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/data-table" element={<DataTablePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
