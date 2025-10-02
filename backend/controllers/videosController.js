// const prisma = require('../prisma/client');
// const replicate = require('../utils/replicate');
// const { storage, ref, uploadBytesResumable, getDownloadURL } = require('../utils/firebase');
// const fetch = require('node-fetch');

// exports.getVideoFeatures = async (req, res) => {
//   try {
//     const features = await prisma.videosaifeatures.findMany({
//       orderBy: { created_at: 'desc' },
//     });
//     res.json(features);
//   } catch (err) {
//     console.error('Failed to fetch video features:', err.message);
//     res.status(500).json({ error: 'Failed to fetch video features' });
//   }
// };

// exports.generateVideo = async (req, res) => {
//   const {
//     userId,
//     imageUrl,
//     modelUsed,
//     prompt,
//     style,
//     effect,
//     quality,
//     duration,
//     motion_mode,
//     aspect_ratio,
//     negative_prompt,
//   } = req.body;

//   if (!userId || !modelUsed || !imageUrl) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     // 1️⃣ Save original image reference first
//     const originalImage = await prisma.originalimages.create({
//       data: {
//         user_id: parseInt(userId),
//         url: imageUrl,
//       },
//     });
//     console.log('📝 Original image saved:', originalImage);

//     // 2️⃣ Build input options for replicate
//     const inputOptions = {
//       image: imageUrl,
//       style: style || 'None',
//       effect: effect || '',
//       prompt: prompt || '',
//       quality: quality || '1080p',
//       duration: duration || 5,
//       motion_mode: motion_mode || 'normal',
//       aspect_ratio: aspect_ratio || '16:9',
//       negative_prompt: negative_prompt || '',
//     };

//     console.log('🔧 Input options to Replicate:', inputOptions);

//     // 3️⃣ Call replicate
//     const output = await replicate.run(modelUsed, { input: inputOptions });
//     console.log(' Model output received:', output);

//     const videoUrl = output?.url ? output.url() : (Array.isArray(output) ? output[0] : output);
//     if (!videoUrl) {
//       throw new Error('No video URL received from Replicate');
//     }

//     // 4️⃣ Download video
//     const response = await fetch(videoUrl);
//     if (!response.ok) {
//       throw new Error(`Failed to download video: ${response.statusText}`);
//     }
//     const buffer = await response.arrayBuffer();
//     const blob = Buffer.from(buffer);

//     // 5️⃣ Upload to Firebase
//     const filename = `video_${Date.now()}.mp4`;
//     const storageRef = ref(storage, `GeneratedVideos/${filename}`);
//     const uploadResult = await uploadBytesResumable(storageRef, blob, {
//       contentType: 'video/mp4',
//     });

//     const firebaseVideoUrl = await getDownloadURL(uploadResult.ref);
//     console.log('✅ Uploaded to Firebase:', firebaseVideoUrl);

//     // 6️⃣ Save generated video record in DB
//     const savedVideo = await prisma.videos.create({
//       data: {
//         user_id: parseInt(userId),
//         model_used: modelUsed,
//         prompt_used: prompt || null,
//         url: firebaseVideoUrl,
//       },
//     });

//     console.log('🎬 Video record saved:', savedVideo);

//     // 7️⃣ Respond to frontend
//     res.json({
//       success: true,
//       videoId: savedVideo.id,
//       videoUrl: firebaseVideoUrl,
//     });
//   } catch (err) {
//     console.error('❌ Video generation failed:', err.message);
//     res.status(500).json({ error: 'Video generation failed', details: err.message });
//   }
// };

// exports.getGeneratedVideos = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     if (!userId) {
//       return res.status(400).json({ error: 'Missing userId in query' });
//     }
//     const videos = await prisma.videos.findMany({
//       where: { user_id: parseInt(userId) },
//       orderBy: { created_at: 'desc' },
//     });
//     res.json(videos);
//   } catch (err) {
//     console.error('Error fetching videos:', err);
//     res.status(500).json({ error: 'Failed to fetch videos' });
//   }
// };



// controllers/videosController.js
const prisma = require("../prisma/client");
const replicate = require("../utils/replicate");
const { storage, ref, uploadBytesResumable, getDownloadURL } = require("../utils/firebase");
const fetch = require("node-fetch");

exports.getVideoFeatures = async (req, res) => {
  try {
    const features = await prisma.videosaifeatures.findMany({
      orderBy: { created_at: "desc" },
    });
    res.json(features);
  } catch (err) {
    console.error("Failed to fetch video features:", err.message);
    res.status(500).json({ error: "Failed to fetch video features" });
  }
};

