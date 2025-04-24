const {Router} = require('express')
const upload = require('../middlewares/uploadImage.middleware')
const { handleCreateNote, handleEditNote, handleDeletedNote, handleRecentlyDeleted, handleGetAllNotes, handleGetNoteById, handleGetRecentlyDeletedNotes, handleRestoreNotes } = require('../controllers/note.controller')
const router = Router()

router.route('/create-notes').post((req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: `Error uploading file, ${err.message}` });
        }
        
        next();
    });
}, handleCreateNote);

router.route('/edit-notes/:id').patch(upload.single("image"), handleEditNote)
router.route('/recently-deleted-notes/:id').patch(handleRecentlyDeleted)
router.route('/recently-deleted-notes').get(handleGetRecentlyDeletedNotes)
router.route('/restore-notes/:id').patch(handleRestoreNotes)
router.route('/deleted-notes/:id').delete(handleDeletedNote)
router.route('/get-all-notes').get(handleGetAllNotes)
router.route('/get-notes/:id').get(handleGetNoteById)


module.exports = router