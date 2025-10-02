require("dotenv").config();

const prisma = require('../prisma/client');
const { storage, ref, uploadBytesResumable, getDownloadURL } = require('../utils/firebase');
const fetch = require('node-fetch');

exports.generateImage = async (req, res) => {
  const { userId, prompt } = req.body;
  console.log("Request received:", { userId, prompt });

  if (!userId || !prompt) {
    console.error("Missing required fields: userId or prompt");
    return res.status(400).json({ error: "Missing userId or prompt" });
  }

  try {
    // 1️⃣ Call OpenRouter Image Generation Model
    const body = {
      model: "stability-ai/sdxl:free",   // 👈 Free Stable Diffusion XL model
      prompt: prompt,
      size: "1024x1024", // optional
      n: 1
    };

    const response = await fetch("https://openrouter.ai/api/v1/images", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-site.com",
        "X-Title": "Your App Name",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📥 OpenRouter Image Response:", data);

    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) throw new Error("No image returned from model");

    // 2️⃣ Download the generated image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error("Failed to download image");
    const buffer = await imageResponse.arrayBuffer();
    const blob = Buffer.from(buffer);

    // 3️⃣ Upload to Firebase
    const filename = `generated_${Date.now()}.jpg`;
    const storageRef = ref(storage, `PicNovaGenerated/${filename}`);
    await uploadBytesResumable(storageRef, blob, { contentType: "image/jpeg" });
    const firebaseImageUrl = await getDownloadURL(storageRef);

    console.log("✅ Uploaded to Firebase:", firebaseImageUrl);

    // 4️⃣ Save record in DB
    const generated = await prisma.generatedimages.create({
      data: {
        user_id: parseInt(userId),
        model_used: "stability-ai/sdxl:free",
        url: firebaseImageUrl,
        prompt_used: prompt,
      },
    });

    console.log("📝 Image record saved:", generated);

    // 5️⃣ Respond to frontend
    res.json({
      success: true,
      generatedImageId: generated.id,
      generatedImageUrl: firebaseImageUrl,
    });

  } catch (error) {
    console.error("Generation failed:", error.message);
    res.status(500).json({ error: "Generation failed", details: error.message });
  }
};
