import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import parse from 'html-react-parser';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Container } from '../components';
import { IoIosArrowRoundBack } from "react-icons/io";

function RecentlyDeletedPage() {
    const [allNotes, setAllNotes] = useState([])
    const [homeHeight, setHomeHeight] = useState("100vh")
    const navigate = useNavigate()
    const [isDropdownOpen, setDropdownOpen] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchNotes = async () => {
        try {
            const response = await axios.get('https://notetakingwebapp.onrender.com/notes/recently-deleted-notes', {withCredentials: true})
            if(response.data?.notes) {
                setAllNotes(response.data.notes)
                setError(null)
            }
        } catch (error) {
            if(error.response) {
                setError(error.response.data.error || "Failed to fetch notes")
                console.error("Server error in fetching notes: ", error.response.data.error)
            } else {
                setError("Network error occurred")
                console.error("Error fetching notes: ", error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotes()
        const updateHomeHeight = () => {
            const footer = document.getElementById("footer")
            const footerHeight = footer ? footer.offsetHeight : 0;
            const screenWidth = window.innerWidth
            if (screenWidth >= 640) {
                setHomeHeight(`calc(100vh - ${footerHeight}px)`);
            } else {
                setHomeHeight("auto");
            }
        }
        updateHomeHeight()
        window.addEventListener("resize", updateHomeHeight)
        return () => window.removeEventListener("resize", updateHomeHeight)
    }, [])

    const handleDelete = async (noteId) => {
        try {
            await axios.delete(`https://notetakingwebapp.onrender.com/notes/deleted-notes/${noteId}`, { withCredentials: true });
            setAllNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
            setDropdownOpen(null);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || "Failed to delete note");
                console.error("Server Error:", error.response.data.error);
            } else {
                setError("Failed to delete note");
                console.error("Request Failed:", error.message);
            }
        }
    }

    const handleRestore = async (noteId) => {
        try {
            await axios.patch(
                `https://notetakingwebapp.onrender.com/notes/restore-notes/${noteId}`,
                {},
                { withCredentials: true }
            );
            
            // Update local state immediately for better UX
            setAllNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
            setDropdownOpen(null);
            
            // Refresh the list to ensure consistency
            await fetchNotes();
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || "Failed to restore note");
                console.error("Server Error:", error.response.data.error);
            } else {
                setError("Failed to restore note");
                console.error("Request Failed:", error.message);
            }
        }
    }

    if (loading) {
        return (
            <Container>
                <div className="max-w-3xl mx-auto shadow-lg rounded-2xl p-6 space-y-4">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Loading...</h1>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div className="max-w-3xl mx-auto shadow-lg rounded-2xl p-6 space-y-4">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-500">{error}</h1>
                    <button 
                        onClick={fetchNotes}
                        className="bg-[#2a2721] hover:bg-[#3a3731] text-white font-bold py-2 px-4 rounded"
                    >
                        Retry
                    </button>
                </div>
            </Container>
        );
    }
    
    return (
        allNotes.length === 0 ? (
            <Container>
                <div className='flex w-full md:w-[90%] lg:w-[80%] mx-auto mt-1 sm:mt-5 px-6'>
                    <Link to={'/'} className=' w-[95%] mx-auto'>
                        <button className='bg-blue-500 cursor-pointer hover:bg-blue-600 transition duration-300 text-white px-1 sm:px-2 py-1 sm:py-1 sm:mb-0 mb-2 rounded-xl'>
                            <IoIosArrowRoundBack className='lg:text-4xl text-2xl'/>
                        </button>
                    </Link>
                </div>
                <div 
                    className='w-full h-full flex-1 flex justify-center items-center text-[#f5f3f1]' 
                    style={{ height: homeHeight }}
                >
                    <div className="relative z-10 p-6 flex flex-col justify-center items-center text-center">
                        <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow-md">No Notes found</h1>
                    </div>
                </div>
            </Container>
        ) : (
            <Container>
                <div className='flex w-full md:w-[90%] lg:w-[80%] mx-auto mt-1 sm:mt-5 px-6'>
                    <Link to={'/'} className=' w-[95%] mx-auto'>
                        <button className='bg-blue-500 cursor-pointer hover:bg-blue-600 transition duration-300 text-white px-1 sm:px-2 py-1 sm:py-1 sm:mb-0 mb-2 rounded-xl'>
                            <IoIosArrowRoundBack className='lg:text-4xl text-2xl'/>
                        </button>
                    </Link>
                </div>
                <div className='h-full w-full flex-1 px-6 py-4 bg-[#242323]'>            
                    <div className='grid auto-rows-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {allNotes.map((note) => (
                            <div 
                                className='flex flex-col p-4 bg-[#3a3731] shadow-lg rounded-xl border border-[#2a2721] 
                                hover:shadow-2xl transition duration-300 hover:scale-105 cursor-pointer text-white relative'
                                key={note._id}
                            >
                                <div onClick={() => navigate(`notes/get-notes/${note._id}`)}>
                                    <h1 className='font-bold sm:text-xl text-medium text-[#f5f3f1] mb-2'>{note.title}</h1>
                                    {note.image && (
                                        <img src={note.image} alt="Note Image" className='w-full max-h-48 py-2 object-contain rounded-md mb-2'/>
                                    )}
                                </div>
                            
                                <div 
                                    className='absolute top-2 right-2 text-white rounded-full p-2 hover:bg-[#2a2721] transition'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDropdownOpen(isDropdownOpen === note._id ? null : note._id);
                                    }}
                                >
                                    <BsThreeDotsVertical />
                                </div>
                            
                                {isDropdownOpen === note._id && (
                                    <div className='absolute top-9 right-0 bg-[#2a2721] border border-[#3a3731] shadow-lg rounded-md z-20 w-27 sm:w-32'>
                                        <ul>
                                            <li 
                                                className="px-3 sm:px-4 py-1 sm:py-2 text-[#f5f3f1] hover:bg-[#615e57] rounded-t-md text-sm sm:text-base cursor-pointer transition duration-300"
                                                onClick={() => handleRestore(note._id)}
                                            >
                                                Restore
                                            </li>
                                            <li 
                                                className="px-3 sm:px-4 py-1 sm:py-2 text-[#f5f3f1] hover:bg-[#615e57] text-sm sm:text-base rounded-b-md transition duration-300 cursor-pointer" 
                                                onClick={() => handleDelete(note._id)}
                                            >
                                                Delete Notes
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                <div className='text-[#d6d3d1] text-sm'>
                                    <div>
                                        {parse(note.description.length > 100 
                                            ? note.description.substring(0, 190) + '...' 
                                            : note.description)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        )
    )
}

export default RecentlyDeletedPage

