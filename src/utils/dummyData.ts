
interface QAPair {
  question: RegExp;
  answer: string;
}

const dummyData: QAPair[] = [
  {
    question: /\b(hi|hello|hey)\b/i,
    answer: "Hello! I'm your attendance assistant. How can I help you today?"
  },
  {
    question: /\b(how are you|how're you|how you doing)\b/i,
    answer: "I'm functioning perfectly! Thank you for asking. What attendance information do you need?"
  },
  {
    question: /\b(work hours|working hours|office hours)\b/i,
    answer: "Standard working hours are Monday to Friday, 9:00 AM to 5:00 PM. Flexible working arrangements may be available based on your team policy."
  },
  {
    question: /\b(time off|vacation|leave|pto)\b/i,
    answer: "To request time off, please specify the dates and reason. You currently have 15 days of PTO available for the year."
  },
  {
    question: /\b(sick|sick leave|sick day)\b/i,
    answer: "I've noted that you're not feeling well. Would you like me to register a sick day for today? You have 5 sick days remaining this year."
  },
  {
    question: /\b(overtime|extra hours|additional hours)\b/i,
    answer: "I see you're inquiring about overtime. You've worked 4 hours of overtime this month. Would you like to see details or log additional hours?"
  },
  {
    question: /\b(holiday|holidays|company holiday)\b/i,
    answer: "The upcoming company holidays are: Memorial Day (May 27), Independence Day (July 4), and Labor Day (September 2)."
  },
  {
    question: /\b(check in|clock in|punch in|sign in)\b/i,
    answer: "I've registered your check-in time at 8:58 AM today. Have a productive day!"
  },
  {
    question: /\b(check out|clock out|punch out|sign out)\b/i,
    answer: "I've registered your check-out time at 5:03 PM today. Your total working hours for today: 8 hours and 5 minutes. Have a great evening!"
  },
  {
    question: /\b(attendance record|attendance history)\b/i,
    answer: "Your attendance has been excellent this month with a 100% on-time record. You've worked 160 hours with no absences."
  },
  {
    question: /\b(late|tardy|lateness)\b/i,
    answer: "I understand you might be running late today. Would you like me to notify your team? Your current tardy count this month is 0."
  },
  {
    question: /\b(break|lunch|rest)\b/i,
    answer: "Standard break policy includes a 1-hour lunch break and two 15-minute breaks. Would you like me to start tracking your break now?"
  }
];

export const getDummyResponse = (question: string): string => {
  // Try to find a matching question in our dummy data
  for (const pair of dummyData) {
    if (pair.question.test(question)) {
      return pair.answer;
    }
  }
  
  // Default response if no match found
  return "I don't have specific information about that yet. For attendance questions, try asking about work hours, time off, sick leave, or check-in/out procedures.";
};
