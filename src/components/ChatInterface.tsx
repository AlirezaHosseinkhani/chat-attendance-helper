
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Clock } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import { Message, sendMessage, sendFeedback } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForFeedback, setWaitingForFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to the most recent message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add welcome message on initial load
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: "سلام! من دستیار حضور و غیاب شما هستم. چطور می‌توانم به شما کمک کنم؟",
      isUser: false,
      timestamp: new Date()
    };
    
    // Add a slight delay for the welcome message to appear naturally
    setTimeout(() => {
      setMessages([welcomeMessage]);
    }, 800);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Check if waiting for feedback on the last bot message
    if (waitingForFeedback) {
      toast({
        title: "لطفا بازخورد دهید",
        description: "لطفا قبل از ارسال سوال جدید، به پاسخ قبلی بازخورد دهید",
        variant: "destructive"
      });
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await sendMessage(userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        feedback: null,
        question: userMessage.content // Store the question for later feedback
      };
      
      setMessages(prev => [...prev, botMessage]);
      setWaitingForFeedback(true);
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در دریافت پاسخ. لطفا دوباره تلاش کنید.",
        variant: "destructive"
      });
      console.error("Error getting response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, feedback: 'like' | 'dislike') => {
    // Find the message to update
    const messageToUpdate = messages.find(msg => msg.id === messageId);
    
    if (!messageToUpdate || messageToUpdate.isUser) {
      return;
    }
    
    try {
      // Update the message in state first
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, feedback } : msg
        )
      );
      
      // Send feedback to the API
      if (messageToUpdate.question) {
        await sendFeedback(
          messageToUpdate.question,
          messageToUpdate.content,
          feedback
        );
        
        toast({
          title: "با تشکر از بازخورد شما",
          description: feedback === 'like' ? "از پاسندیدن پاسخ متشکریم" : "از بازخورد شما متشکریم، تلاش می‌کنیم بهتر شویم",
        });
      }
      
      // Allow user to ask a new question
      setWaitingForFeedback(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در ارسال بازخورد';
      
      toast({
        title: "خطا",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Revert the feedback if API call failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, feedback: null } : msg
        )
      );
      console.error("Error sending feedback:", error);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl w-full glass-panel border-none mx-auto overflow-hidden" dir="rtl">
      <div className="flex items-center justify-center border-b p-4">
        <Clock className="h-5 w-5 mr-2 text-primary" />
        <h1 className="text-xl font-medium">دستیار حضور و غیاب</h1>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map(message => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onFeedback={!message.isUser ? handleFeedback : undefined} 
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-end animate-fade-in opacity-0" style={{ animationDelay: "100ms" }}>
            <TypingIndicator />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim() || waitingForFeedback}
            className="transition-all duration-300 ease-in-out"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="درباره حضور و غیاب، مرخصی یا ساعات کاری بپرسید..."
            className="bg-white/80"
            disabled={isLoading || waitingForFeedback}
            autoComplete="off"
            dir="rtl"
          />
        </div>
      </form>
    </Card>
  );
};

export default ChatInterface;
