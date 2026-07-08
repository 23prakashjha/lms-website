import OpenAI from 'openai';

const getAIResponse = async (messages) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful learning assistant for PrakashEdu, an online learning platform. Help students with their questions about courses, programming, technology, and general learning topics. Be concise, accurate, and encouraging.'
          },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      return null;
    }
  }
  return null;
};

const getFallbackResponse = (message) => {
  const q = message.toLowerCase();

  if (q.includes('hello') || q.includes('hi ') || q === 'hi' || q === 'hello') {
    return 'Hello! Welcome to PrakashEdu. I\'m your AI learning assistant. How can I help you today? You can ask me about courses, programming, or any learning-related questions!';
  }

  if (q.includes('course') || q.includes('learn')) {
    if (q.includes('mern') || q.includes('react') || q.includes('node') || q.includes('javascript') || q.includes('web')) {
      return 'We offer a Complete MERN Stack course covering MongoDB, Express.js, React.js, and Node.js. You\'ll also learn HTML5, CSS3, JavaScript, REST APIs, JWT Authentication, and Git & GitHub. It\'s suitable for beginner to advanced levels!';
    }
    if (q.includes('python') || q.includes('data science') || q.includes('machine learning')) {
      return 'PrakashEdu offers comprehensive courses in Python programming, Data Science, and Machine Learning. Our courses include hands-on projects and real-world applications!';
    }
    if (q.includes('dsa') || q.includes('data structure') || q.includes('algorithm')) {
      return 'Our DSA Masterclass covers arrays, linked lists, trees, graphs, dynamic programming, and more. It\'s designed to help you crack technical interviews at top companies!';
    }
    return 'PrakashEdu offers a wide range of courses including Web Development (MERN Stack), DSA, Python, JavaScript, and more. Browse our course catalog to find the right course for you!';
  }

  if (q.includes('certificate') || q.includes('certification')) {
    return 'Upon completing a course on PrakashEdu, you\'ll receive a Certificate of Completion, Achievement, or Excellence based on your performance. Each certificate has a unique ID and can be verified online at /verify page.';
  }

  if (q.includes('price') || q.includes('cost') || q.includes('fee') || q.includes('payment')) {
    return 'Course pricing varies by program. We offer both free and premium courses. Premium courses provide additional resources, projects, and instructor support. Check individual course pages for pricing details!';
  }

  if (q.includes('assignment') || q.includes('homework') || q.includes('project')) {
    return 'Assignments and projects are an important part of the learning experience at PrakashEdu. They help reinforce concepts and build your portfolio. Complete them on time to track your progress!';
  }

  if (q.includes('quiz') || q.includes('test') || q.includes('exam') || q.includes('assessment')) {
    return 'Quizzes help you assess your understanding of the material. Each course includes quizzes at key milestones. Aim for a high score to earn better certificates!';
  }

  if (q.includes('instructor') || q.includes('teacher') || q.includes('mentor')) {
    return 'Our instructors are industry professionals with years of experience. They provide guidance, feedback, and support throughout your learning journey at PrakashEdu.';
  }

  if (q.includes('time') || q.includes('duration') || q.includes('how long')) {
    return 'Course durations vary. Most courses are designed to be completed in 4-12 weeks, with 5-10 hours of commitment per week. You can learn at your own pace!';
  }

  if (q.includes('job') || q.includes('career') || q.includes('placement') || q.includes('interview')) {
    return 'PrakashEdu courses are designed to make you job-ready. With practical projects, DSA training, and certificates, you\'ll build a strong portfolio. Our DSA course specifically helps with technical interview preparation!';
  }

  if (q.includes('thank')) {
    return 'You\'re welcome! I\'m happy to help. If you have any more questions, feel free to ask. Happy learning with PrakashEdu!';
  }

  if (q.includes('help') || q.includes('support') || q.includes('contact')) {
    return 'For support, you can reach out via the Contact page, send us a message through the chat system, or check our About page for more information. I\'m here to help with learning questions too!';
  }

  return 'That\'s a great question! I\'m here to help you with your learning journey at PrakashEdu. You can ask me about our courses, certificates, assignments, quizzes, or any programming and technology topics. If you need more specific assistance, please provide more details!';
};

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const userMessage = message.trim();

    let aiResponse = null;

    if (process.env.OPENAI_API_KEY) {
      aiResponse = await getAIResponse([
        { role: 'user', content: userMessage }
      ]);
    }

    if (!aiResponse) {
      aiResponse = getFallbackResponse(userMessage);
    }

    res.json({
      success: true,
      response: aiResponse,
      source: process.env.OPENAI_API_KEY && aiResponse ? 'ai' : 'local'
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ message: 'Failed to get response' });
  }
};

export const chatWithAIContext = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    let aiResponse = null;

    if (process.env.OPENAI_API_KEY) {
      aiResponse = await getAIResponse(messages);
    }

    if (!aiResponse) {
      const lastUserMsg = messages.filter(m => m.role === 'user').pop();
      aiResponse = getFallbackResponse(lastUserMsg?.content || '');
    }

    res.json({
      success: true,
      response: aiResponse,
      source: process.env.OPENAI_API_KEY && aiResponse ? 'ai' : 'local'
    });
  } catch (error) {
    console.error('AI Chat context error:', error);
    res.status(500).json({ message: 'Failed to get response' });
  }
};
