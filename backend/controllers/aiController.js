const axios = require('axios');
const Employee = require('../models/Employee');

const getAIRecommendation = async (req, res) => {
  try {
    const employees = await Employee.find();

    const prompt = `
Analyze these employees and provide:
1. Employee ranking
2. Promotion suggestions
3. Training recommendations

Employee Data:
${JSON.stringify(employees, null, 2)}
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResult =
      response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      recommendation: aiResult,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: 'AI API Error',
      error: error.message,
    });
  }
};

module.exports = {
  getAIRecommendation,
};