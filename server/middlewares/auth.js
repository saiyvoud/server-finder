import { User } from '../models/user.model.js'

const auth = (req, res, next) => {
    // const token = req.cookies.g_auth;
    const token = req.headers['token']
    
    User.findByToken(token, (err, user)=>{
        if(err) return res.send(err);
        if(!user) return res.json({ isAuth: false, error: true})
        req.token = token;
        req.user = user;
        next();
    })
}

export { auth }