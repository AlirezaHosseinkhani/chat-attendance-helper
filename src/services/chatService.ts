
import { getDummyResponse } from "@/utils/dummyData";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// This will be replaced with actual API call in the future
export const sendMessage = async (question: string): Promise<string> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Get dummy response for now
  return getDummyResponse(question);
  
  // TODO: Replace with actual API call
  // const response = await fetch('YOUR_API_ENDPOINT', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ question })
  // });
  
  // if (!response.ok) {
  //   throw new Error('Failed to get response');
  // }
  
  // const data = await response.json();
  // return data.answer;
};
