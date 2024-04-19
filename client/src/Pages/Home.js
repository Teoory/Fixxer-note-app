import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Hooks/UserContext';
import { format } from "date-fns";
import { tr, eu, is } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const Home = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortingOption, setSortingOption] = useState('newest');
  const [filterOption, setFilterOption] = useState('all');
  
  const [showSelect, setShowSelect] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [upvotedNotes, setUpvotedNotes] = useState([]);

  useEffect(() => {
    document.title = 'Home - Fixxer Notes';
    CheckNotes();
    const upvotedNotesFromStorage = JSON.parse(localStorage.getItem('upvotedNotes')) || [];
    setUpvotedNotes(new Set(upvotedNotesFromStorage));
  }, []);
  
  useEffect(() => {
    fetch('https://fixxer-api.vercel.app/profile')
        .then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        })
  }, []);

  const CheckNotes = async () => {
    try {
      const response = await fetch('https://fixxer-api.vercel.app/note');
      let data = await response.json();
      data = sortNotes(data, sortingOption);
      data = filterNotes(data, filterOption);
      setNotes(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      CheckNotes();
    }, 1000);
    return () => clearInterval(interval);
  }, [sortingOption, filterOption]);

  const sortNotes = (data, option) => {
    switch (option) {
      case 'newest':
        return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'highestRated':
        return data.sort((a, b) => b.upvotes - a.upvotes);
      default:
        return data;
    }
  };

  const filterNotes = (data, option) => {
    if (option === 'all') {
      return data;
    } else {
      return data.filter(note => note.tags.includes(option));
    }
  }

  const generateColor = (index) => {
    const colors = [
      '#ffcccc', // Kırmızı
      '#ffffcc', // Sarı
      '#ccffcc', // Yeşil
      '#ccccff', // Mavi
      '#ccecff', // Mavi
    ];
    return colors[index % colors.length];
  };

  const generateTagColor = (tags) => {
    if (tags.includes('pending')) {
      return '#2196F3';
    } else if (tags.includes('working')) {
      return '#b37024';
    } else if (tags.includes('done')) {
      return '#2f7131';
    } else {
      return '';
    }
  };

  
  function upvote(id) {
    if (upvotedNotes.has(id)) {
      // Eğer kullanıcı daha önce upvote yapmışsa, upvote'u sil
      fetch(`https://fixxer-api.vercel.app/note/${id}/upvote`, {
        method: 'DELETE',
      }).then(() => {
        // upvotedNotes dizisinden notun id'sini kaldır
        const updatedUpvotedNotes = new Set([...upvotedNotes].filter(noteId => noteId !== id));
        setUpvotedNotes(updatedUpvotedNotes);
        localStorage.setItem('upvotedNotes', JSON.stringify([...updatedUpvotedNotes]));
        CheckNotes();
      });
    } else {
      // Eğer kullanıcı daha önce upvote yapmamışsa, upvote'u ekle
      fetch(`https://fixxer-api.vercel.app/note/${id}/upvote`, {
        method: 'POST',
      }).then(() => {
        // upvotedNotes dizisine notun id'sini ekle
        const updatedUpvotedNotes = new Set([...upvotedNotes, id]);
        setUpvotedNotes(updatedUpvotedNotes);
        localStorage.setItem('upvotedNotes', JSON.stringify([...updatedUpvotedNotes]));
        CheckNotes();
      });
    }
  }



  const handleEditButtonClick = (id) => {
    setEditingNoteId(id);
    setShowSelect(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updatedNotes = notes.map(note => {
      if (note._id === id) {
        return { ...note, tags: [newStatus] };
      }
      return note;
    });
    setNotes(updatedNotes);

    // API'ye güncellenmiş notu gönder
    fetch(`https://fixxer-api.vercel.app/note/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tags: [newStatus] })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Status update failed');
      }
      setShowSelect(false); // Seçim kutusunu kapat
      setEditingNoteId(null); // Düzenleme modunu kapat
    })
    .catch(error => {
      console.error('Error updating status:', error);
    });
  };
  

  //? Sıralama ve Filtreleme
  const handleSortingChange = (event) => {
    setSortingOption(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const deleteallNotes = async () => {
    try {
      await fetch('https://fixxer-api.vercel.app/deleteallNotes', {
        method: 'DELETE',
      });
      setNotes([]);
    } catch (error) {
      console.error('Error deleting notes:', error);
    }
  };

  function newNoteLink() {
    window.location.href = '/new';
  }

  const tags = userInfo?.tags;

  const isAdmin = tags?.includes('admin');
  const isEditor = tags?.includes('editor') || isAdmin;
  const isWriter = tags?.includes('writer') || isEditor;
  const isUser = tags?.includes('user') || isWriter;


  const locales = { tr, eu };

  return (
    <div>
      <h1 className='topHead'>Fixxer Notes</h1>

      <div className="gosterim">
      <select className='siralama' value={sortingOption} onChange={handleSortingChange}>
        <option value="newest">En Yeni</option>
        <option value="oldest">En Eski</option>
        <option value="highestRated">En Yüksek Puan</option>
      </select>
      
      <select className='siralama' value={filterOption} onChange={handleFilterChange}>
        <option value="all">Tümü</option>
        <option value="working">Working</option>
        <option value="pending">Pending</option>
        <option value="done">Done</option>
      </select>

      <div className="adminbuttons">
        {isWriter && (
          <div className="newNote homedeletebut">
            <button className='newNote' onClick={newNoteLink}>Yeni Not Ekle</button>
          </div>
        )}

        {isAdmin && (
          <>
          <div className="deleteAll homedeletebut">
            <button className='deleteAll' onClick={deleteallNotes}>Tüm Notları Sil</button>
          </div>
          </>
        )}
      </div>

      </div>

      <div>
        {loading && <p>Loading...</p>}
        <div className="notes">
          {notes.map((note, index) => (
            <div className='note' key={note._id} style={{ backgroundColor: generateColor(index) }}>
              {isEditor && (
              <>
                {editingNoteId !== note._id ? (
                  <button 
                    style={{ backgroundColor: "#0098ff", maxHeight: "20px", marginTop: "10px", borderRadius: "15px", cursor: "pointer" }}
                    onClick={() => handleEditButtonClick(note._id)}>Durumu Düzenle
                  </button>
                ) : (
                  <>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                      <option value="pending">Tag Seciniz.</option>
                      <option value="working">Working</option>
                      <option value="done">Done</option>
                      <option value="pending">Pending</option>
                    </select>
                    <button 
                      style={{ backgroundColor: "#00a323", maxHeight: "20px", marginTop: "10px", borderRadius: "15px", cursor: "pointer" }}
                      onClick={() => handleUpdateStatus(note._id, selectedStatus)}>Durumu Güncelle
                    </button>
                  </>
                )}
              </>
              )}

              <p className='tag' style={{ backgroundColor: generateTagColor(note.tags) }}>{note.tags.join(', ')}</p>
              <h2>{note.title}</h2>
              <p className='message'>{note.content}</p>
              <p className='votes'>
                {isUser && (
                  <button onClick={() => upvote(note._id)}>
                    {upvotedNotes.has(note._id) 
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="downarrow w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                      </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uparrow w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
                      </svg>
                    }
                  </button>
                )}
                <span>Upvotes: <span className='upvotes'>{note.upvotes}</span></span>
              </p>
              <time>
                {format(new Date(note.createdAt), "dd MMM yyyy", {
                locale: locales["tr"],
              })}
              </time>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
