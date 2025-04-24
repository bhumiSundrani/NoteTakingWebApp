import React, {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import RTE from './RTE';
import axios from 'axios'
import { useNavigate, Link, useParams, data } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";

function NotesForm() {
    const {slug} = useParams()
    const [notes, setNotes] = useState(null)
    const { register, handleSubmit, formState: { errors }, control, watch, reset } = useForm({
        defaultValues: {
            title: "",
            description: "",
            image: null
        }
    });
    useEffect(() => {
        if(!slug) return
        
            async function getNotes() {
                try {
                    const response = await axios.get(`https://notetakingwebapp.onrender.com/notes/get-notes/${slug}`, {withCredentials: true})
                    setNotes(response.data.notes)
                } catch (error) {
                    if(error.response){
                        console.log("Server error in fetching notes: ", error.response.data.error)
                    }
                    console.error("Error fetching notes: ", error.message)
                }            
                
            
        }
        getNotes()
    }, [slug])

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
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false)
    useEffect(() => {
        if (notes?.image && !selectedImage) {
            setPreviewURL(notes.image); // ✅ Show old image when editing
            return; // ✅ Return here to avoid unnecessary URL creation
        }
    
        if (!selectedImage) return;
    
        const objectURL = URL.createObjectURL(selectedImage);
        setPreviewURL(objectURL); // ✅ Show selected image if available
        console.log(objectURL);
    
        return () => URL.revokeObjectURL(objectURL); // ✅ Cleanup on unmount
    }, [selectedImage, notes]);
    

    const handleFileChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.log("No file selected");
            return;
        }
    
        const file = e.target.files[0]; // Get the first file
    
        setSelectedImage(file); // Update state with file name
    }
    const [previewURL, setPreviewURL] = useState(null);
    const bgColor = notes ? "bg-green-500" : "bg-blue-500"
   
    
    const navigate = useNavigate()
    const submit = async (data) => {
        const formdata = new FormData()
        formdata.append("title", data.title)
        formdata.append("description", data.description)
        if(data.image && data.image[0]) {
            console.log(data.image , " ", data.image[0])
            formdata.append("image", data.image[0])
        }
        setIsUploading(true);
        setUploadProgress(0); 
        if(notes){
            try {
                const id = notes._id
                const updatedNotes = await axios.patch(`https://notetakingwebapp.onrender.com/notes/edit-notes/${id}`, formdata, {withCredentials: true, headers: {"Content-Type": "multipart/form-data"}, onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }})
                if(updatedNotes) {
                    console.log("Notes updated successfully: ", updatedNotes)
                }
                navigate('/')
            } catch (error) {
                if (error.response) {
                    console.error("Server Error:", error.response.data.error);
                } else {
                    console.error("Updating Notes Failed:", error.message);
                }
            }  finally {
                setIsUploading(false);
            }          
        }else{
            try {
                const newNotes = await axios.post('https://notetakingwebapp.onrender.com/notes/create-notes', formdata, {withCredentials: true, headers: {"Content-Type": "multipart/form-data"}, 
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }}
                )
                if(newNotes){
                    console.log("New note added successfully: ", newNotes)
                }
                navigate('/')
            } catch (error) {
                if (error.response) {
                    console.error("Server Error:", error.response.data.error);
                } else {
                    console.error("Creating Notes Failed:", error.message);
                }
            }
        }
    }

  return (
    <>
    
    <div className='flex w-full md:w-[90%] lg:w-[80%] mx-auto mt-1 sm:mt-5 px-6'>
                        <Link to={'/'} className=' w-[95%] mx-auto'>
                            <button className='bg-blue-500 cursor-pointer hover:bg-blue-600 transition duration-300 text-white px-1 sm:px-2 py-1 sm:py-1 sm:mb-0 mb-2 rounded-xl'>
                                <IoIosArrowRoundBack className='lg:text-4xl text-2xl'/>
                            </button>
                            </Link>
                    </div>
        <div className="flex justify-center items-center mt-1 sm:mt-5 bg-[#242323] w-full md:w-[90%] lg:w-[80%] mx-auto">        
            <form  className="bg-[#525252] text-white p-6 rounded-lg shadow-lg w-[95%] flex justify-evenly flex-col md:flex-row gap-2" encType='multipart/form-data' onSubmit={handleSubmit(submit)}>
                <div className='flex flex-col md:w-[65%]'>
                    {/* Title */}
                    <div className="mb-4 ">
                    <label htmlFor="title" className="block text-[15px] sm:text-lg font-medium">Title</label>
                    <input 
                        type="text" 
                        {...register("title", { required: "Title is required" })} 
                        value={data.title}
                        placeholder="Add Title"
                        className="mt-1 p-0.5 pl-2 w-full border rounded bg-[#242323] focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <RTE control={control} name="description" label="Description"/>
                </div>
                <div className='flex flex-col md:w-[30%] '>
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

                {/* Upload Progress Bar */}
                {isUploading && uploadProgress !== undefined && uploadProgress !== null && (
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                        <div
                            className="bg-blue-500 h-full transition-all duration-300"
                            style={{ width: `${Math.min(Math.max(uploadProgress, 0), 100)}%` }}
                        ></div>
                    </div>
                )}
                {/* {notes?.image && !selectedImage && (
                    <div className="mt-3 flex justify-center">
                        <img 
                            src={notes.image} 
                            alt="Existing Image" 
                            className="w-32 h-32 rounded-lg object-cover shadow-md border border-gray-400"
                        />
                    </div>
                )} */}

                {previewURL && (
                    <div className="mt-3 flex justify-center">
                        <img 
                            src={previewURL} 
                            alt="Preview" 
                            className="w-32 h-32 rounded-lg object-cover shadow-md border border-gray-400"
                        />
                    </div>
                )}
                {/* Submit Button */}
                <button 
                    type="submit" 
                    className={`mt-4 py-[6px] sm:py-2 px-4 w-full sm:text-lg font-medium   cursor-pointer duration-300 rounded-lg shadow-md transition-all ${
                        isUploading ? "bg-gray-500 cursor-not-allowed" : bgColor + " hover:brightness-90"
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