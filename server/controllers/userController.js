import userModel from "../models/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log('Get user profile error:', error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};