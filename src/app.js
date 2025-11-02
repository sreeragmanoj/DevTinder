const express = require('express')
// import {express} from express
const connectDb = require("../config/Database")
const {adminAuth, userAuth} = require('../middlewares/auth')
const User = require('../models/user')
const {validateSignUp, validateLogin} = require('../utils/validate')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const authRouter = require('../router/auth')
const profileRouter = require('../router/profile')
const connectionRouter = require("../router/connectionRequest")
const userRouter = require('../router/user')
const cors = require('cors');
const configurePassport = require("../config/passport");

const passport = require('passport')
// import passport from "passport";
// const authRouter = require('../router/auth')

const app = express();

app.use(passport.initialize());
configurePassport(passport);

app.use(express.json())
app.use(cookieParser())
app.use(cors());

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', connectionRouter)
app.use('/', userRouter)




connectDb()
.then(() => {
    console.log("connection established to the database")
    app.listen(3333, () => {
            console.log('Server is up and running fine')
        })
    })









// app.post('/signup', async (req, res) => {
//     try{
//     // validate the data coming
//     validateSignUp(req)

//     const {firstName, lastName, emailId, password} = req.body
//     // encrypt the password
//     console.log(password)
//     const hashedPassword = await bcrypt.hash(password, 10)
//     console.log(hashedPassword)
//     const data = req.body
//     const user = new User({
//         firstName,
//         lastName,
//         emailId,
//         password: hashedPassword
//     })
//         await user.save();
//         res.send('Data added successfully to the database')
//     }
//     catch(err){
//         res.status(400).send('ERROR : '+ err)
//     }

// })

// app.post('/login', async (req, res) => {
//     const {emailId, password} = req.body
//     try{
//         console.log(req.body)
//         console.log(emailId)
//         const user = await User.findOne({emailId : emailId})
//         console.log(user.password)
//         if (!user) {
//             throw Error('invalid credentials')
//         }
//         const passwordCheck = await user.validatePassword(password)
//         if (passwordCheck){
//             const token = await user.getJWT()
//             res.cookie('token', token, {expires: new Date(Date.now() + 8 * 3600000)})
//             res.send('logged in successfully')
//         } else {
//             throw Error('invalid credentials')
//         }

//     } catch (err){
//         res.status(400).send("Error : "+err)
//     }


// })

// app.get('/profile', userAuth, async (req, res) => {
//     try{
//         console.log(req.user)
//         res.send(req.user)
//         } catch (err) {
//             res.send('ERROR :'+ err.message)
//         }

// })

// app.get('/user', async (req, res) => {
//     const emailId = req.body.emailId
//     try {
//         const users = await User.find({emailId : emailId})
//         if (users.length === 0){
//             res.status(400).send('User not found, Try some other email id')
//         }else{
//             res.send(users)
//         }
//     } catch ( err ) {
//         res.status(400).send('user not found there is some error')
//     }

// })

// app.delete('/user', async (req, res) => {
//     const emailId = req.body.emailId
//     try{
//         const deletedUser = await User.findOneAndDelete({emailId: emailId})
//         res.send("user updated successfully ", deletedUser)
//     } catch (err) {
//         res.status(400).send("Some error occurred in the delete user api")
//     }
// })

// app.patch("/user/:emailId", async (req, res) =>{
//     const UpdatedUserData = req.body
//     const userMail = req.params?.emailId
//     console.log(userMail)
//     try{
//         console.log(UpdatedUserData)
//         const ALLOWEDUPDATES = ["photoURL", "about", "gender", "age", "skills"]
//         const isUpdateAllowed = Object.keys(UpdatedUserData).every((k) =>
//             ALLOWEDUPDATES.includes(k)
//         )
//         console.log(isUpdateAllowed)
//         if (!isUpdateAllowed){
//             throw Error("Update not allowed for some fields")
//         }
//         if (UpdatedUserData.skills.length > 10){
//             throw Error("skills should be in limit of 10")
//         }
//         console.log(UpdatedUserData)
//         const userData = await User.findOneAndUpdate({emailId : userMail}, UpdatedUserData, {returnDocument: "after", runValidators: true})
//         res.send("The user is updated successfully !!!!", userData)
//     } catch (err) {
//         res.status(400).send("some error occurred at updating the user")
//     }
// })

// app.get('/feed', async (req, res) => {
//     try{
//         const users =await User.find()
//         if (users.length === 0 ){
//             res.status(400).send("No user found")
//         } else {
//             res.send(users)
//         }
//     } catch (err) {
//         res.status(400).send("Some error occurred at fetching data")
//     }

// })













    // // app.use('/admin', (req, res,next) => {
    // //     const token = '12345'
    // //     const isAuth = token === '12345'
    // //     if (!isAuth){
    // //         res.status(400).send('need authentication for using admin')
    // //     } else {
    // //         next()
    // //     }
    // // })
    
    // app.use('/admin', adminAuth)
    
    // app.get('/admin/getData', (req,res) => {
    //     res.send('all data has been sent to DB')
    // })
    
    // app.post('/admin/deleteUser', (req, res) => {
    //     res.send('the user have been deleted')
    // })
    
    // app.get('/getUser/:UserId/:password', (req, res) => {
    //     console.log(req.params)
    //     res.send(req.params)
    // })
    
    // app.get('/user', userAuth, (req, res, next) => {
    //     console.log(req.query)
    //     next()
    //     // res.send(req.query)
    // }, (req, res, next) => {
    //     console.log(req.query)
    //     next()
    //     // res.send('this is from the second route handler')
    // })
    
    // app.use('/', (err, req, res, next) => {
    //     if (err) {
    //         res.status(500).send('there is some error coming')
    //     }
    //     res.send('this is the data from the main page')
    // })
    
