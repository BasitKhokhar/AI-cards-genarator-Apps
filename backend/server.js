
const app = require('./app');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

// require("dotenv").config();

// const jwt = require('jsonwebtoken');

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const bcrypt = require('bcrypt');

// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const app = express();
// app.use(cors());
// app.use(express.json());


// const Replicate = require("replicate");
// const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");
// const { initializeApp } = require("firebase/app");
// const fetch = require("node-fetch");

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// });

// // const bucket = admin.storage().bucket();
// const admin = require('firebase-admin');
// const serviceAccount = require('./basit-b2712-firebase-adminsdk-jrij1-16a873b97c.js'); // correct path

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET // ✅ must match project ID
// });

// const bucket = admin.storage().bucket();

// // ✅ Firebase config (replace with your own values)
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

// // Initialize Firebase app and storage
// const firebaseApp = initializeApp(firebaseConfig);
// const storage = getStorage(firebaseApp);

// bucket.getFiles({ prefix: 'test/' }) // You can use any prefix or leave it empty
//   .then(data => {
//     const files = data[0];
//     console.log(`✅ Firebase Admin is connected. Found ${files.length} files.`);
//   })
//   .catch(error => {
//     console.error("❌ Firebase Admin connection failed:", error.message);
//   });
// // MySQL Connect database
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     return;
//   }
//   console.log("Connected to MySQL database");
// });

// app.get("/test-db", (req, res) => {
//   db.query("SELECT 1", (err, result) => {
//     if (err) {
//       console.error("DB test query failed:", err);
//       return res.status(500).send("❌ Database NOT connected");
//     }
//     res.send("✅ Database is connected");
//   });
// });

// app.get('/', (req, res) => {
//   return res.json("i am Basit fron backend")
// })
// // replicate API
// // router.post('/enhance-prompt', async (req, res) => {
// app.post('/enhance', async (req, res) => {
//   const { userId, imageUrl, modelUsed, prompt } = req.body;
//   console.log("Data received:", { userId, imageUrl, modelUsed, prompt });

//   if (!userId || !modelUsed) {
//     return res.status(400).json({ error: "Missing userId or modelUsed" });
//   }

//   try {
//     // Optional: Save original image in DB
//     let originalId = null;
//     if (imageUrl) {
//       const [originalResult] = await db.promise().query(
//         'INSERT INTO original_images (user_id, url) VALUES (?, ?)',
//         [userId, imageUrl]
//       );
//       originalId = originalResult.insertId;
//     }

//     // Build input options based on model type
//     const inputOptions = {};

//     // Dynamic input mapping per model
//     if (modelUsed === 'minimax/image-01') {
//       if (prompt) inputOptions.prompt = prompt;
//       if (imageUrl) inputOptions.subject_reference = imageUrl;
//       inputOptions.aspect_ratio = "3:4"; // you can accept this from frontend too
//       inputOptions.prompt_optimizer = true;
//       inputOptions.number_of_images = 1;
//     } else {
//       if (prompt) inputOptions.prompt = prompt;
//       if (imageUrl) inputOptions.image = imageUrl;
//     }

//     // Run Replicate model
//     const output = await replicate.run(modelUsed, { input: inputOptions });
//     const enhancedImageUrl = Array.isArray(output) ? output[0] : output;

//     // Download enhanced image
//     const imageResponse = await fetch(enhancedImageUrl);
//     if (!imageResponse.ok) throw new Error("Failed to download enhanced image");
//     const buffer = await imageResponse.arrayBuffer();
//     const blob = Buffer.from(buffer);

//     // Upload to Firebase
//     const filename = `enhanced_${Date.now()}.jpg`;
//     const storageRef = ref(storage, `PicNovaPromptEnhanced/${filename}`);
//     const uploadResult = await uploadBytesResumable(storageRef, blob, {
//       contentType: "image/jpeg",
//     });
//     const firebaseImageUrl = await getDownloadURL(uploadResult.ref);

//     // Save enhanced image info in DB
//     const [enhancedResult] = await db.promise().query(
//       'INSERT INTO enhanced_images (user_id, original_id, model_used, url, prompt_used) VALUES (?, ?, ?, ?, ?)',
//       [userId, originalId, modelUsed, firebaseImageUrl, prompt || null]
//     );

