const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller to get splash image with ID = 2
const getSplashImage = async (req, res) => {
  try {
    const result = await prisma.logoimage.findUnique({
      where: { id: 2 },
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching splash image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to get splash screen 2 image with ID = 3
const getSplashScreen2 = async (req, res) => {
  try {
    const result = await prisma.logoimage.findUnique({
      where: { id: 3 },
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching splash screen 2:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getSplashScreen3 = async (req, res) => {
  try {
    const result = await prisma.logoimage.findUnique({
      where: { id: 4 },
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching splash screen 2:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getSplashScreen4 = async (req, res) => {
  try {
    const result = await prisma.logoimage.findUnique({
      where: { id: 5 },
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching splash screen 2:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSplashImage,
  getSplashScreen2,
  getSplashScreen3,
  getSplashScreen4
};
