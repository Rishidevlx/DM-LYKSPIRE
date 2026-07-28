import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BlogList from './pages/BlogList';
import BlogEditor from './pages/BlogEditor';
import BlogCategories from './pages/BlogCategories';
import ContactEnquiries from './pages/ContactEnquiries';
import ClientsAdmin from './pages/ClientsAdmin';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/new" element={<BlogEditor />} />
            <Route path="/blogs/edit/:id" element={<BlogEditor />} />
            <Route path="/blogs/categories" element={<BlogCategories />} />
            <Route path="/contacts" element={<ContactEnquiries />} />
            <Route path="/clients" element={<ClientsAdmin />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
