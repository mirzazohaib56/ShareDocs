import Groq from "groq-sdk";

const getClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateTags = async (title, description) => {
  try {
    const client = getClient();
    
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Based on this document title and description, generate relevant tags.
          Respond ONLY with valid JSON:
          {"tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]}
          Max 5 tags. Keep them short and relevant.
          
          Title: ${title}
          Description: ${description}`,
        },
      ],
      max_tokens: 100,
    });

    const raw = response.choices[0].message.content;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return ["untagged"];
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.tags || ["untagged"];

  } catch (err) {
    console.error("Tag generation failed:", err.message);
    return ["untagged"];
  }
};