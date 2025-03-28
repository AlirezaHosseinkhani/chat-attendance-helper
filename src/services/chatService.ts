
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: 'like' | 'dislike' | null;
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
