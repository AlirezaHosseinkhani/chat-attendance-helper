
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 py-2 px-4 rounded-full bg-primary/5 w-fit" dir="rtl">
      <span className="w-2 h-2 rounded-full bg-primary/60 animate-typing-1"></span>
      <span className="w-2 h-2 rounded-full bg-primary/60 animate-typing-2"></span>
      <span className="w-2 h-2 rounded-full bg-primary/60 animate-typing-3"></span>
    </div>
  );
};

export default TypingIndicator;