exports.generateVideo = async (req, res) => {
  try {
    // ✅ userId from middleware
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const {
      imageUrl,         // Firebase URL from client
      modelUsed,        // e.g. "pixverse/pixverse-v4"
      prompt,
      style,
      effect,
      quality,
      duration,
      motion_mode,
      aspect_ratio,
      negative_prompt,
    } = req.body;

    if (!modelUsed || !imageUrl) {
      return res.status(400).json({ error: "Missing required fields (modelUsed, imageUrl)" });
    }

    // 1) Save original image first
    const originalImage = await prisma.originalimages.create({
      data: { user_id: Number(userId), url: imageUrl },
    });
    console.log("📝 Original image saved:", originalImage.id);

    // 2) Build Replicate input
    const inputOptions = {
      image: imageUrl,
      style: style ?? "None",
      effect: effect ?? "",
      prompt: prompt ?? "",
      quality: quality ?? "720p",
      duration: duration ?? 5,
      motion_mode: motion_mode ?? "normal",
      aspect_ratio: aspect_ratio ?? "16:9",
      negative_prompt: negative_prompt ?? "",
    };

    console.log("🔧 Replicate input:", inputOptions);

    // 3) Run Replicate
    const output = await replicate.run(modelUsed, { input: inputOptions });
    console.log("📦 Raw Replicate output:", output);

    let nodeBuf;
    let replicateVideoUrl = null;

    // --- Handle different output formats ---
    if (Array.isArray(output)) {
      // Case 1: Array of URLs
      replicateVideoUrl = output[0];
    } else if (typeof output === "string") {
      // Case 2: Single string URL
      replicateVideoUrl = output;
    } else if (output && output.url && typeof output.url === "string") {
      // Case 3: Object with .url property
      replicateVideoUrl = output.url;
    } else if (output && typeof output.arrayBuffer === "function") {
      // Case 4: ReadableStream (PixVerse videos)
      console.log("📥 Replicate returned a stream, converting to buffer...");
      const arrayBuffer = await output.arrayBuffer();
      nodeBuf = Buffer.from(arrayBuffer);
    }

    // 4) If we got a URL → download and convert to buffer
    if (replicateVideoUrl) {
      console.log("🎥 Replicate video URL:", replicateVideoUrl);
      const videoResp = await fetch(replicateVideoUrl);
      if (!videoResp.ok) {
        throw new Error(`Failed to download video from Replicate: ${videoResp.status} ${videoResp.statusText}`);
      }
      const arrayBuf = await videoResp.arrayBuffer();
      nodeBuf = Buffer.from(arrayBuf);
    }

    if (!nodeBuf) {
      throw new Error(`No video buffer could be created. Raw output: ${JSON.stringify(output)}`);
    }

    // 5) Upload to Firebase
    const filename = `GeneratedVideos/video_${Date.now()}.mp4`;
    const storageRefObj = ref(storage, filename);
    const uploadTask = await uploadBytesResumable(storageRefObj, nodeBuf, { contentType: "video/mp4" });
    const firebaseVideoUrl = await getDownloadURL(uploadTask.ref);
    console.log("✅ Uploaded to Firebase:", firebaseVideoUrl);

    // 6) Save generated video in DB
    const savedVideo = await prisma.videos.create({
      data: {
        user_id: Number(userId),
        model_used: modelUsed,
        prompt_used: prompt || null,
        url: firebaseVideoUrl,
      },
    });
    console.log("💾 Video row saved:", savedVideo.id);

    // 7) Return to client
    res.json({
      success: true,
      videoId: savedVideo.id,
      videoUrl: firebaseVideoUrl,
    });
  } catch (err) {
    console.error("❌ Video generation failed:", err);
    res.status(500).json({ error: "Video generation failed", details: err.message });
  }
};



// exports.getGeneratedVideos = async (req, res) => {
//   try {
//     // or use req.user.id; your choice
//     const userId = req.query.userId ? Number(req.query.userId) : req.user?.id;
//     if (!userId) return res.status(400).json({ error: "Missing userId" });

//     const videos = await prisma.videos.findMany({
//       where: { user_id: Number(userId) },
//       orderBy: { created_at: "desc" },
//     });
//     res.json(videos);
//   } catch (err) {
//     console.error("Error fetching videos:", err);
//     res.status(500).json({ error: "Failed to fetch videos" });
//   }
// };
