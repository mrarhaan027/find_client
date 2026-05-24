const express = require('express');
const router = express.Router();
const {
  getLeads,
  getMyLeads,
  getStatsAll,
  getStatsMy,
  addLead,
  updateLead,
  deleteLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

// Protected: all leads (with search + filter)
router.get('/', protect, getLeads);

// Protected: my leads
router.get('/my', protect, getMyLeads);

// Stats routes
router.get('/stats/all', protect, getStatsAll);
router.get('/stats/my', protect, getStatsMy);

// Protected: add, edit, delete
router.post('/', protect, addLead);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

module.exports = router;
