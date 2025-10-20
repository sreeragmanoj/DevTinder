const express = require('express')

const {adminAuth, userAuth} = require('../middlewares/auth')

const app = express();

// app.use('/admin', (req, res,next) => {
//     const token = '12345'
//     const isAuth = token === '12345'
//     if (!isAuth){
//         res.status(400).send('need authentication for using admin')
//     } else {
//         next()
//     }
// })

app.use('/admin', adminAuth)

app.get('/admin/getData', (req,res) => {
    res.send('all data has been sent to DB')
})

app.post('/admin/deleteUser', (req, res) => {
    res.send('the user have been deleted')
})

app.get('/getUser/:UserId/:password', (req, res) => {
    console.log(req.params)
    res.send(req.params)
})

app.get('/user', userAuth, (req, res, next) => {
    console.log(req.query)
    next()
    // res.send(req.query)
}, (req, res, next) => {
    console.log(req.query)
    next()
    // res.send('this is from the second route handler')
})

app.use('/', (err, req, res, next) => {
    if (err) {
        res.status(500).send('there is some error coming')
    }
    res.send('this is the data from the main page')
})
app.listen(3333, () => {
    console.log('the server is up and running fine')
})

