
import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/services/chatService";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback }) => {
  const isUser = message.isUser;
  const formattedTime = new Intl.DateTimeFormat('fa-IR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(message.timestamp);

  const handleFeedback = (feedback: 'like' | 'dislike') => {
    if (onFeedback) {
      onFeedback(message.id, feedback);
    }
  };

  return (
    <div
      className={cn(
        "mb-4 animate-fade-in opacity-0",
        isUser ? "flex justify-start" : "flex justify-end"
      )}
      style={{ animationDelay: "100ms" }}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tl-none"
            : "glass-panel rounded-tr-none"
        )}
      >
        <p className="text-base leading-relaxed" dir="rtl">{message.content}</p>
        <div
          className={cn(
            "text-xs mt-1",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
          dir="rtl"
        >
          {formattedTime}
        </div>

        {!isUser && onFeedback && (
          <div className="mt-2 flex items-center justify-end gap-3" dir="rtl">
            <button
              onClick={() => handleFeedback('dislike')}
              className={cn(
                "p-1 rounded-full transition-colors",
                message.feedback === 'dislike' ? "bg-red-100 text-red-600" : "text-muted-foreground hover:text-red-600"
              )}
              aria-label="disLike"
            >
              <ThumbsDown size={16} />
            </button>
            <button
              onClick={() => handleFeedback('like')}
              className={cn(
                "p-1 rounded-full transition-colors",
                message.feedback === 'like' ? "bg-green-100 text-green-600" : "text-muted-foreground hover:text-green-600"
              )}
              aria-label="like"
            >
              <ThumbsUp size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;