const express = require('express')

const app = express();


app.use('/test', (req, res) => {
    res.send('this is from the test page 34534534653456')
})

app.get('/getUser/:UserId/:password', (req, res) => {
    console.log(req.params)
    res.send(req.params)
})

app.get('/user', (req, res) => {
    console.log(req.query)
    res.send(req.query)
})

app.use('/', (req, res) => {
    res.send('this is the data from the main page')
})
app.listen(3333, () => {
    console.log('the server is up and running fine')
})

