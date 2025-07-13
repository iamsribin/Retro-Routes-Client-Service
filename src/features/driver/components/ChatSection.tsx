import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "@/context/socket-context";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Send } from "lucide-react";
import { addChatMessage } from "@/shared/services/redux/slices/driverRideSlice";
import ImageCapture from "./ImageCapture";
import { Message } from "@/shared/types/commonTypes";
import { DriverRideRequest } from "@/shared/types/driver/ridetype";

interface ChatSectionProps {
  rideData: DriverRideRequest;
  setUnreadCount: (count: number) => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({ rideData, setUnreadCount }) => {
  const dispatch = useDispatch();
  const { socket, isConnected } = useSocket();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState<string>("");

  useEffect(() => {
    if (rideData?.chatMessages && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [rideData?.chatMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !isConnected || !rideData) return;

    const timestamp = new Date().toISOString();
    const message: Message = {
      sender: "driver",
      content: messageInput.trim(),
      timestamp,
      type: "text",
    };

    socket.emit("sendMessage", {
      rideId: rideData.ride.rideId,
      sender: "driver",
      message: messageInput.trim(),
      timestamp,
      userId: rideData.customer.id,
      type: "text",
    });

    dispatch(
      addChatMessage({
        requestId: rideData.requestId,
        message,
      })
    );

    setMessageInput("");
  };

  return (
    <div className="space-y-4">
      <ImageCapture rideData={rideData} />
      <div className="h-40 sm:h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-3">
        {(!rideData.chatMessages || rideData.chatMessages.length === 0) && (
          <p className="text-center text-gray-500 text-sm">No messages yet.</p>
        )}
        {rideData.chatMessages?.map((message: Message, index: number) => (
          <div
            key={index}
            className={`flex ${message.sender === "driver" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[70%]">
              {message.type === "text" && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.sender === "driver" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "driver" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {message.type === "image" && message.fileUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={message.fileUrl}
                    alt="Shared content"
                    className="max-w-[200px] h-auto rounded-lg"
                  />
                  <p
                    className={`text-xs mt-1 text-right ${
                      message.sender === "driver" ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2">
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-10"
          onKeyPress={(e) => {
            if (e.key === "Enter" && messageInput.trim()) {
              handleSendMessage();
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          className="h-10 bg-green-600 hover:bg-green-700"
          disabled={!messageInput.trim() || !isConnected}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatSection;