const jwt=require('jsonwebtoken');
const fetchuser=(req, res, next)=>{
    const token=req.header('auth-token');
    const JWT_SECERT="VIKASKUMAR";
    if(!token){
        res.status(401).json({error:"Please authenticate using a valid token"});
    }
    try{

        const data=jwt.verify(token,JWT_SECERT);
        req.user=data.user;
        next();
    }
    catch(error){
        res.status(401).json({error:error});
    }

}
module.exports=fetchuser;