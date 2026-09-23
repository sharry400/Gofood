const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = "SharjeelIqbal89898989"

router.post('/createuser',
    [
        body('email', 'Please enter a valid email').isEmail(),
        body('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
    ]
    , async (req, res) => {
        let success = false
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            let existedUser = await User.findOne({ email: req.body.email })
            if (existedUser) {
                success = false
                return res.status(400).json({ success, errors: "Please Enter Another Email!" })
            }
            const salt = await bcrypt.genSalt(10)
            let Secpassword = await bcrypt.hash(req.body.password, salt)
            await User.create({
                name: req.body.name,
                location: req.body.location,
                email: req.body.email,
                password: Secpassword
            })
            res.json({ success: true })

        }
        catch (error) {
            console.log(error)
            res.json({ success: false })
        }
    })
router.post('/loginuser',
    [
        body('name', 'Name must be at least 3 characters long').isLength({ min: 3 }),
        body('email', 'Please enter a valid email').isEmail(),
        body('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        try {
            let email = req.body.email
            let userData = await User.findOne({ email })
            if (!userData) {
                return res.status(400).json({ errors: "Please Login with Correct Credentials" })
            }
            const pwdcompare = await bcrypt.compare(req.body.password, userData.password)
            if (!pwdcompare) {
                return res.status(400).json({ errors: "Please Login with Correct Credentials" })

            }
            const data = {
                user: {
                    id: userData.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret)
            return res.json({ success: true, authToken: authToken })
        }
        catch (error) {
            console.log(error)
            res.json({ success: false })
        }
    })
module.exports = router;