
import nodemailer from "nodemailer";
import {
	createCommentNotificationEmailTemplate,
	createConnectionAcceptedEmailTemplate,
	createWelcomeEmailTemplate,
  resetPasswordTemplate,
} from "./emailTemplates.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false, 
  auth: {
    user: "moreyogita120@gmail.com", 
    pass: "iqsx eglj vkjr ejij", 
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export const sendWelcomeEmail = (email ,username, profileUrl) => {
  const emailOptions = {
    from: "clone@gmail.com", 
    to: email ,
    subject: "Connect Pro",
    text: "Welcome",
    html: createWelcomeEmailTemplate(username, profileUrl),
  };

  transport.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};


export function sendCommentNotificationEmail (
	recipientEmail,
	recipientName,
	commenterName,
	postUrl,
	commentContent
) { 

    const emailOptions = {
    from: "clone@gmail.com", 
    to: recipientEmail,
    subject: "New Comment on Your Post",
		html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
  };

  transport.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

export function sendConnectionAcceptedEmail (senderEmail, 
  senderName,
  recipientName,
  profileUrl) {
  
    const emailOptions = {
    from: "clone@gmail.com", 
    to: senderEmail,
    subject: `${recipientName} accepted your connection request`,
		html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
  };

  transport.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};



export function sendOTPEmail (email , otp) {
    console.log("trying to send OTP .....")
    const emailOptions = {
    from: "clone@gmail.com", 
    to: email,
    subject: `Reset Password`,
		html: resetPasswordTemplate(otp) ,
  };

  transport.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};


