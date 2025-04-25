const upload = require('../middlewares/uploadImage.middleware')
const Note = require('../models/note.model')
const { verifyToken } = require('../service/auth.service')

const handleCreateNote = async (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({error: "Authentication required"})
    }

    let payload;
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({error: "Invalid authentication token"})
    }

    const { title, description } = req.body
    if (!title?.trim()) {
        return res.status(400).json({ error: "Title is required" })
    }

    try {
        const imageUrl = req.file?.path || null
        const note = await Note.create({
            title: title.trim(),
            description: description?.trim() || "",
            image: imageUrl,
            createdBy: payload.id
        })

        return res.status(201).json({
            success: "Note created successfully",
            note: {
                _id: note._id,
                title: note.title,
                description: note.description,
                image: note.image,
                createdAt: note.createdAt
            }
        })
    } catch (error) {
        console.error("Error creating note: ", error)
        return res.status(500).json({error: "Failed to create note"})
    }
}

const handleEditNote = async (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({error: "Authentication required"})
    }

    let payload;
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({error: "Invalid authentication token"})
    }

    const { id } = req.params
    const { title, description } = req.body

    if (!id) {
        return res.status(400).json({error: "Note ID is required"})
    }

    try {
        const existingNote = await Note.findById(id)
        if (!existingNote) {
            return res.status(404).json({error: "Note not found"})
        }

        if (existingNote.createdBy.toString() !== payload.id) {
            return res.status(403).json({error: "Not authorized to edit this note"})
        }

        const imageUrl = req.file ? req.file.path : existingNote.image
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            {
                title: title?.trim() || existingNote.title,
                description: description?.trim() || existingNote.description,
                image: imageUrl
            },
            { new: true }
        )

        return res.status(200).json({
            success: "Note updated successfully",
            note: {
                _id: updatedNote._id,
                title: updatedNote.title,
                description: updatedNote.description,
                image: updatedNote.image,
                updatedAt: updatedNote.updatedAt
            }
        })
    } catch (error) {
        console.error("Error updating note: ", error)
        return res.status(500).json({error: "Failed to update note"})
    }
}

const handleRecentlyDeleted = async (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({error: "Authentication required"})
    }

    let payload;
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({error: "Invalid authentication token"})
    }

    const { id } = req.params
    if (!id) {
        return res.status(400).json({error: "Note ID is required"})
    }

    try {
        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({error: "Note not found"})
        }

        if (note.createdBy.toString() !== payload.id) {
            return res.status(403).json({error: "Not authorized to delete this note"})
        }

        await Note.findByIdAndUpdate(id, { recentlyDeleted: true })
        return res.status(200).json({success: "Note moved to recently deleted"})
    } catch (error) {
        console.error("Error moving note to recently deleted: ", error)
        return res.status(500).json({error: "Failed to move note to recently deleted"})
    }
}

const handleDeletedNote = async (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({error: "Authentication required"})
    }

    let payload;
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({error: "Invalid authentication token"})
    }

    const { id } = req.params
    if (!id) {
        return res.status(400).json({error: "Note ID is required"})
    }

    try {
        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({error: "Note not found"})
        }

        if (note.createdBy.toString() !== payload.id) {
            return res.status(403).json({error: "Not authorized to delete this note"})
        }

        await Note.findByIdAndDelete(id)
        return res.status(200).json({success: "Note deleted successfully"})
    } catch (error) {
        console.error("Error deleting note: ", error)
        return res.status(500).json({error: "Failed to delete note"})
    }
}

const handleGetAllNotes = async (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({error: "Authentication required"})
    }

    let payload;
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({error: "Invalid authentication token"})
    }

    try {
        const notes = await Note.find({ 
            recentlyDeleted: false, 
            createdBy: payload.id 
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: notes.length > 0 ? "Notes retrieved successfully" : "No notes found",
            notes: notes.map(note => ({
                _id: note._id,
                title: note.title,
                description: note.description,
                image: note.image,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }))
        })
    } catch (error) {
        console.error("Error getting notes: ", error)
        return res.status(500).json({error: "Failed to retrieve notes"})
    }
}

const handleGetNoteById = async (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({error: "Authentication required"})
    }

    let payload;
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({error: "Invalid authentication token"})
    }

    const { id } = req.params
    if (!id) {
        return res.status(400).json({error: "Note ID is required"})
    }

    try {
        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({error: "Note not found"})
        }

        if (note.createdBy.toString() !== payload.id) {
            return res.status(403).json({error: "Not authorized to view this note"})
        }

        return res.status(200).json({
            success: "Note retrieved successfully",
            note: {
                _id: note._id,
                title: note.title,
                description: note.description,
                image: note.image,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }
        })
    } catch (error) {
        console.error("Error getting note: ", error)
        return res.status(500).json({error: "Failed to retrieve note"})
    }
}

const handleGetRecentlyDeletedNotes = async (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({error: "Authentication required"})
    }

    let payload;
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({error: "Invalid authentication token"})
    }

    try {
        const notes = await Note.find({
            recentlyDeleted: true,
            createdBy: payload.id
        }).sort({ updatedAt: -1 })

        return res.status(200).json({
            success: notes.length > 0 ? "Recently deleted notes retrieved successfully" : "No recently deleted notes found",
            notes: notes.map(note => ({
                _id: note._id,
                title: note.title,
                description: note.description,
                image: note.image,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }))
        })
    } catch (error) {
        console.error("Error getting recently deleted notes: ", error)
        return res.status(500).json({error: "Failed to retrieve recently deleted notes"})
    }
}

const handleRestoreNotes = async (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({error: "Authentication required"})
    }

    let payload;
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({error: "Invalid authentication token"})
    }

    const { id } = req.params
    if (!id) {
        return res.status(400).json({error: "Note ID is required"})
    }

    try {
        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({error: "Note not found"})
        }

        if (note.createdBy.toString() !== payload.id) {
            return res.status(403).json({error: "Not authorized to restore this note"})
        }

        await Note.findByIdAndUpdate(id, { recentlyDeleted: false })
        return res.status(200).json({success: "Note restored successfully"})
    } catch (error) {
        console.error("Error restoring note: ", error)
        return res.status(500).json({error: "Failed to restore note"})
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