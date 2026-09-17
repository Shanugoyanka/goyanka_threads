import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { pattern, color, lace, length, customText } = await req.json();

    if (!OPENAI_API_KEY) {
      return generatePlaceholderImages(pattern, color, lace, length);
    }

    const views = ["front", "right side", "back", "left side"];
    const imagePromises = views.map((view) => {
      const prompt = buildPrompt(pattern, color, lace, length, customText, view);
      return generateImage(prompt);
    });

    const images = await Promise.all(imagePromises);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Preview generation error:", error);
    return generatePlaceholderImages("", "", "", "");
  }
}

function buildPrompt(
  pattern: string,
  color: string,
  lace: string,
  length: string,
  customText: string,
  view: string
): string {
  return `Professional fashion photography of an Indian bride wearing a beautiful bridal lehenga with a custom ${color} bridal veil/dupatta. The veil features ${pattern} embroidery pattern with ${lace} border/lace edging. The veil is ${length} inches long. ${view} view of the bride. ${customText ? `The veil has "${customText}" embroidered on it.` : ""} Studio lighting, elegant pose, high fashion editorial style. The bride is standing gracefully, showcasing the veil from the ${view}. Warm golden lighting, clean background.`;
}

async function generateImage(prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1792",
      quality: "standard",
      response_format: "url",
    }),
  });

  const data = await response.json();
  return data.data[0].url;
}

function generatePlaceholderImages(_pattern: string, _color: string, _lace: string, _length: string) {
  const placeholders = [
    `https://placehold.co/768x1024/C41E3A/FFFFFF?text=Front+View%0APreview+Coming+Soon&font=playfair-display`,
    `https://placehold.co/768x1024/800020/FFFFFF?text=Right+Side%0APreview+Coming+Soon&font=playfair-display`,
    `https://placehold.co/768x1024/E4007C/FFFFFF?text=Back+View%0APreview+Coming+Soon&font=playfair-display`,
    `https://placehold.co/768x1024/E8879E/FFFFFF?text=Left+Side%0APreview+Coming+Soon&font=playfair-display`,
  ];

  return NextResponse.json({ images: placeholders });
}
