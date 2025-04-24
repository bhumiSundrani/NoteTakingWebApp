import React, { useEffect, useState } from 'react';
import { Container } from '../components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import { IoIosArrowRoundBack } from "react-icons/io";
function NotesPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            if (slug) {               
                try {
                    console.log(slug)
                    const response = await axios.get(`https://notetakingwebapp.onrender.com/notes/get-notes/${slug}`, { withCredentials: true });
                    setNotes(response.data.notes); 
                } catch (error) {
                    console.error("Error fetching notes:", error.response ? error.response.data.error : error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNotes();
    }, [slug]);

    // Handle Delete
    const handleDelete = async () => {
        try {
            await axios.patch(`https://notetakingwebapp.onrender.com/notes/recently-deleted-notes/${slug}`, { withCredentials: true });
            alert('Note deleted successfully!');
            navigate('/'); // Redirect to homepage or notes list
        } catch (error) {
            console.error("Error deleting note:", error.response ? error.response.data.error : error.message);
        }
    };

    // Handle Edit
    const handleEdit = () => {
        navigate(`/notes/edit-notes/${slug}`);
    };

    if (loading) return (
        <Container>
            <div className="max-w-3xl mx-auto shadow-lg rounded-2xl p-6 space-y-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Loading...</h1>
            </div>
        </Container>
    )
    if (!notes) return (
        <Container>
            <div className="max-w-3xl mx-auto shadow-lg rounded-2xl p-6 space-y-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Note not found</h1>
            </div>
        </Container>
    )

    return (
        <Container>
            <div className='flex w-full md:w-[90%] lg:w-[80%] mx-auto mt-1 sm:mt-5 px-6'>
                <Link to={'/'} className=' w-[95%] mx-auto'>
                    <button className='bg-blue-500 cursor-pointer hover:bg-blue-600 transition duration-300 text-white px-1 sm:px-2 py-1 sm:py-1 sm:mb-0 mb-2 rounded-xl'>
                    <IoIosArrowRoundBack className='lg:text-4xl text-2xl'/>
                    </button>
                </Link>
            </div>
            <div className='max-w-3xl px-4 mx-auto'>
            <div className="w-full bg-[#fcfcf8] shadow-lg rounded-2xl p-6 space-y-4 mx-auto">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{notes.title}</h1>
                {notes.image && (
                    <img 
                        src={notes.image} 
                        alt="Note" 
                        className="w-full max-h-60 object-scale-down rounded-lg object-center"
                    />
                )}
                <div className="text-gray-700">
                    {notes.description ? parse(`<div>${notes.description}</div>`) : ""}
                </div>

                <div className="text-right flex flex-col justify-between text-sm text-gray-500">
                    <p>Created At: {new Date(notes.createdAt).toLocaleString()}</p>

                    <p>Updated At: {new Date(notes.updatedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-4 mt-4">
                    <button 
                        onClick={handleEdit} 
                        className="bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-red-700 transition duration-300 cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
            </div>
        </Container>
    );
}

export default NotesPage;
