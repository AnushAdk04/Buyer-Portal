const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @desc    Chat with AI Assistant (Gemini)
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-lite',
      systemInstruction: `You are the "BuyerPortal AI Assistant", a friendly and professional real estate expert. 
      Your goal is to help users navigate the BuyerPortal website and provide expert real estate advice.
      
      Capabilities:
      1. Explain portal features (Search, Favourites, Property Comparison, EMI Calculator).
      2. Provide advice on buying, renting, or selling properties.
      3. Help with mortgage/EMI concepts.
      4. If a user asks to find a property, suggest they use our "Advanced Filter" sidebar on the Dashboard.
      
      Personality:
      - Concise but helpful.
      - Professional yet approachable.
      - Never make up properties that don't exist; instead, guide them to use our search tools.
      - If you don't know something, be honest.
      
      Current Date: ${new Date().toLocaleDateString()}`
    });

    // Gemini requires the first message in history to be from the 'user'
    let geminiHistory = (history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Find the first index where role is 'user'
    const firstUserIndex = geminiHistory.findIndex(msg => msg.role === 'user');
    if (firstUserIndex !== -1) {
      geminiHistory = geminiHistory.slice(firstUserIndex);
    } else {
      geminiHistory = []; // Clear if no user message found
    }

    const chat = model.startChat({
      history: geminiHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const aiMessage = response.text();

    res.status(200).json({
      message: aiMessage
    });
  } catch (error) {
    console.error('AI Chat Error (Gemini):', error);
    res.status(500).json({
      message: 'The AI assistant is temporarily unavailable. Please check your API key.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  chatWithAI,
};
