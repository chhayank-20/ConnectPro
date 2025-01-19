import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import "./welcome.css";

const lines = [
  "Looking for a job that matches your skills?",
  "Need help building a standout resume?",
  "Struggling to connect with top employers?",
  "Build your professional network.",
];

const LineLooper = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingSpeed = 100;
  const typingPause = 1600;

  useEffect(() => {
    let timeout;

    const handleTyping = () => {
      const currentLine = lines[loopNum % lines.length];
      const updatedText = isDeleting
        ? currentLine.substring(0, currentText.length - 3)
        : currentLine.substring(0, currentText.length + 1);

      setCurrentText(updatedText);

      if (!isDeleting && updatedText === currentLine) {
        timeout = setTimeout(() => setIsDeleting(true), typingPause);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setCurrentLineIndex((prevIndex) => (prevIndex + 1) % lines.length);
      } else {
        timeout = setTimeout(handleTyping, typingSpeed);
      }
    };

    timeout = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, loopNum]);

  return ( 
    <div className="line-looper">
      <span>{currentText}</span>
      <span className="cursor" aria-hidden="true">|</span>
    </div>
  );
};

const Welcome = () => {
  return (
    <div className="welcome-container">
  <div className="image-section">
    <img src="./images/welcome.jpg" alt="People" />
  </div>
  <div className="content-section">
    <div className="logo">
      <img src="./images/logo.png" alt="Logo" />
    </div>
    <h2>Welcome to your Professional Community</h2>
    <LineLooper />
        <p>
          By clicking <Link to="/signup"><strong>Join Now</strong></Link>, you can create your personalized profile, connect with industry experts, and explore career opportunities tailored to your skills.
        </p>
        <p>
          <a href="/">User Agreement</a>, <a href="/">Privacy Policy</a>, and <a href="/">Cookie Policy</a>.
        </p>
        <p>
          New to ConnectPro? <Link to="/signup" className="Joinbtn">Join Now!</Link>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
