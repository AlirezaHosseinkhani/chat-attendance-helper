
import React from "react";
import ChatInterface from "@/components/ChatInterface";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/50" dir="rtl">
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <div className="bg-primary/5 rounded-full p-3 mb-2">
          <div className="text-primary text-2xl">
            <span className="sr-only">آیکون حضور و غیاب</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-light tracking-tight mb-1">دستیار هوشمند حضور و غیاب</h1>
        <p className="text-muted-foreground text-center max-w-md">
          دستیار هوشمند شما برای تمامی سوالات مربوط به وب سایت اطلس 
        </p>
      </div>
      
      <ChatInterface />
      
      <footer className="mt-8 text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
        <p>پاسخگویی به سوالات مربوط به آموزش، انواع دستگاه ها و اخبار سایت</p>
      </footer>
    </div>
  );
};

export default Index;
