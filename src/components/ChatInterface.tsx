
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate random session ID
  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: "سلام! من دستیار هوشمند اطلس هستم. چطور می‌توانم کمکت کنم؟",
      isUser: false,
      timestamp: new Date()
    };
    setTimeout(() => {
      setMessages([welcomeMessage]);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    if (waitingForFeedback) {
      toast({
        title: "لطفا به پاسخ قبلی واکنش دهید",
        description: "لطفا قبل از ارسال سوال جدید، به پاسخ قبلی واکنش دهید",
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
      const response = await sendMessage(userMessage.content, sessionId);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        feedback: null,
        question: userMessage.content
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

    const messageToUpdate = messages.find(msg => msg.id === messageId);

    if (!messageToUpdate || messageToUpdate.isUser) {
      return;
    }

    try {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, feedback } : msg
        )
      );

      if (messageToUpdate.question) {
        await sendFeedback(
          messageToUpdate.question,
          messageToUpdate.content,
          sessionId,
          feedback,
        );

        toast({
          title: "با تشکر از بازخورد شما",
          description: feedback === 'like' ? "از پاسخ شما متشکریم" : "از پاسخ شما متشکریم، تلاش می‌کنیم بهتر شویم",
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
        <h1 className="text-xl font-medium">  دستیار هوشمند اطلس  </h1>
        <Clock className="h-5 w-5 mr-2 text-primary" />
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            onFeedback={!message.isUser && messages.findIndex(m => m.id === message.id) !== 0 ? handleFeedback : undefined}

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
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="چجوری میتونم کمکت کنم؟..."
            className="bg-white/80"
            disabled={isLoading || waitingForFeedback}
            autoComplete="off"
            dir="rtl"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || waitingForFeedback}
            className="transition-all duration-300 ease-in-out"
          >
            <Send className="h-4 w-4 -scale-x-100" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChatInterface;
