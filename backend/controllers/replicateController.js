const prisma = require('../prisma/client');
const replicate = require('../utils/replicate');
const { storage, ref, uploadBytesResumable, getDownloadURL } = require('../utils/firebase');
const fetch = require('node-fetch');


const modelInputSchemas = {
  'flux-kontext-apps/restore-image': 'input_image',
  'minimax/image-01': 'subject_reference',
  'some-other-model': 'image',
};
exports.enhanceImage = async (req, res) => {
  const { userId, imageUrl, modelUsed, prompt } = req.body;
  console.log(" Request received:", { userId, imageUrl, modelUsed, prompt });

  if (!userId || !modelUsed) {
    console.error(" Missing required fields: userId or modelUsed");
    return res.status(400).json({ error: "Missing userId or modelUsed" });
  }

  try {
    // 1️⃣ Save the original image first
    const originalImage = await prisma.originalimages.create({
      data: {
        user_id: parseInt(userId),
        url: imageUrl,
      },
    });
    console.log("📝 Original image saved:", originalImage);

    const inputOptions = {};
    // 3. Apply prompt if provided
    if (prompt) {
      inputOptions.prompt = prompt;
    }

    // 4. Determine correct key using mapping
    const imageKey = modelInputSchemas[modelUsed] || 'image';

    if (imageUrl) {
      inputOptions[imageKey] = imageUrl; // dynamically assign correct key
    }

    // 5. Optional: model-specific configurations
    // if (modelUsed === 'minimax/image-01') {
    //   inputOptions.aspect_ratio = "3:4";
    //   inputOptions.prompt_optimizer = true;
    //   inputOptions.number_of_images = 1;
    // }

    console.log("🔧 Input options to Replicate:", inputOptions);

    // 6. Run model via Replicate API
    const output = await replicate.run(modelUsed, { input: inputOptions });
    console.log(" Model output received:", output);

    const enhancedImageUrl = Array.isArray(output) ? output[0] : output;
    console.log("Enhanced image URL:", enhancedImageUrl);

    const imageResponse = await fetch(enhancedImageUrl);
    if (!imageResponse.ok) {
      console.error(" Failed to download image:", imageResponse.statusText);
      throw new Error("Failed to download enhanced image");
    }

    const buffer = await imageResponse.arrayBuffer();
    const blob = Buffer.from(buffer);
    console.log("Image downloaded and buffer created");

    const filename = `enhanced_${Date.now()}.jpg`;
    const storageRef = ref(storage, `PicNovaPromptEnhanced/${filename}`);
    console.log("Uploading to Firebase Storage...");

    const uploadResult = await uploadBytesResumable(storageRef, blob, {
      contentType: "image/jpeg",
    });

    const firebaseImageUrl = await getDownloadURL(uploadResult.ref);
    console.log("Uploaded to Firebase. Download URL:", firebaseImageUrl);

    const enhanced = await prisma.enhancedimages.create({
      data: {
        user_id: parseInt(userId),
        model_used: modelUsed,
        url: firebaseImageUrl,
        prompt_used: prompt || null,
      },
    });

    console.log(" Image record saved to database:", enhanced);

    res.json({
      success: true,
      enhancedImageId: enhanced.id,
      enhancedImageUrl: firebaseImageUrl,
    });
  } catch (error) {
    console.error(" Enhancement failed:", error.message);
    res.status(500).json({ error: "Enhancement failed", details: error.message });
  }
};

exports.getEnhancedImages = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("Fetching enhanced images for userId:", userId);
    if (!userId) {
      return res.status(400).json({ error: "Missing userId in query" });
    }
    const parseduserId = parseInt(userId);
    const images = await prisma.enhancedimages.findMany({
      where: { user_id: parseduserId },
      orderBy: { enhanced_at: 'desc' },
    });

    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// exports.getEnhancedImages = async (req, res) => {
//   try {
//     const images = await prisma.enhancedimages.findMany({
//       orderBy: { enhanced_at: 'desc' },
//     });
//     res.json(images);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch images" });
//   }
// };
