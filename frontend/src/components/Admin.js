import React, { useState, useEffect } from 'react';
import '../css/Admin.css';

const Admin = () => {
  // State-Variablen für Produkte, Nachrichten, Bestellungen und Benutzer
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    quantity: '',
  });
  const [productToUpdate, setProductToUpdate] = useState({
    product_id: '',
    title: '',
    description: '',
    price: '',
    image: '',
    quantity: '',
  });
  const [productIdToDelete, setProductIdToDelete] = useState('');
  const [userEmailToDelete, setUserEmailToDelete] = useState('');
  const [messageData, setMessageData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  // Admin-Funktionen

  const createProduct = async () => {
    const response = await fetch('http://bcf.mshome.net:4000/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    if (response.ok) {
      alert('Produkt erfolgreich erstellt');
      setNewProduct({
        title: '',
        description: '',
        price: '',
        image: '',
        quantity: '',
      });
    } else {
      alert('Fehler beim Erstellen des Produkts');
    }
  };

  const updateProduct = async () => {
    const response = await fetch(`http://bcf.mshome.net:4000/admin/products/${productToUpdate.product_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToUpdate),
    });
    if (response.ok) {
      alert('Produkt erfolgreich aktualisiert');
    } else {
      alert('Fehler beim Aktualisieren des Produkts');
    }
  };

  const deleteProduct = async () => {
    const response = await fetch(`http://bcf.mshome.net:4000/admin/products/${productIdToDelete}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      alert('Produkt erfolgreich gelöscht');
    } else {
      alert('Fehler beim Löschen des Produkts');
    }
  };

  const deleteUser = async () => {
    const response = await fetch(`http://bcf.mshome.net:4000/admin/users/${userEmailToDelete}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      alert('Benutzer erfolgreich gelöscht');
    } else {
      alert('Fehler beim Löschen des Benutzers');
    }
  };

  const fetchMessages = async () => {
    const response = await fetch('http://bcf.mshome.net:4000/admin/messages');
    const data = await response.json();
    setMessageData(data);
  };

  const fetchOrders = async () => {
    const response = await fetch('http://bcf.mshome.net:4000/admin/orders');
    const data = await response.json();
    setOrderData(data);
  };

  // useEffect zum Abrufen von Nachrichten und Bestellungen
  useEffect(() => {
    fetchMessages();
    fetchOrders();
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Bereich</h1>

      {/* UI für Admin-Funktionen */}
      
      {/* Produkterstellung */}
      <div>
        <h2>Produkterstellung</h2>
        <div className="admin-inputs">
          <input
            type="text"
            placeholder="Titel"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Beschreibung"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Preis"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Bild-URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />
          <input
            type="number"
            placeholder="Menge"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          />
          <button onClick={createProduct}>Produkt erstellen</button>
        </div>
      </div>

      {/* Produkt aktualisieren */}
      <div>
        <h2>Produkt aktualisieren</h2>
        <div className="admin-inputs">
          <input
            type="number"
            placeholder="Produkt ID"
            value={productToUpdate.product_id}
            onChange={(e) => setProductToUpdate({ ...productToUpdate, product_id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Titel"
            value={productToUpdate.title}
            onChange={(e) => setProductToUpdate({ ...productToUpdate, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Beschreibung"
            value={productToUpdate.description}
            onChange={(e) => setProductToUpdate({ ...productToUpdate, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Preis"
            value={productToUpdate.price}
            onChange={(e) => setProductToUpdate({ ...productToUpdate, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Bild-URL"
            value={productToUpdate.image}
            onChange={(e) => setProductToUpdate({ ...productToUpdate, image: e.target.value })}
          />
          <input
            type="number"
            placeholder="Menge"
            value={productToUpdate.quantity}
            onChange={(e) => setProductToUpdate({ ...productToUpdate, quantity: e.target.value })}
          />
          <button onClick={updateProduct}>Produkt aktualisieren</button>
        </div>
      </div>

      {/* Produkt löschen */}
      <div>
        <h2>Produkt löschen</h2>
        <div className="admin-inputs">
          <input
            type="number"
            placeholder="Produkt ID"
            value={productIdToDelete}
            onChange={(e) => setProductIdToDelete(e.target.value)}
          />
          <button onClick={deleteProduct}>Produkt löschen</button>
        </div>
      </div>

      {/* Benutzer löschen */}
      <div>
        <h2>Benutzer löschen</h2>
        <div className="admin-inputs">
          <input
            type="email"
            placeholder="Benutzer Email"
            value={userEmailToDelete}
            onChange={(e) => setUserEmailToDelete(e.target.value)}
          />
          <button onClick={deleteUser}>Benutzer löschen</button>
        </div>
      </div>

      {/* Nachrichten anzeigen */}
      <div className="data-container">
        <h2>Nachrichten</h2>
        <div className="message-list">
          {messageData.length > 0 ? (
            messageData.map((message) => (
              <div key={message.id} className="message-card">
                <h3>{message.name}</h3>
                <p>{message.email}</p>
                <p>{message.message}</p>
                <p><small>{new Date(message.timestamp).toLocaleString()}</small></p>
              </div>
            ))
          ) : (
            <p>Keine Nachrichten vorhanden.</p>
          )}
        </div>
      </div>

      {/* Bestellungen anzeigen */}
      <div className="data-container">
        <h2>Bestellungen</h2>
        <div className="order-list">
          {orderData.length > 0 ? (
            orderData.map((order) => (
              <div key={order.order_id} className="order-card">
                <h3>Bestellung ID: {order.order_id}</h3>
                <p>Email: {order.email}</p>
                <p>Bestelldatum: {new Date(order.order_date).toLocaleString()}</p>
                <p>Gesamtpreis: €{order.total_price}</p>
                <p>Produkte: {order.products}</p>
              </div>
            ))
          ) : (
            <p>Keine Bestellungen vorhanden.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
