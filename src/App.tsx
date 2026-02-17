import React, { useState, useEffect } from 'react';
import './App.css';

interface Card {
  name: string;
  count: number;
  cardId: number;
  price: number;
}

interface CollectionData {
  collection: Card[];
  totalCards: number;
  totalCopies: number;
  totalValue: string;
}

const API_URL = 'http://localhost:3000/api';

function App() {
  const [collection, setCollection] = useState<Card[]>([]);
  const [totalValue, setTotalValue] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState('');

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      const res = await fetch(`${API_URL}/collection`);
      const data: CollectionData = await res.json();
      setCollection(data.collection);
      setTotalValue(data.totalValue);
    } catch (error) {
      console.error('Error fetching collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.trim()) return;

    try {
      const res = await fetch(`${API_URL}/collection/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardName: newCard }),
      });
      
      if (res.ok) {
        setNewCard('');
        fetchCollection();
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const removeCard = async (cardName: string) => {
    try {
      const res = await fetch(`${API_URL}/collection/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardName }),
      });
      
      if (res.ok) {
        fetchCollection();
      }
    } catch (error) {
      console.error('Error removing card:', error);
    }
  };

  if (loading) {
    return <div className="App"><h1>Loading...</h1></div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎴 YGO Collection</h1>
        <p className="total-value">Total Value: ${totalValue}</p>
      </header>

      <main>
        <form onSubmit={addCard} className="add-form">
          <input
            type="text"
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
            placeholder="Enter card name (e.g., Dark Magician)"
          />
          <button type="submit">Add Card</button>
        </form>

        <div className="collection-grid">
          {collection.length === 0 ? (
            <p className="empty">Your collection is empty! Add some cards.</p>
          ) : (
            collection.map((card) => (
              <div key={card.cardId} className="card-item">
                <img
                  src={`https://images.ygoprodeck.com/images/cards/${card.cardId}.jpg`}
                  alt={card.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x200?text=No+Image';
                  }}
                />
                <div className="card-info">
                  <h3>{card.name}</h3>
                  <p>×{card.count}</p>
                  <p className="price">${(card.price * card.count).toFixed(2)}</p>
                  <button onClick={() => removeCard(card.name)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
