const express = require('express')
const router = express.Router()

router.get('/test', (req, res) => res.json({
    Message: 'Posts test worked!'
}))

module.exports = router