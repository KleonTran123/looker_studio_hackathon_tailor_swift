const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.generateAnalysis = async (params, data) => {
  // Initialize the Google Generative AI instance
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      candidateCount: 1,
      maxOutputTokens: 512,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
  });

  // Prepare the dynamic prompt
  const prompt = `
    Provide a short analysis of less than 200 words suitable for a ${params.job_title} in ${params.language_name} based on the following data:
    ${JSON.stringify(data)}

    Do not give a title get right into the analysis!
       Do not use characters of this style * #
  `;

  try {
    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Log the entire result to inspect its structure
    console.log('Gemini AI generateContent result:', JSON.stringify(result, null, 2));

    // Validate the response structure
    if (
      !result ||
      !result.response ||
      !Array.isArray(result.response.candidates) ||
      result.response.candidates.length === 0 ||
      !result.response.candidates[0].content ||
      !Array.isArray(result.response.candidates[0].content.parts) ||
      result.response.candidates[0].content.parts.length === 0 ||
      !result.response.candidates[0].content.parts[0].text
    ) {
      throw new Error("Invalid response structure from the AI model.");
    }

    // Extract the analysis text
    const analysisText = result.response.candidates[0].content.parts
      .map(part => part.text)
      .join(' '); 
    console.log('Analysis Text:', analysisText);
    console.log('Type of analysisText:', typeof analysisText);

    return analysisText;
  } catch (error) {
    console.error('Error generating analysis:', error);
    throw error;
  }
};
