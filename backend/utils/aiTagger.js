import Groq from "groq-sdk";

const getClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const isUsableText = (text) => {
  if (!text || text.trim().length < 50) return false;
  const alphanumeric = text.replace(/[^a-zA-Z0-9\s]/g, "").length;
  const total = text.length;
  return alphanumeric / total > 0.4;
};

export const generateTagsAndDescription = async (text, buffer, mimetype, originalFilename) => {
  try {
    const client = getClient();
    let response;

    const useVision = mimetype.startsWith("image/") || !isUsableText(text);

    if (useVision) {
      if (buffer.length > 4 * 1024 * 1024) {
        return { 
          title: originalFilename, 
          description: "No description", 
          tags: ["untagged"] 
        };
      }

      const base64 = buffer.toString("base64");
      const mimeForVision = mimetype.startsWith("image/") ? mimetype : "image/jpeg";

      response = await client.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeForVision};base64,${base64}`,
                },
              },
              {
                type: "text",
                text: `Analyze this and respond ONLY with valid JSON:
                {
                  "title": "A short meaningful title (max 6 words)",
                  "description": "A brief 1-2 sentence description",
                  "tags": ["tag1", "tag2", "tag3"]
                }
                Max 5 tags.`,
              },
            ],
          },
        ],
        max_tokens: 200,
      });
    } else {
      response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `Based on this document, respond ONLY with valid JSON:
            {
              "title": "A short meaningful title (max 6 words)",
              "description": "A brief 1-2 sentence description",
              "tags": ["tag1", "tag2", "tag3"]
            }
            Max 5 tags.
            Document content: ${text}`,
          },
        ],
        max_tokens: 200,
      });
    }

    const raw = response.choices[0].message.content;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { title: originalFilename, description: "No description", tags: ["untagged"] };

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      title:       parsed.title       || originalFilename,
      description: parsed.description || "No description",
      tags:        parsed.tags        || ["untagged"],
    };
  } catch (err) {
    console.error("AI tagging failed:", err.message);
    return { title: originalFilename, description: "No description", tags: ["untagged"] };
  }
};