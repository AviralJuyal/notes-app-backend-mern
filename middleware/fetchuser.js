var jwt = require('jsonwebtoken');
const jwt_token = "avi@messi";


const fetchuser =(req , res , next)=>{
    const token = req.header('auth-token');
    if(!token)
            return res.status(401).json({error: "please authenticate using a valid token"});
    try{
        const data = jwt.verify(token ,jwt_token);
        req.user = data.user;
        next();
        
    }
    catch(err){
        res.status(401).json({error: "please authenticate using a valid token"})
    }
}   

module.exports = fetchuser;