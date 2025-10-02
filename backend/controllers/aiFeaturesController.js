const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all AI Features
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await prisma.picsaifeatures.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Server error while fetching features' });
  }
};

// GET Subfeatures by Feature ID
exports.getSubfeaturesByFeatureId = async (req, res) => {
  const featureId = parseInt(req.params.featureId);

  if (isNaN(featureId)) {
    return res.status(400).json({ error: 'Invalid feature ID' });
  }

  try {
    const subfeatures = await prisma.picsaisubfeatures.findMany({
      where: { feature_id: featureId },
      orderBy: { created_at: 'desc' },
    });
    res.json(subfeatures);
  } catch (error) {
    console.error('Error fetching subfeatures:', error);
    res.status(500).json({ error: 'Server error while fetching subfeatures' });
  }
};

// module.exports = {
//   getAllFeatures,
//   getSubfeaturesByFeatureId,
// };
