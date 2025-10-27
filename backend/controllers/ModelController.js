const prisma = require('../prisma/client');
const replicate = require('../utils/replicate');
const { storage, ref, uploadBytesResumable, getDownloadURL } = require('../utils/firebase');
const fetch = require('node-fetch');

// controllers/MockModelController.js

exports.mockEnhanceImage = async (req, res) => {
  const { userId, modelUsed, prompt } = req.body;

  console.log("🎨 Mock enhancement request:", { userId, modelUsed, prompt });

  // Simulate step-by-step progress
  try {
    // Fixed image URL for mock
    const fixedImageUrl =
      "https://firebasestorage.googleapis.com/v0/b/basit-b2712.appspot.com/o/CardiFy%2Fbirthday1.png?alt=media&token=6ffaad1c-9897-4549-954d-696d56af3582";

    // Send progress updates via simple response after delays
    setTimeout(() => console.log("⏳ Step 1: Preparing input..."), 1000);
    setTimeout(() => console.log("⚙️ Step 2: Generating image..."), 2500);
    setTimeout(() => console.log("📤 Step 3: Uploading to Firebase..."), 4000);

    // After some time, send the mock response
    setTimeout(() => {
      console.log("✅ Enhancement completed.");
      res.json({
        success: true,
        enhancedImageUrl: fixedImageUrl,
        createdAt: new Date(),
        promptUsed: prompt,
      });
    }, 5000);
  } catch (err) {
    console.error("Mock enhancement failed:", err);
    res.status(500).json({ error: "Mock enhancement failed" });
  }
};

// const modelInputSchemas = {
//   'flux-kontext-apps/restore-image': 'input_image',
//   'minimax/image-01': 'subject_reference',
//   'some-other-model': 'image',
// };


// exports.enhanceImage = async (req, res) => {
//   const { userId, imageUrl, modelUsed, prompt } = req.body;
//   console.log(" Request received:", { userId, imageUrl, modelUsed, prompt });

//   if (!userId || !modelUsed) {
//     console.error(" Missing required fields: userId or modelUsed");
//     return res.status(400).json({ error: "Missing userId or modelUsed" });
//   }

//   try {
//     // 1️⃣ Save the original image first
//     const originalImage = await prisma.originalimages.create({
//       data: {
//         user_id: parseInt(userId),
//         url: imageUrl,
//       },
//     });
//     console.log("📝 Original image saved:", originalImage);

//     const inputOptions = {};
//     // 3. Apply prompt if provided
//     if (prompt) {
//       inputOptions.prompt = prompt;
//     }

//     // 4. Determine correct key using mapping
//     const imageKey = modelInputSchemas[modelUsed] || 'image';

//     if (imageUrl) {
//       inputOptions[imageKey] = imageUrl; // dynamically assign correct key
//     }

//     // 5. Optional: model-specific configurations
//     // if (modelUsed === 'minimax/image-01') {
//     //   inputOptions.aspect_ratio = "3:4";
//     //   inputOptions.prompt_optimizer = true;
//     //   inputOptions.number_of_images = 1;
//     // }

//     console.log("🔧 Input options to Replicate:", inputOptions);

//     // 6. Run model via Replicate API
//     const output = await replicate.run(modelUsed, { input: inputOptions });
//     console.log(" Model output received:", output);

//     const enhancedImageUrl = Array.isArray(output) ? output[0] : output;
//     console.log("Enhanced image URL:", enhancedImageUrl);

//     const imageResponse = await fetch(enhancedImageUrl);
//     if (!imageResponse.ok) {
//       console.error(" Failed to download image:", imageResponse.statusText);
//       throw new Error("Failed to download enhanced image");
//     }

//     const buffer = await imageResponse.arrayBuffer();
//     const blob = Buffer.from(buffer);
//     console.log("Image downloaded and buffer created");

//     const filename = `enhanced_${Date.now()}.jpg`;
//     const storageRef = ref(storage, `PicNovaPromptEnhanced/${filename}`);
//     console.log("Uploading to Firebase Storage...");

//     const uploadResult = await uploadBytesResumable(storageRef, blob, {
//       contentType: "image/jpeg",
//     });

//     const firebaseImageUrl = await getDownloadURL(uploadResult.ref);
//     console.log("Uploaded to Firebase. Download URL:", firebaseImageUrl);

//     const enhanced = await prisma.enhancedimages.create({
//       data: {
//         user_id: parseInt(userId),
//         model_used: modelUsed,
//         url: firebaseImageUrl,
//         prompt_used: prompt || null,
//       },
//     });

//     console.log(" Image record saved to database:", enhanced);

//     res.json({
//       success: true,
//       enhancedImageId: enhanced.id,
//       enhancedImageUrl: firebaseImageUrl,
//     });
//   } catch (error) {
//     console.error(" Enhancement failed:", error.message);
//     res.status(500).json({ error: "Enhancement failed", details: error.message });
//   }
// };

// ✅ controllers/ModelController.js


exports.getGeneratedImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    console.log(`📥 Fetching generated images for userId: ${userId}, page: ${page}`);

    const images = await prisma.userGeneratedImage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        imageUrl: true,
        prompt: true,
        templateId: true,
        createdAt: true,
      },
    });

    const totalCount = await prisma.userGeneratedImage.count({ where: { userId } });

    const formatted = images.map((img) => ({
      id: img.id,
      url: img.imageUrl,
      prompt: img.prompt,
      templateId: img.templateId,
      createdAt: img.createdAt,
    }));

    res.json({
      images: formatted,
      hasMore: skip + limit < totalCount, // ✅ tells frontend if more pages exist
    });
  } catch (err) {
    console.error("❌ Error fetching generated images:", err);
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
