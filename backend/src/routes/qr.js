const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database/init');

const router = express.Router();

// Generate short code
const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create new QR code
router.post('/create', async (req, res) => {
  try {
    const { name, url } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

  const shortCode = generateShortCode();
  const baseUrl = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUrl = `${baseUrl}/r/${shortCode}`;
    
    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(redirectUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Save to database
    const stmt = db.prepare(`
      INSERT INTO qr_codes (short_code, name, original_url, current_url, qr_image_url)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run([shortCode, name, url, url, qrDataUrl], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create QR code' });
      }

      res.json({
        id: this.lastID,
        shortCode,
        name,
        originalUrl: url,
        currentUrl: url,
        redirectUrl,
        qrImageUrl: qrDataUrl,
        createdAt: new Date().toISOString()
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('QR creation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Get all QR codes
router.get('/', (req, res) => {
  db.all(`
    SELECT id, short_code, name, original_url, current_url, qr_image_url, 
           created_at, updated_at, is_active
    FROM qr_codes 
    ORDER BY created_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch QR codes' });
    }

    const qrCodes = rows.map(row => ({
      id: row.id,
      shortCode: row.short_code,
      name: row.name,
      originalUrl: row.original_url,
      currentUrl: row.current_url,
      qrImageUrl: row.qr_image_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active === 1
    }));

    res.json(qrCodes);
  });
});

// Get single QR code
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(`
    SELECT id, short_code, name, original_url, current_url, qr_image_url, 
           created_at, updated_at, is_active
    FROM qr_codes 
    WHERE id = ?
  `, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch QR code' });
    }

    if (!row) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    res.json({
      id: row.id,
      shortCode: row.short_code,
      name: row.name,
      originalUrl: row.original_url,
      currentUrl: row.current_url,
      qrImageUrl: row.qr_image_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active === 1
    });
  });
});

// Update QR code URL
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, currentUrl, isActive } = req.body;

  if (!name && !currentUrl && isActive === undefined) {
    return res.status(400).json({ error: 'At least one field is required' });
  }

  // Validate URL if provided
  if (currentUrl) {
    try {
      new URL(currentUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
  }

  let query = 'UPDATE qr_codes SET updated_at = CURRENT_TIMESTAMP';
  const params = [];

  if (name) {
    query += ', name = ?';
    params.push(name);
  }

  if (currentUrl) {
    query += ', current_url = ?';
    params.push(currentUrl);
  }

  if (isActive !== undefined) {
    query += ', is_active = ?';
    params.push(isActive ? 1 : 0);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.run(query, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update QR code' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    res.json({ message: 'QR code updated successfully' });
  });
});

// Delete QR code
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM qr_codes WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete QR code' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    res.json({ message: 'QR code deleted successfully' });
  });
});

module.exports = router;