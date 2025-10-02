
// const prisma = require('../prisma/client');

// exports.getFAQs = async (req, res) => {
//   try {
//     const faqs = await prisma.faq.findMany(); 
//     res.json(faqs);
//   } catch (error) {
//     console.error("Error fetching FAQs:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.getLogoImage = async (req, res) => {
//   try {
//     const logo = await prisma.logoimage.findUnique({
//       where: { id: 1 }, 
//     });
//     console.log("Logo Image Data:", logo);
//     if (logo) {
//       res.json(logo);
//     } else {
//       res.status(404).json({ message: "Logo not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching logo image:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.getSliderImages = async (req, res) => {
//   try {
//     const images = await prisma.sliderimages.findMany(); 
//     res.json(images);
//   } catch (error) {
//     console.error("Error fetching slider images:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.getPaymentBtnImage = async (req, res) => {
//   try {
//     const image = await prisma.sliderimages.findUnique({
//       where: { id: 3 }, 
//     });

//     if (image) {
//       console.log("Payment Button Image Data:", image);
//       res.json(image);
//     } else {
//       res.status(404).json({ message: "Payment image not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching payment button image:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.getSocialIcons = async (req, res) => {
//   try {
//     const icons = await prisma.social_icons.findMany({
//       select: {
//         icons: true,
//         routes: true
//       }
//     }); // ✅ Select specific fields
//     res.json(icons);
//   } catch (error) {
//     console.error("Error fetching social icons:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


const prisma = require('../prisma/client');

// exports.getFAQs = async (req, res) => {
//   try {
//     const faqs = await prisma.faq.findMany(); 
//     res.json(faqs);
//   } catch (error) {
//     console.error("Error fetching FAQs:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
exports.getPrivacyPolicy = async (req, res) => {
  try {
    const policy = await prisma.privacyPolicy.findFirst();
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 📌 Get About Game
exports.getAboutApp = async (req, res) => {
  try {
    const about = await prisma.aboutApp.findFirst();
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// exports.getAllFaqs = async (req, res) => {
//   try {
//     const faqs = await prisma.fAQ.findMany({
//       orderBy: { order: 'asc' }, // nulls last — adjust as you like
//     });
//     console.log("allfaqs in backend API", faqs)
//     res.json(faqs);
//   } catch (err) {
//     console.error("getAllFaqs error:", err);
//     res.status(500).json({ error: "Failed to load FAQs" });
//   }
// };
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany(); // Removed orderBy
    console.log("allfaqs in backend API", faqs);
    res.json(faqs);
  } catch (err) {
    console.error("getAllFaqs error:", err);
    res.status(500).json({ error: "Failed to load FAQs" });
  }
};

exports.getLogoImage = async (req, res) => {
  try {
    const logo = await prisma.logoimage.findUnique({
      where: { id: 1 }, 
    });
    console.log("Logo Image Data:", logo);
    if (logo) {
      res.json(logo);
    } else {
      res.status(404).json({ message: "Logo not found" });
    }
  } catch (error) {
    console.error("Error fetching logo image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSliderImages = async (req, res) => {
  try {
    const images = await prisma.sliderimages.findMany(); 
    res.json(images);
  } catch (error) {
    console.error("Error fetching slider images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPaymentBtnImage = async (req, res) => {
  try {
    const image = await prisma.sliderimages.findUnique({
      where: { id: 3 }, 
    });

    if (image) {
      console.log("Payment Button Image Data:", image);
      res.json(image);
    } else {
      res.status(404).json({ message: "Payment image not found" });
    }
  } catch (error) {
    console.error("Error fetching payment button image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSocialIcons = async (req, res) => {
  try {
    const icons = await prisma.social_icons.findMany({
      select: {
        icons: true,
        routes: true
      }
    }); // ✅ Select specific fields
    res.json(icons);
  } catch (error) {
    console.error("Error fetching social icons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get About Me data
exports.getAboutMe = async (req, res) => {
  try {
    const data = await prisma.aboutMe.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching About Me:', error);
    res.status(500).json({ error: 'Failed to fetch About Me data' });
  }
};

// Get Mission & Vision data
exports.getMissionVision = async (req, res) => {
  try {
    const data = await prisma.missionVision.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching Mission & Vision:', error);
    res.status(500).json({ error: 'Failed to fetch Mission & Vision data' });
  }
};