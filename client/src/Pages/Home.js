import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortingOption, setSortingOption] = useState('newest');

  useEffect(() => {
    document.title = 'Home - Fixxer Notes';
    CheckNotes();
  }, []);

  const CheckNotes = async () => {
    try {
      const response = await fetch('http://localhost:3030/note');
      let data = await response.json();
      // Sıralama seçeneğine göre notları sırala
      data = sortNotes(data, sortingOption);
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
  }, [sortingOption]);

  // Notları sıralama fonksiyonu
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

  // Renk kodu oluşturma fonksiyonları
  const generateColor = (index) => {
    const colors = [
      '#ffcccc', // Kırmızı
      '#ffffcc', // Sarı
      '#ccffcc', // Yeşil
      '#ccccff', // Mavi
      '#ffccff', // Mor
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

  // Upvote işlevi
  function upvote(id) {
    fetch(`http://localhost:3030/note/${id}/upvote`, {
      method: 'POST',
    }).then(() => {
      CheckNotes();
    });
  }

  // Sıralama seçeneklerine göre notları yeniden yükle
  const handleSortingChange = (event) => {
    setSortingOption(event.target.value);
  };

  const locales = { tr, eu };
  return (
    <div>
      <h1>Fixxer Notes</h1>

      <select className='siralama' value={sortingOption} onChange={handleSortingChange}>
        <option value="newest">En Yeni</option>
        <option value="oldest">En Eski</option>
        <option value="highestRated">En Yüksek Puan</option>
      </select>

      <div>
        {loading && <p>Loading...</p>}
        <div className="notes">
          {notes.map((note, index) => (
            <div className='note' key={note._id} style={{ backgroundColor: generateColor(index) }}>
              <p className='tag' style={{ backgroundColor: generateTagColor(note.tags) }}>{note.tags.join(', ')}</p>
              <h2>{note.title}</h2>
              <p className='message'>{note.content}</p>
              <p className='votes'>
                <button onClick={() => upvote(note._id)}>⬆️</button>
                Upvotes: {note.upvotes}
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
