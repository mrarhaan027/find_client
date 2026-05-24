const Setting = require('../schema/Setting');

// Default images if nothing is set in the DB
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800'
];

exports.getSliderImages = async (req, res) => {
  try {
    let setting = await Setting.findOne({ type: 'slider_images' });
    
    // If no settings exist at all, seed with defaults
    if (!setting) {
      setting = await Setting.create({
        type: 'slider_images',
        images: DEFAULT_IMAGES.map(url => ({ url }))
      });
    }

    const urls = setting.images.map(img => img.url);
    res.status(200).json({ success: true, images: urls, data: setting.images });
  } catch (err) {
    console.error('getSliderImages error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching slider images.' });
  }
};

exports.addSliderImage = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }

    let setting = await Setting.findOne({ type: 'slider_images' });
    if (!setting) {
      setting = new Setting({ type: 'slider_images', images: [] });
    }

    setting.images.push({ url });
    await setting.save();

    res.status(200).json({ success: true, message: 'Image added successfully.', images: setting.images });
  } catch (err) {
    console.error('addSliderImage error:', err);
    res.status(500).json({ success: false, message: 'Server error adding slider image.' });
  }
};

exports.removeSliderImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    let setting = await Setting.findOne({ type: 'slider_images' });
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Settings not found.' });
    }

    setting.images = setting.images.filter(img => img._id.toString() !== imageId);
    await setting.save();

    res.status(200).json({ success: true, message: 'Image removed successfully.', images: setting.images });
  } catch (err) {
    console.error('removeSliderImage error:', err);
    res.status(500).json({ success: false, message: 'Server error removing slider image.' });
  }
};
