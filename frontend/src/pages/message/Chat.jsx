import { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatArea from "./ChatArea"

const Chat = () => {

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <ChatSidebar />
        </div>
    );
};

export default Chat;