//     res.json({
//       success: true,
//       originalId,
//       enhancedImageId: enhancedResult.insertId,
//       enhancedImageUrl: firebaseImageUrl,
//     });

//   } catch (error) {
//     console.error("Enhancement error:", error);
//     res.status(500).json({ error: "Enhancement failed" });
//   }
// });


// // API for Enhanced images Gallery displying
// app.get('/enhanced-images', (req, res) => {
//   try {
//     const query = 'SELECT * FROM enhanced_images ORDER BY enhanced_at DESC';

//     db.query(query, (err, result) => {
//       if (err) {
//         console.error('Database query error:', err);
//         return res.status(500).json({ error: 'Database error' });
//       }
//       res.json(result);
//     });
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).json({ error: 'Unexpected server error' });
//   }
// });


// app.get('/ai_pics_Featureslist', (req, res) => {
//   try {
//     const query = 'SELECT * FROM pics_ai_features';

//     db.query(query, (err, result) => {
//       if (err) {
//         console.error('Database query error:', err);
//         return res.status(500).json({ error: 'Database error' });
//       }
//       res.json(result);
//     });
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).json({ error: 'Unexpected server error' });
//   }
// });

// app.get('/ai_subfeatures/:featureId', (req, res) => {
//   const featureId = req.params.featureId;
//   const query = 'SELECT * FROM pics_ai_subfeatures WHERE feature_id = ?';
//   db.query(query, [featureId], (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send({ error: 'Database error' });
//     } else {
//       res.json(results);
//     }
//   });
// });



// // stripe payemnt APi //
// app.post('/create-payment-intent', async (req, res) => {
//   const { amount, currency, customerEmail } = req.body;
//   try {
//     const customer = await stripe.customers.create({ email: customerEmail });

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100),
//       currency,
//       customer: customer.id, // Attach customer ID
//       automatic_payment_methods: { enabled: true },
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// // payment cards images APi
// app.get("/images", (req, res) => {
//   db.query("SELECT * FROM creditcardsimages", (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(results);
//   });
// });
// // Authuntication APIS
// app.post('/signup', async (req, res) => {
//   const { name, email, password, phone } = req.body;
//   console.log("signup data in backend", name, email, password, phone)
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10); // Hash password
//     const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

//     db.query(query, [name, email, hashedPassword, phone], (err, result) => {
//       if (err) {
//         console.error('Error creating user:', err);
//         return res.status(500).send(err);
//       }
//       res.send({ message: 'User created successfully' });
//     });
//   } catch (error) {
//     res.status(500).send({ message: 'Error hashing password' });
//   }
// });

// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   console.log(email, password)
//   const query = `SELECT * FROM users WHERE email = ?`;
//   db.query(query, [email], async (err, result) => {
//     if (err || result.length === 0) {
//       console.error('User not found:', err);
//       return res.status(404).send({ message: 'User not found' });
//     }
//     const user = result[0];
//     const passwordMatch = await bcrypt.compare(password, user.password); // Compare password
//     if (!passwordMatch) {
//       return res.status(400).send({ message: 'Invalid credentials' });
//     }
//     // Generate JWT Token
//     const payload = {
//       userId: user.user_id,
//       email: user.email,
//     };
//     const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '30d' });
//     res.send({
//       userId: user.user_id,
//       email: user.email,
//       token: token,  // Send the token to the client
//       message: 'Login successful',
//     });
//   });
// });
// // home screen front model of sale images API
// app.get("/api/sale-image", (req, res) => {
//   const sql = "SELECT image_url FROM homescreensale_images ORDER BY created_at DESC LIMIT 1";
//   db.query(sql, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: "Database query failed" });
//     }
//     if (result.length > 0) {
//       res.json({ imageUrl: result[0].image_url });
//     } else {
//       res.json({ imageUrl: null });
//     }
//   });
// });
// app.post("/upload-profile-image", async (req, res) => {
//   const { user_id, image_url } = req.body;
//   if (!user_id || !image_url) return res.status(400).json({ error: "Missing fields" });

