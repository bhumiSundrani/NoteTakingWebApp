import React, {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import RTE from './RTE';
import axios from 'axios'
import { useNavigate, Link, useParams } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";

function NotesForm() {
    const {slug} = useParams()
    const [notes, setNotes] = useState(null)
    const [error, setError] = useState(null)
    const { register, handleSubmit, formState: { errors }, control, watch, reset } = useForm({
        defaultValues: {
            title: "",
            description: "",
            image: null
        }
    });

    // Fetch note data when editing
    useEffect(() => {
        if(!slug) return
        
        async function getNotes() {
            try {
                const response = await axios.get(`https://notetakingwebapp.onrender.com/notes/get-notes/${slug}`, {withCredentials: true})
                if(response.data?.notes) {
                    setNotes(response.data.notes)
                    setError(null)
                }
            } catch (error) {
                if(error.response) {
                    setError(error.response.data.error || "Failed to fetch note")
                    console.error("Server error in fetching notes: ", error.response.data.error)
                } else {
                    setError("Network error occurred")
                    console.error("Error fetching notes: ", error.message)
                }
            }
        }
        getNotes()
    }, [slug])

    // Reset form with note data when available
    useEffect(() => {
        if (notes) {
            reset({
                title: notes.title || "",
                description: notes.description || "",
                image: null
            });
        }
    }, [notes, reset]);

    const imageFile = watch("image") 
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewURL, setPreviewURL] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    
    // Handle image preview
    useEffect(() => {
        if (notes?.image && !selectedImage) {
            setPreviewURL(notes.image)
            return
        }
    
        if (!selectedImage) return
    
        const objectURL = URL.createObjectURL(selectedImage)
        setPreviewURL(objectURL)
    
        return () => URL.revokeObjectURL(objectURL)
    }, [selectedImage, notes])
    
    const handleFileChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedImage(null)
            setPreviewURL(notes?.image || null)
            return
        }
    
        const file = e.target.files[0]
        setSelectedImage(file)
    }

    const navigate = useNavigate()
    const submit = async (data) => {
        const formdata = new FormData()
        formdata.append("title", data.title)
        formdata.append("description", data.description)
        
        // Only append image if a new one is selected
        if(data.image && data.image[0]) {
            formdata.append("image", data.image[0])
        }

        setIsUploading(true)
        setUploadProgress(0)
        
        try {
            if(notes) {
                // Update existing note
                const response = await axios.patch(
                    `https://notetakingwebapp.onrender.com/notes/edit-notes/${notes._id}`,
                    formdata,
                    {
                        withCredentials: true,
                        headers: {"Content-Type": "multipart/form-data"},
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            setUploadProgress(percentCompleted)
                        }
                    }
                )
                
                if(response.data) {
                    navigate('/')
                }
            } else {
                // Create new note
                const response = await axios.post(
                    'https://notetakingwebapp.onrender.com/notes/create-notes',
                    formdata,
                    {
                        withCredentials: true,
                        headers: {"Content-Type": "multipart/form-data"},
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            setUploadProgress(percentCompleted)
                        }
                    }
                )
                
                if(response.data) {
                    navigate('/')
                }
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || "Operation failed")
                console.error("Server Error:", error.response.data.error)
            } else {
                setError("Operation failed")
                console.error("Request Failed:", error.message)
            }
        } finally {
            setIsUploading(false)
        }
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto shadow-lg rounded-2xl p-6 space-y-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-500">{error}</h1>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-[#2a2721] hover:bg-[#3a3731] text-white font-bold py-2 px-4 rounded"
                >
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <>
            <div className='flex w-full md:w-[90%] lg:w-[80%] mx-auto mt-1 sm:mt-5 px-6'>
                <Link to={'/'} className='w-[95%] mx-auto'>
                    <button className='bg-blue-500 cursor-pointer hover:bg-blue-600 transition duration-300 text-white px-1 sm:px-2 py-1 sm:py-1 sm:mb-0 mb-2 rounded-xl'>
                        <IoIosArrowRoundBack className='lg:text-4xl text-2xl'/>
                    </button>
                </Link>
            </div>
            <div className="flex justify-center items-center mt-1 sm:mt-5 bg-[#242323] w-full md:w-[90%] lg:w-[80%] mx-auto">        
                <form className="bg-[#525252] text-white p-6 rounded-lg shadow-lg w-[95%] flex justify-evenly flex-col md:flex-row gap-2" encType='multipart/form-data' onSubmit={handleSubmit(submit)}>
                    <div className='flex flex-col md:w-[65%]'>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-[15px] sm:text-lg font-medium">Title</label>
                            <input 
                                type="text" 
                                {...register("title", { required: "Title is required" })} 
                                placeholder="Add Title"
                                className="mt-1 p-0.5 pl-2 w-full border rounded bg-[#242323] focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2"
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <RTE control={control} name="description" label="Description"/>
                    </div>
                    <div className='flex flex-col md:w-[30%]'>
                        <div className="mb-4">
                            <label htmlFor="image" className="block sm:text-lg text-[15px] font-medium text-white mb-2">Upload Image</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                {...register("image")}
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded-lg bg-[#242323] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                        </div>

                        {isUploading && (
                            <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-300"
                                    style={{ width: `${Math.min(Math.max(uploadProgress, 0), 100)}%` }}
                                ></div>
                            </div>
                        )}

                        {previewURL && (
                            <div className="mt-3 flex justify-center">
                                <img 
                                    src={previewURL} 
                                    alt="Preview" 
                                    className="w-32 h-32 rounded-lg object-cover shadow-md border border-gray-400"
                                />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className={`mt-4 py-[6px] sm:py-2 px-4 w-full sm:text-lg font-medium cursor-pointer duration-300 rounded-lg shadow-md transition-all ${
                                isUploading ? "bg-gray-500 cursor-not-allowed" : (notes ? "bg-green-500" : "bg-blue-500") + " hover:brightness-90"
                            }`}
                            disabled={isUploading}
                        >
                            <p className='text-white text-[15px] sm:text-base'>{notes ? "Update Note" : "Create Note"}</p>
                        </button>
                    </div>
                </form>                                                   
            </div>
        </>
    )
}

export default NotesForm