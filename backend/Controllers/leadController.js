const Lead = require('../models/Lead');

// @desc    Get leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9; // Default 9 to fit 3x3 grid
    const skip = (page - 1) * limit;
    
    let query = { user: req.user.id };

    if (req.query.date) {
      const startDate = new Date(req.query.date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(req.query.date);
      endDate.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalLeads = await Lead.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      data: leads,
      pagination: {
        total: totalLeads,
        page,
        limit,
        totalPages: Math.ceil(totalLeads / limit),
      },
      message: 'Leads fetched successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    if (!req.body.name || !req.body.location || !req.body.contact) {
      return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    const lead = await Lead.create({
      user: req.user.id,
      name: req.body.name,
      location: req.body.location,
      contact: req.body.contact,
      description: req.body.description,
      rating: req.body.rating,
      status: req.body.status,
      date: req.body.date,
    });

    res.status(201).json({ success: true, data: lead, message: 'Lead created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Make sure the logged in user matches the lead user
    if (lead.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authorized to update this lead' });
    }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, data: updatedLead, message: 'Lead updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Make sure the logged in user matches the lead user
    if (lead.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authorized to delete this lead' });
    }

    await lead.deleteOne();

    res.status(200).json({ success: true, id: req.params.id, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
};