//   const query = "INSERT INTO user_images (user_id, image_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_url = ?";
//   db.query(query, [user_id, image_url, image_url], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Profile image updated successfully" });
//   });
// });
// // usreimage displaying
// app.get("/user_images/:storedUserId", (req, res) => {
//   const storedUserId = req.params.storedUserId; // Using storedUserId instead of userId
//   const sql = "SELECT image_url FROM user_images WHERE user_id = ? LIMIT 1";

//   db.query(sql, [storedUserId], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: "Database query error" });
//     }

//     if (result.length > 0) {
//       res.json({ image_url: result[0].image_url });
//     } else {
//       res.status(404).json({ message: "No image found for this user" });
//     }
//   });
// });
// // faqs APIs
// app.get("/faqs", (req, res) => {
//   db.query("SELECT * FROM faq", (err, results) => {
//     if (err) {
//       res.status(500).json({ error: "Database query failed." });
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get("/users/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const query = "SELECT user_id, name, email, phone FROM users WHERE user_id = ?";

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Database error:", err);  // Log error in backend
//       return res.status(500).json({ error: "Database error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json(results[0]);
//   });
// });

// app.put("/users/:id", (req, res) => {
//   const userId = req.params.id;
//   const { name, email, phone } = req.body;
//   console.log(name, email, phone)
//   db.query(
//     "UPDATE users SET name = ?, email = ?, phone = ? WHERE user_id = ?",
//     [name, email, phone, userId],
//     (err, result) => {
//       if (err) {
//         console.error("Error updating user:", err);
//         return res.status(500).json({ error: "Database error" });
//       }

//       res.json({ message: "User updated successfully" });
//     }
//   );
// });

// app.get('/splash-image', (req, res) => {
//   const query = 'SELECT * FROM logo_image WHERE id = 2'
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result)
//   })
// })
// // Regitstration screen splash image
// app.get('/splash-screen2', (req, res) => {
//   const query = 'SELECT * FROM logo_image WHERE id =3'
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result)
//   })
// })
// // Api for fetching Logo image //
// app.get('/logo_image', (req, res) => {
//   const query = 'SELECT * FROM logo_image WHERE id = 1'
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result)
//   })
// })
// // sliderimages //
// app.get('/sliderimages', (req, res) => {
//   const query = 'SELECT * FROM sliderimages';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err);
//       return res.status(500).json({ error: 'Database query error' });
//     }
//     res.json(results);
//   });
// });


// app.get("/loginbg", (req, res) => {
//   const query = "SELECT * FROM logo_image WHERE id=4";
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result)
//   })
// })


// //  About page realted Ap
// app.get("/about", (req, res) => {
//   const query = 'SELECT * FROM about'
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result)
//   })
// })
// app.get("/about_image", (req, res) => {
//   const query = 'SELECT * FROM logo_image WHERE id = 3'
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result)
//   })
// })
// app.get('/aboutus', (req, res) => {
//   const query = 'SELECT * FROM aboutus'
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result)
//   })
// })
// app.get('/about_mission', (req, res) => {
//   const query = 'SELECT * FROM about_mission'
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result)
//   })
// })

// app.get("/first_column_data", (req, res) => {
//   const query = 'SELECT * FROM customer_supportoptions LIMIT 2';
//   db.query(query, (err, result) => {
//     if (err) {
//       console.error("Error fetching first 2 rows:", err);
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.json(result);
//   });
// });

// app.get("/second_column_data", (req, res) => {
//   const query = 'SELECT * FROM customer_supportoptions LIMIT 100 OFFSET 2';
//   db.query(query, (err, result) => {
//     if (err) {
//       console.error("Error fetching next rows:", err);
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.json(result);
//   });
// });


// app.get('/api/users/:userId', (req, res) => {
//   const { userId } = req.params;

//   const sql = 'SELECT name FROM users WHERE user_id = ?';
//   db.query(sql, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching user name:', error);
//       return res.status(500).json({ message: 'Failed to fetch user name' });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json({ userName: results[0].name });
//   });
// });

// app.get('/social_icons', (req, res) => {
//   const query = 'SELECT icons, routes FROM social_icons';
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result);
//   });
// });
// // footer Apis end //

// // this API is for videos on homepage //
// app.get("/home_videos", (req, res) => {
//   const query = 'SELECT * FROM home_videos'
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result)
//   })
// })
// // Start the server
// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

