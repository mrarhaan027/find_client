const Lead = require('../schema/Lead');

// ── Badge config ──
const getBadgeStyle = (status) => {
  const styles = {
    pending:       { badgeBg: '#d1e4fb', badgeColor: '#0d1b2a' },
    interested:    { badgeBg: '#c9a84c', badgeColor: '#0d1b2a' },
    not_interested:{ badgeBg: '#fee2e2', badgeColor: '#7f1d1d' },
    completed:     { badgeBg: '#0d1b2a', badgeColor: '#c9a84c' },
  };
  return styles[status] || styles.pending;
};

const formatLead = (lead) => {
  const style = getBadgeStyle(lead.status);
  return {
    _id: lead._id,
    id: lead._id,
    clientName: lead.clientName,
    name: lead.clientName,
    location: lead.location,
    phone: lead.phone,
    email: lead.email,
    rating: lead.rating,
    status: lead.status,
    badge: lead.badge,
    badgeBg: style.badgeBg,
    badgeColor: style.badgeColor,
    description: lead.description,
    isPremium: lead.isPremium,
    date: `Added ${new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    createdBy: lead.createdBy,
    avatar: lead.createdBy?.photo || null,
    initials: lead.createdBy?.name
      ? lead.createdBy.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U',
    addedByName:  lead.createdBy?.name  || 'Unknown',
    addedByEmail: lead.createdBy?.email || '',
    createdAt: lead.createdAt,
  };
};

// ── GET ALL LEADS ──
exports.getLeads = async (req, res) => {
  try {
    const { search = '', status = '', rating = '', page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (rating && rating !== 'all') {
      query.rating = Number(rating);
    }

    if (req.query.date) {
      const startOfDay = new Date(req.query.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(req.query.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    let sortOptions = { createdAt: -1 };
    if (req.query.sort === 'a_z') sortOptions = { clientName: 1 };
    if (req.query.sort === 'z_a') sortOptions = { clientName: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const leads = await Lead.find(query)
      .populate('createdBy', 'name email photo')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      leads: leads.map(formatLead),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error('getLeads error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── GET MY LEADS ──
exports.getMyLeads = async (req, res) => {
  try {
    const { search = '', status = '', rating = '', page = 1, limit = 20 } = req.query;

    const query = { createdBy: req.user._id };

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') query.status = status;
    if (rating && rating !== 'all') query.rating = Number(rating);

    if (req.query.date) {
      const startOfDay = new Date(req.query.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(req.query.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    let sortOptions = { createdAt: -1 };
    if (req.query.sort === 'a_z') sortOptions = { clientName: 1 };
    if (req.query.sort === 'z_a') sortOptions = { clientName: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const leads = await Lead.find(query)
      .populate('createdBy', 'name email photo')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      leads: leads.map(formatLead),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── GET STATS ALL ──
exports.getStatsAll = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const pending = await Lead.countDocuments({ status: 'pending' });
    const interested = await Lead.countDocuments({ status: 'interested' });
    const not_interested = await Lead.countDocuments({ status: 'not_interested' });
    res.status(200).json({ success: true, stats: { total, pending, interested, not_interested } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── GET STATS MY ──
exports.getStatsMy = async (req, res) => {
  try {
    const query = { createdBy: req.user._id };
    const total = await Lead.countDocuments(query);
    const pending = await Lead.countDocuments({ ...query, status: 'pending' });
    const interested = await Lead.countDocuments({ ...query, status: 'interested' });
    const not_interested = await Lead.countDocuments({ ...query, status: 'not_interested' });
    res.status(200).json({ success: true, stats: { total, pending, interested, not_interested } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── ADD LEAD ──
exports.addLead = async (req, res) => {
  try {
    const { clientName, location, phone, email, rating, status, description, isPremium } = req.body;

    if (!clientName) {
      return res.status(400).json({ success: false, message: 'Client name is required.' });
    }

    const lead = await Lead.create({
      clientName,
      location: location || '',
      phone: phone || '',
      email: email || '',
      rating: rating ? Number(rating) : 3,
      status: status || 'pending',
      description: description || '',
      isPremium: isPremium || false,
      createdBy: req.user._id,
    });

    const populated = await Lead.findById(lead._id).populate('createdBy', 'name email photo');

    res.status(201).json({
      success: true,
      lead: formatLead(populated),
    });
  } catch (err) {
    console.error('addLead error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── UPDATE LEAD ──
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    // Only the creator can edit
    if (lead.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this lead.' });
    }

    const { clientName, location, phone, email, rating, status, description, isPremium } = req.body;

    if (clientName) lead.clientName = clientName;
    if (location !== undefined) lead.location = location;
    if (phone !== undefined) lead.phone = phone;
    if (email !== undefined) lead.email = email;
    if (rating) lead.rating = Number(rating);
    if (status) lead.status = status;
    if (description !== undefined) lead.description = description;
    if (isPremium !== undefined) lead.isPremium = isPremium;

    await lead.save();

    const populated = await Lead.findById(lead._id).populate('createdBy', 'name email photo');

    res.status(200).json({
      success: true,
      lead: formatLead(populated),
    });
  } catch (err) {
    console.error('updateLead error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── DELETE LEAD ──
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    // Only the creator can delete
    if (lead.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this lead.' });
    }

    await lead.deleteOne();

    res.status(200).json({ success: true, message: 'Lead deleted successfully.' });
  } catch (err) {
    console.error('deleteLead error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
