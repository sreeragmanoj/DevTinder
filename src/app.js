const express = require('express')

const app = express();

// app.use('/', (req, res) => {
//     res.send('this is the data from the main page')
// })

app.use('/test', (req, res) => {
    res.send('this is from the test page 34534534653456')
})

app.listen(3333, () => {
    console.log('the server is up and running fine')
})

