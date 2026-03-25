import { Container, Row, Col } from 'react-bootstrap';
import CreatePostForm from '../components/CreatePostForm';

const CreatePostPage = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <CreatePostForm />
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePostPage;
