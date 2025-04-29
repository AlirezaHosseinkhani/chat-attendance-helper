
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: 'like' | 'dislike' | null;
  question?: string;
  session_id?: string;

}

export const sendMessage = async (question: string, session_id: string): Promise<string> => {
  try {
    const response = await fetch('http://192.168.8.82:8000/api/v1/chat/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, session_id })
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw server's error message
      throw new Error(data.detail || 'خطایی رخ داده است');
    }

    console.log(data.answer);
    return data.answer || data; // Handle different response formats
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw new Error(error.message || 'خطا در ارتباط با سرور');
  }
};


export const sendFeedback = async (question: string, answer: string, session_id: string, feedback: 'like' | 'dislike'): Promise<boolean> => {
  try {
    // const response = await fetch('http://192.168.0.116:5000/feedback', {

    const response = await fetch('http://192.168.8.82:8000/api/v1/feedback/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        answer,
        session_id,
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