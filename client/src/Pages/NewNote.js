import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

const NewNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const note = {title, content, tags};

        const response = await fetch('http://localhost:3030/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });

        if (response.ok) {
            console.log('Note created');
            setTitle('');
            setContent('');
            setTags('');
            setRedirect(true);
        } else {
            console.log('Note creation failed');
        }
    }

    useEffect(() => {
        document.title = 'New Note - Fixxer Notes'
    }, []);

    if (redirect) {
        return <Navigate to="/"/>
    }
    
    return (
        <div>
            <h1 className='topHead'>Yeni Not</h1>

            <form className='newNoteForm' onSubmit={handleSubmit}>
                <input type="text"  placeholder="Title" 
                                    value={title} 
                                    onChange={
                                        (e) => setTitle(e.target.value)
                                    } />
                <textarea   placeholder="Content" 
                            value={content} 
                            maxLength={400}
                            onChange={
                                (e) => setContent(e.target.value)
                            }>
                </textarea>
                <select value={tags}
                        onChange={
                            (e) => setTags(e.target.value)
                        }>
                    <option value="">Durum Seçiniz</option>
                    <option value="working">Working</option>
                    <option value="done">Done</option>
                    <option value="pending">Pending</option>
                </select>

                <button type="submit">Create Note</button>
            </form>
        </div>      
    )
}

export default NewNote