const adminAuth = (req, res, next) => {
    const token = '12345'
    const isAuth = token === '12345'
    if (!isAuth){
        res.status(400).send('authentication required')
    } else {
        next()
    }
}
const userAuth = (req, res, next) => {
    const token = '12345'
    const isAuth = token === '123451231'
    if (!isAuth){
        res.status(400).send('authentication required')
    } else {
        next()
    }
}

module.exports = {
    adminAuth, 
    userAuth,
};