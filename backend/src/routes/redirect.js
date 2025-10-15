const express = require('express');
const { db } = require('../database/init');

const router = express.Router();

// Get device type from user agent
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'Unknown';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
};

// Redirect route
router.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  
  // Get QR code info
  db.get(`
    SELECT id, current_url, is_active 
    FROM qr_codes 
    WHERE short_code = ?
  `, [shortCode], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }

    if (!row) {
      return res.status(404).send('QR code not found');
    }

    if (!row.is_active) {
      return res.status(410).send('QR code is inactive');
    }

    // Log analytics
    const userAgent = req.get('User-Agent') || '';
    const deviceType = getDeviceType(userAgent);
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const referrer = req.get('Referrer') || '';

    db.run(`
      INSERT INTO analytics (qr_code_id, ip_address, user_agent, device_type, referrer)
      VALUES (?, ?, ?, ?, ?)
    `, [row.id, ipAddress, userAgent, deviceType, referrer], (err) => {
      if (err) {
        console.error('Analytics error:', err);
      }
    });

    // Redirect to target URL
    res.redirect(302, row.current_url);
  });
});

module.exports = router;