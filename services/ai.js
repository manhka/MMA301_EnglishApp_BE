import axios from "axios";

const GEMINI_API_KEY = "AIzaSyD2qk4SkrzBwQ8fODE_yAnEbFu9sn2MHxU"; // 👈 Thay bằng key thật của bạn

export const evaluateWriting = async (promptText, writingText) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an IELTS Writing Task 2 examiner. Please evaluate the student's response in the context of the given prompt.

### Prompt:
${promptText}

### Student's Response:
${writingText}

**IMPORTANT:**  
First, check if the student's essay answers the prompt directly.  
- ❗ If the response is completely or mostly off-topic, **give Task Response = 1.0** and **Overall Band Score = 1.0**.  
- ❗ Clearly explain in the feedback that the essay is off-topic.

If the response is relevant, then continue to evaluate normally using the IELTS Band Descriptors:

1. Task Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Please respond with the following plain text format (NO markdown):

Task Response: [score]  
Coherence and Cohesion: [score]  
Lexical Resource: [score]  
Grammatical Range and Accuracy: [score]  
Overall Band Score: [score]  
Suggestions: [concise tips in clear, friendly English]`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resultText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return resultText || "❌ Gemini did not return a valid response.";
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    throw new Error("❌ Failed to evaluate writing using Gemini API.");
  }
};
