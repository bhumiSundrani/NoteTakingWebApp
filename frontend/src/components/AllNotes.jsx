import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import parse from 'html-react-parser';
import { BsThreeDotsVertical } from "react-icons/bs";

function AllNotes() {
    const [allNotes, setAllNotes] = useState([])
    const [homeHeight, setHomeHeight] = useState("100vh")
    const navigate = useNavigate()
    const [isDropdownOpen, setDropdownOpen] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchNotes = () => {
        axios.get('https://notetakingwebapp.onrender.com/notes/get-all-notes', {withCredentials: true})
        .then((response) => {
            if(response.data){
                setAllNotes(response.data.notes)
            }
        })
        .catch((error) => {
            if(error.response){
                console.log("Server error in fetching notes: ", error.response.data.error)
            }
            console.error("Error fetching notes: ", error.message)
        })
        .finally(() => setLoading(false))
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

    const handleDelete = async (slug) => {
        try {
            await axios.patch(`https://notetakingwebapp.onrender.com/notes/recently-deleted-notes/${slug}`,{}, { withCredentials: true });
            setAllNotes(prev => prev.filter(note => note.id !== slug))
            fetchNotes()
        } catch (error) {
            if (error.response) {
              console.error("Server Error:", error.response.data.error);
            } else {
              console.error("Request Failed:", error.message);
            }
        }
    }
    if (loading) return (
            <div className="max-w-3xl mx-auto shadow-lg rounded-2xl p-6 space-y-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Loading...</h1>
            </div>

    )

    
    return (
        allNotes.length === 0 ? (
            <div 
                className='w-full h-full flex-1 flex justify-center items-center bg-[#1e1e1e] text-[#f5f3f1]' 
                style={{ height: homeHeight }}
            >
                <div className="relative z-10 p-6 flex flex-col justify-center items-center text-center">
                    <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow-md">Create Your First Note</h1>
                    <button 
                        className="mt-6 bg-[#2a2721] hover:bg-[#3a3731] text-[#f5f3f1] font-bold text-lg md:text-xl rounded-lg py-3 px-6 transition duration-300 shadow-xl"
                        onClick={() => navigate('/notes/add-notes')}
                    >
                        Create
                    </button>
                </div>
            </div>
        ) : (
            <div className='h-full w-full flex-1 px-6 py-4 bg-[#242323]'>            
                <div className='grid auto-rows-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {allNotes.map((note) => (
                        <div 
                        className='flex flex-col p-4 bg-[#3a3731] shadow-lg rounded-xl border border-[#2a2721] 
                        hover:shadow-2xl transition duration-300 hover:scale-105 cursor-pointer text-white relative'
                        key={note._id}
                    >
                        <div onClick={() => navigate(`notes/get-notes/${note._id}`)}>
                            <h1 className='font-bold sm:text-xl text-medium text-[#f5f3f1] mb-2'>{note.title}</h1>
                            {note.image && (
                                <img src={note.image} alt="Note Image" className='w-full h-auto py-2 object-contain rounded-md max-h-48 mb-2'/>
                            )}
                        </div>
                    
                        <div 
                            className='absolute top-2 right-2 text-white rounded-full p-2 hover:bg-[#2a2721] transition'
                            onClick={(e) => {
                                e.stopPropagation();  // Prevents note navigation
                                setDropdownOpen(isDropdownOpen === note._id ? null : note._id);  // Toggle logic fixed
                            }}
                            
                        >
                            <BsThreeDotsVertical />
                        </div>
                    
                        {isDropdownOpen === note._id && (
                            <div className='absolute top-9 right-0 bg-[#2a2721] border border-[#3a3731] shadow-lg rounded-md z-20 w-27 sm:w-32'>
                                <ul>
                                    <li className="px-3 sm:px-4 py-1 sm:py-2 text-[#f5f3f1] hover:bg-[#615e57] rounded-t-md text-sm sm:text-base cursor-pointer transition duration-300">
                                        <Link to={`/notes/edit-notes/${note._id}`}>Edit Notes</Link>
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
                        <div className='text-[#d6d3d1] text-sm' onClick={() => navigate(`notes/get-notes/${note._id}`)}>
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
        )
    )
}

export default AllNotes

