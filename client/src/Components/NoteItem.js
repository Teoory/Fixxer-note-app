import React, { useState } from 'react';

const NoteItem = ({ note }) => {
  const [tags, setTags] = useState(note.tags);
  
  const handleUpdateTags = async () => {
    try {
      const response = await fetch(`http://localhost:3030/note/${note._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
      });
      const data = await response.json();
      console.log('Updated note:', data);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div className='note' key={note._id}>
      <button
        style={{
          backgroundColor: "#0098ff",
          maxHeight: "20px",
          marginTop: "10px",
          borderRadius: "15px",
          cursor: "pointer"
        }}
        onClick={handleUpdateTags}
      >
        Durum Güncelle
      </button>
      <p className='tag'>{tags.join(', ')}</p>
      <h2>{note.title}</h2>
      <p className='message'>{note.content}</p>
      <p className='votes'>
        {/* Upvote butonu buraya gelebilir */}
      </p>
      <time>{new Date(note.createdAt).toLocaleDateString()}</time>
    </div>
  );
};

export default NoteItem;
