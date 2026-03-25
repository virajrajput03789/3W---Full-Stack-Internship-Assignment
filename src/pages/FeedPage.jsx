import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const FeedPage = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const response = await api.get(`/api/posts?page=${pageNum}&limit=10`);
      const newPosts = response.data;
      
      if (newPosts.length < 10) setHasMore(false);
      
      if (isLoadMore) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLikeToggle = async (postId) => {
    // Optimistic UI update
    setPosts(prevPosts => prevPosts.map(post => {
      if (post._id === postId) {
        const isCurrentlyLiked = post.likes?.some(l => l.username === user?.username);
        if (isCurrentlyLiked) {
          return {
            ...post,
            likes: post.likes.filter(l => l.username !== user?.username)
          };
        } else {
          return {
            ...post,
            likes: [...(post.likes || []), { username: user?.username }]
          };
        }
      }
      return post;
    }));

    try {
      await api.post(`/api/posts/${postId}/like`);
    } catch (err) {
      // Revert on failure
      fetchPosts(page);
      console.error('Like toggle failed', err);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  if (loading && page === 1) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading feed...</p>
      </div>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              onLikeToggle={handleLikeToggle}
            />
          ))}

          {hasMore && (
            <div className="text-center my-4">
              <Button 
                variant="outline-primary" 
                onClick={handleLoadMore} 
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Loading...
                  </>
                ) : 'Load More'}
              </Button>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-muted my-4">No more posts to show.</p>
          )}

          {posts.length === 0 && !loading && (
            <div className="text-center py-5 bg-white rounded shadow-sm">
              <h5>No posts yet</h5>
              <p className="text-muted">Be the first one to share something!</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FeedPage;
