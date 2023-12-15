import nodemailer from "nodemailer";
import dotenv from 'dotenv'; 

import { Otp as OtpModel, User} from "./../models";
import { ApiError } from "./../utils";
dotenv.config(); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


export const sendOtp = async (userId:string, otpType:string) => {
  const OTP: number = Math.floor(Math.random() * 900000 + 100000);
  try{
    const user = await User.findById(userId); 
    if(!user) throw new ApiError("Invalid UserId in register", 500); 
    const mailOptions = {
      from: "sunny6464n@gmail.com", // sender address
      to: user.email, // list of receivers
      subject: "Verify Email", // Subject line
      html: `Dear user,
      To verify your email, click on this link: ${OTP}
      If you did not create an account, then ignore this email.`
    }
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Message sent: %s", info.messageId);

      const otpObj = new OtpModel({
        userId : user._id, 
        otp : OTP, 
        otpType,
      }); 
      await otpObj.save(); 
      console.log("otp saved");
      return true;
  }
  catch(err){
    console.log(err); 
    return false;
  }
}

