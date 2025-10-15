const express = require('express');
const { db } = require('../database/init');

const router = express.Router();

// Get analytics for a specific QR code
router.get('/:qrId', (req, res) => {
  const { qrId } = req.params;

  // Get QR code basic info
  db.get(`
    SELECT name, short_code, created_at
    FROM qr_codes 
    WHERE id = ?
  `, [qrId], (err, qrCode) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch QR code' });
    }

    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    // Get analytics data
    db.all(`
      SELECT 
        COUNT(*) as total_scans,
        COUNT(DISTINCT ip_address) as unique_scans,
        device_type,
        DATE(scanned_at) as scan_date,
        scanned_at
      FROM analytics 
      WHERE qr_code_id = ?
      GROUP BY device_type, scan_date
      ORDER BY scanned_at DESC
    `, [qrId], (err, analytics) => {
      if (err) {
        console.error('Analytics error:', err);
        return res.status(500).json({ error: 'Failed to fetch analytics' });
      }

      // Process analytics data
      const totalScans = analytics.reduce((sum, row) => sum + row.total_scans, 0);
      const uniqueScans = analytics.reduce((sum, row) => sum + row.unique_scans, 0);
      
      const deviceStats = {};
      const dailyStats = {};

      analytics.forEach(row => {
        // Device stats
        if (!deviceStats[row.device_type]) {
          deviceStats[row.device_type] = 0;
        }
        deviceStats[row.device_type] += row.total_scans;

        // Daily stats
        if (!dailyStats[row.scan_date]) {
          dailyStats[row.scan_date] = 0;
        }
        dailyStats[row.scan_date] += row.total_scans;
      });

      res.json({
        qrCode: {
          name: qrCode.name,
          shortCode: qrCode.short_code,
          createdAt: qrCode.created_at
        },
        summary: {
          totalScans,
          uniqueScans,
          deviceStats,
          dailyStats
        },
        recentScans: analytics.slice(0, 10)
      });
    });
  });
});

// Get analytics for all QR codes
router.get('/', (req, res) => {
  db.all(`
    SELECT 
      qr.id,
      qr.name,
      qr.short_code,
      qr.created_at,
      COUNT(a.id) as total_scans,
      COUNT(DISTINCT a.ip_address) as unique_scans,
      MAX(a.scanned_at) as last_scan
    FROM qr_codes qr
    LEFT JOIN analytics a ON qr.id = a.qr_code_id
    GROUP BY qr.id
    ORDER BY total_scans DESC
  `, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }

    const summary = {
      totalQrCodes: results.length,
      totalScans: results.reduce((sum, row) => sum + (row.total_scans || 0), 0),
      totalUniqueScans: results.reduce((sum, row) => sum + (row.unique_scans || 0), 0),
      qrCodes: results.map(row => ({
        id: row.id,
        name: row.name,
        shortCode: row.short_code,
        createdAt: row.created_at,
        totalScans: row.total_scans || 0,
        uniqueScans: row.unique_scans || 0,
        lastScan: row.last_scan
      }))
    };

    res.json(summary);
  });
});

// Get recent activity across all QR codes
router.get('/activity/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  db.all(`
    SELECT 
      a.scanned_at,
      a.device_type,
      a.ip_address,
      qr.name as qr_name,
      qr.short_code
    FROM analytics a
    JOIN qr_codes qr ON a.qr_code_id = qr.id
    ORDER BY a.scanned_at DESC
    LIMIT ?
  `, [limit], (err, activity) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch recent activity' });
    }

    res.json(activity);
  });
});

module.exports = router;