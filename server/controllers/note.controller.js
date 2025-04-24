const upload = require('../middlewares/uploadImage.middleware')
const Note = require('../models/note.model')
const { verifyToken } = require('../service/auth.service')

const handleCreateNote = async (req, res) => {
    const body = req.body
    const title = body.title?.trim()
    const description = body.description?.trim()
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({error: "User unregistered"})
    }
    let payload;
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({error: "Error verifying token"})
    }
    if (!title) return res.status(400).json({ error: "Title and Description are required" });
    try {
        const imageUrl = req.file?.path || null
        const notes = await Note.create({
            title,
            description,
            image: imageUrl,
            createdBy: payload.id
        })
        return res.status(200).json({success: "Notes created successfully", notes})
    } catch (error) {
        console.log("Error creating notes: ", error)
        return res.status(500).json({error: "Error creating notes"})
    }
}

const handleEditNote = async (req, res) => {
    if(!req.body) return res.status(400).json({error: "Edited notes not found"})
    const {title, description} = req.body
    const id = req.params.id
    try {
        const existingNote = await Note.findById(id)
        const imageUrl = req.file ? req.file.path : existingNote.image
        const updatedNote = await Note.findByIdAndUpdate(id, {title, description, image: imageUrl}, {new: true})
        return res.status(200).json({success: "Notes updated successfully"})
    } catch (error) {
        console.log("Error updating notes: ", error)
        return res.status(501).json({error: "Error updating notes"})
    }
}

const handleRecentlyDeleted = async (req, res) => {
    const {id} = req.params
    if(!id) return res.status(400).json({error: "Notes id required"})
    try {
        const recentDeletedNotes = await Note.findByIdAndUpdate(id, {recentlyDeleted: true})
        if(!recentDeletedNotes) return res.status(200).json({success: "No notes found"})
        return res.status(200).json({success: "Notes added to recently deleted"})
    } catch (error) {
        console.log("Error recently deleting notes: ", error)
        return res.status(500).json({error: "Error recently deleting the notes"})
    }
}

const handleDeletedNote = async (req, res) => {
    const {id} = req.params
    if(!id) return res.status(400).json({error: "Notes id required"})
    try {
        const deletedNote = await Note.findByIdAndDelete(id)
        return res.status(200).json({success: "Notes deleted successfully"})
    } catch (error) {
        console.log("Error deleting notes: ", error)
        return res.status(500).json({error: "Error deleting the notes"})
    }
}


const handleGetAllNotes = async (req, res) => {
    try {
        const token = req.cookies.token;
        console.log(token)
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        let payload;
        try {
            payload = verifyToken(token)
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const id = payload.id;
        const notes = await Note.find({ recentlyDeleted: false, createdBy: id });
        console.log("Notes: ", notes)

        if (notes.length > 0) {
            return res.status(200).json({ success: "Sent all notes", notes });
        }

        return res.status(200).json({ success: "No notes found", notes: [] });

    } catch (error) {
        console.log("Error getting all notes: ", error);
        return res.status(500).json({ error: "Error getting notes" });
    }
};

const handleGetNoteById = async (req, res) => {
    try {
        const {id} = req.params
        const notes = await Note.findById({_id: id})
        if(!notes){
            return res.status(404).json({error: "Notes not found"})
        }
        return res.status(200).json({success: "Note sent successfully", notes})
    } catch (error) {
        console.log("Error getting the notes", error)
        return res.status(500).json({error: "Error getting notes"})
    }
}

const handleGetRecentlyDeletedNotes = async (req, res) => {
    try {
        const token = req.cookies.token
        if(!token) return res.status(401).json({error: "Unauthorised user"})
        const payload = verifyToken(token)
        const notes = await Note.find({recentlyDeleted: true, createdBy: payload.id})
        if(notes){
            return res.status(200).json({success: "Sent all deleted notes", notes})
        }
        return res.status(200).json({success: "No notes found"})
    } catch (error) {
        console.log("Error getting all deleted notes: ", error)
        return res.status(500).json({error: "Error getting deleted notes"})
    }
}

const handleRestoreNotes = async (req, res) => {
    const {id} = req.params
    if(!id) return res.status(400).json({error: "Notes id required"})
    try {
        const recentDeletedNotes = await Note.findByIdAndUpdate(id, {recentlyDeleted: false})
        return res.status(200).json({success: "Notes restored successfully"})
    } catch (error) {
        console.log("Error restoring notes: ", error)
        return res.status(500).json({error: "Error restoring notes"})
    }
}

module.exports = {
    handleCreateNote,
    handleEditNote,
    handleRecentlyDeleted,
    handleDeletedNote,
    handleGetAllNotes,
    handleGetNoteById,
    handleGetRecentlyDeletedNotes,
    handleRestoreNotes
}