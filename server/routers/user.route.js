const {Router} = require('express')
const {handleUserSignup, handleUserLogin, handleUserSignout, handleGetCurrentUser} = require('../controllers/user.controller')
const validateSignUp = require('../middlewares/validateSignup.middleware')

const router = Router()

router.route('/signup').post(validateSignUp, handleUserSignup)
router.route('/login').post(handleUserLogin)
router.route('/logout').post(handleUserSignout)
router.route('/get-current-user').get(handleGetCurrentUser)

module.exports = router