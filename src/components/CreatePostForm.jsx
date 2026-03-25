import { useState } from 'react';
import { Form, Button, Card, Image, Alert } from 'react-bootstrap';
import { Image as ImageIcon, X } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePostForm = () => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <h5 className="mb-4">Create New Post</h5>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          {previewUrl && (
            <div className="position-relative mb-3 rounded overflow-hidden border" style={{ maxWidth: '200px' }}>
              <Image src={previewUrl} fluid />
              <Button 
                variant="danger" 
                size="sm" 
                className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
                onClick={removeImage}
              >
                <X size={14} />
              </Button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <div className="position-relative">
              <input 
                type="file" 
                id="post-image"
                className="d-none"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label htmlFor="post-image" className="btn btn-outline-secondary btn-sm d-flex align-items-center">
                <ImageIcon size={18} className="me-2" />
                Add Image
              </label>
            </div>
            
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreatePostForm;
