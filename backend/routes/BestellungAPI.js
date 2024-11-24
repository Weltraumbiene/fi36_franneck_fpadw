import express from 'express';
import mariadb from 'mariadb';
import { body, validationResult } from 'express-validator';
import { verifyToken } from './middleware.js'; // JWT Middleware
import secrets from './secrets.js';  // Geheimschlüssel und DB-Daten

const router = express.Router();

// MariaDB Pool für Bestellungsrouten
const pool = mariadb.createPool({
  host: secrets.db_server,
  user: secrets.db_username,
  password: secrets.db_password,
  database: secrets.db_database,
  connectionLimit: 5
});

// Produkte abrufen - /api/products
router.get('/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const products = await connection.query('SELECT product_id, title, description, price, image, quantity FROM product');
    connection.release();
    res.setHeader('Content-Type', 'application/json');
    res.json(products); // Produktdaten als JSON zurückgeben
  } catch (error) {
    console.error('Fehler beim Abrufen der Produkte:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
  }
});

// Bestellvorgang starten - /api/order
router.post(
  '/order',
  verifyToken, // JWT Verifizierung
  [
    body('cartItems').isArray().withMessage('Warenkorb-Elemente müssen ein Array sein'),
    body('cartItems.*.productId').isInt().withMessage('Produkt-ID muss eine Zahl sein'),
    body('cartItems.*.quantity').isInt().withMessage('Menge muss eine Zahl sein'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cartItems } = req.body; // Warenkorb-Elemente aus dem Request-Body
    const userId = req.user.userId; // Benutzer-ID aus dem JWT Token
    const userEmail = req.user.email; // Benutzer-E-Mail aus dem JWT Token

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Der Warenkorb ist leer!' });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction(); // Transaktion beginnen

      // Bestellung in die 'order' Tabelle einfügen
      const [orderResult] = await connection.query(
        'INSERT INTO `order` (user_id, email, order_date, status) VALUES (?, ?, NOW(), ?)',
        [userId, userEmail, 'offen']
      );
      const orderId = orderResult.insertId; // ID der neuen Bestellung

      // Bestellpositionen in die 'order_item' Tabelle einfügen
      for (let item of cartItems) {
        const { productId, quantity } = item;

        // Produktinformationen abrufen
        const [productResult] = await connection.query(
          'SELECT product_id, price FROM product WHERE product_id = ?',
          [productId]
        );

        if (productResult.length === 0) {
          return res.status(400).json({ message: `Produkt mit ID ${productId} nicht gefunden` });
        }

        const product = productResult[0];
        const totalPrice = product.price * quantity;

        // Bestellposition in die 'order_item' Tabelle einfügen
        await connection.query(
          'INSERT INTO order_item (order_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)',
          [orderId, productId, quantity, totalPrice]
        );
      }

      await connection.commit(); // Transaktion abschließen
      res.status(201).json({ message: 'Bestellung erfolgreich gespeichert', orderId });
    } catch (error) {
      console.error('Fehler bei der Bestellung:', error.message);
      if (connection) {
        await connection.rollback(); // Transaktion zurückrollen
      }
      res.status(500).json({ message: 'Fehler bei der Bestellung' });
    } finally {
      if (connection) connection.release();
    }
  }
);

// Bestellhistorie des Benutzers abrufen - /api/orders
router.get('/orders', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const [orders] = await pool.query(
      `SELECT o.order_id, o.order_date, o.status,
              oi.product_id, oi.quantity, oi.total_price 
       FROM \`order\` o 
       JOIN order_item oi ON o.order_id = oi.order_id 
       WHERE o.user_id = ? 
       ORDER BY o.order_date DESC`,
      [userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Keine Bestellungen gefunden' });
    }

    res.json(orders);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellungen:', error.message);
    res.status(500).json({ message: 'Fehler beim Abrufen der Bestellungen' });
  }
});

// Bestelldetails des Benutzers abrufen - /api/order/:orderId
router.get('/order/:orderId', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { orderId } = req.params;

  try {
    const [order] = await pool.query(
      `SELECT o.order_id, o.order_date, o.status,
              oi.product_id, oi.quantity, oi.total_price 
       FROM \`order\` o 
       JOIN order_item oi ON o.order_id = oi.order_id 
       WHERE o.order_id = ? AND o.user_id = ?`,
      [orderId, userId]
    );

    if (order.length === 0) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }

    res.json(order);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestelldetails:', error.message);
    res.status(500).json({ message: 'Fehler beim Abrufen der Bestelldetails' });
  }
});

// Bestellstatus aktualisieren - /api/order/:orderId
router.put('/order/:orderId', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status || !['offen', 'abgeschlossen', 'storniert'].includes(status)) {
    return res.status(400).json({ message: 'Ungültiger Status' });
  }

  try {
    const [orderResult] = await pool.query(
      `SELECT * FROM \`order\` WHERE order_id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }

    await pool.query(
      `UPDATE \`order\` SET status = ? WHERE order_id = ?`,
      [status, orderId]
    );

    res.json({ message: 'Bestellstatus erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Bestellstatus:', error.message);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Bestellstatus' });
  }
});

export default router;
