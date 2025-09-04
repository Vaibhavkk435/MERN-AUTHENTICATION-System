import jwt from 'jsonwebtoken';

const userAuth = async(req,res,next)=>{
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({success:false,message:"Unauthorized"});
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.json({success:false,message:"Invalid token"});
  }
}

export default userAuth;
