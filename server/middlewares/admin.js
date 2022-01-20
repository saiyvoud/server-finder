const admin = (req, res, next) => {
    if (req.user.auth !== 'admin') return res.send('You are not allowed, get out now.')
    next();    
}

export { admin }
