
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: 'like' | 'dislike' | null;
  question?: string; // Add question field to store the related question
}

export const sendMessage = async (question: string): Promise<string> => {
  try {
    const response = await fetch('http://127.0.0.1:5000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    });
    
    if (!response.ok) {
      throw new Error('خطا در دریافت پاسخ');
    }
    
    const data = await response.json();
    return data.answer || data; // Handle different response formats
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('خطا در ارتباط با سرور');
  }
};

export const sendFeedback = async (question: string, answer: string, feedback: 'like' | 'dislike'): Promise<boolean> => {
  try {
    const response = await fetch('http://127.0.0.1:5000/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        answer,
        feedback
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'خطا در ارسال بازخورد');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw error;
  }
};
