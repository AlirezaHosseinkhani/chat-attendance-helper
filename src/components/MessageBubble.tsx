
import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/services/chatService";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.isUser;
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(message.timestamp);

  return (
    <div 
      className={cn(
        "mb-4 animate-fade-in opacity-0",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
      style={{ animationDelay: "100ms" }}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "glass-panel rounded-tl-none"
        )}
      >
        <p className="text-base leading-relaxed">{message.content}</p>
        <div 
          className={cn(
            "text-xs mt-1", 
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
