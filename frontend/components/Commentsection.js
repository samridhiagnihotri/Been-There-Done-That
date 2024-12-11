import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Commentsection = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [replyTo, setReplyTo] = useState(null); // ID of comment being replied to

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [postId]);

  // Handle Cloudinary image upload
  const handleImageUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'your-cloudinary-cloud-name',
        uploadPreset: 'your-upload-preset',
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setImageUrl(result.info.secure_url); // Store uploaded image URL
        }
      }
    );
    widget.open();
  };

  // Handle comment submission (both top-level and replies)
  const handleSubmit = async () => {
    try {
      const payload = {
        content: newComment,
        parentId: replyTo, // If replying, otherwise null
      };
      if (imageUrl) {
        payload.imageUrl = imageUrl; // Attach image URL to the comment
      }

      const response = await axios.post(`/api/comments/${postId}`, payload, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Assuming user authentication token
        },
      });

      setNewComment(''); // Clear input
      setImageUrl(''); // Clear image
      setReplyTo(null); // Reset replyTo
      setComments([response.data, ...comments]); // Add the new comment to the list
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // Recursively render nested comments
  const renderComments = (comment) => {
    return (
      <div key={comment.commentId} style={{ marginLeft: comment.parentId ? 20 : 0 }}>
        <div className="comment-box">
          <strong>{comment.user.name}</strong>: {comment.content}
          {comment.imageUrl && <img src={comment.imageUrl} alt="comment" style={{ maxWidth: '100px' }} />}
          <button onClick={() => setReplyTo(comment.commentId)}>Reply</button>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map((reply) => renderComments(reply))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <div className="new-comment">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        {imageUrl && <img src={imageUrl} alt="preview" style={{ maxWidth: '100px' }} />}
        <button onClick={handleImageUpload}>Upload Image</button>
        <button onClick={handleSubmit}>
          {replyTo ? 'Post Reply' : 'Post Comment'}
        </button>
      </div>

      <div className="comments-list">
        {comments.length > 0
          ? comments.map((comment) => renderComments(comment))
          : 'No comments yet.'}
      </div>
    </div>
  );
};

export default Commentsection;
