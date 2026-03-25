import { Navbar as BNavbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusSquare, Layout } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <BNavbar bg="white" expand="lg" className="border-bottom sticky-top">
      <Container>
        <BNavbar.Brand as={Link} to="/feed" className="fw-bold text-primary">
          SocialApp
        </BNavbar.Brand>
        <BNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/feed" className="d-flex align-items-center">
              <Layout size={18} className="me-1" /> Feed
            </Nav.Link>
            <Nav.Link as={Link} to="/create" className="d-flex align-items-center">
              <PlusSquare size={18} className="me-1" /> Create
            </Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            <span className="me-3 text-muted">Hi, {user.username}</span>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <LogOut size={16} className="me-1" /> Logout
            </Button>
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};

export default Navbar;
