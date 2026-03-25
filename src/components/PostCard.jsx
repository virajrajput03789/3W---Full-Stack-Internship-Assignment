import { useState, useContext } from 'react';
import { Card, Button, Form, Collapse } from 'react-bootstrap';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const PostCard = ({ post, onLikeToggle }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await api.post(`/api/posts/${post._id}/comments`, { text: commentText });
      setComments([...comments, response.data]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div className="avatar-initials me-2">
            {getInitials(post.user?.username)}
          </div>
          <div>
            <div className="fw-bold">{post.user?.username}</div>
            <small className="text-muted">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </small>
          </div>
        </div>

        <Card.Text>{post.content}</Card.Text>

        {post.image && (
          <div className="mb-3 rounded overflow-hidden border">
            <img 
              src={post.image} 
              alt="Post" 
              className="img-fluid w-100" 
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="d-flex gap-3 border-top pt-3">
          <Button 
            variant="link" 
            className={`p-0 text-decoration-none d-flex align-items-center ${post.likes.some(l => l.username === currentUser?.username) ? 'text-danger' : 'text-muted'}`}
            onClick={() => onLikeToggle(post._id)}
          >
            <Heart size={20} fill={post.likes.some(l => l.username === currentUser?.username) ? 'currentColor' : 'none'} className="me-1" />
            {post.likes.length || 0}
          </Button>
          <Button 
            variant="link" 
            className="p-0 text-decoration-none d-flex align-items-center text-muted"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={20} className="me-1" />
            {comments.length}
          </Button>
        </div>

        <Collapse in={showComments}>
          <div className="mt-3">
            <div className="comments-list mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {comments.map((comment, index) => (
                <div key={index} className="bg-light p-2 rounded mb-2 small">
                  <strong>{comment.user?.username}</strong>: {comment.text}
                </div>
              ))}
            </div>
            
            <Form onSubmit={handleAddComment} className="d-flex gap-2">
              <Form.Control 
                size="sm"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" variant="primary" size="sm">
                <Send size={14} />
              </Button>
            </Form>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
