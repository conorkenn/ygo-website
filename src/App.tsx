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

interface SetCard {
  id: number;
  name: string;
  type: string;
  rarity: string;
  price: string;
}

interface SetInfo {
  name: string;
  cards: SetCard[];
  count: number;
}

const API_URL = 'http://localhost:3000';

function App() {
  const [view, setView] = useState<'collection' | 'browse'>('collection');
  const [collection, setCollection] = useState<Card[]>([]);
  const [totalValue, setTotalValue] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState('');
  
  // Browse set state
  const [sets, setSets] = useState<{name: string, code: string, year: string}[]>([]);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [setCards, setSetCards] = useState<SetCard[]>([]);
  const [isSetLoading, setIsSetLoading] = useState(false);

  useEffect(() => {
    fetchCollection();
    fetchSets();
  }, []);

  const fetchCollection = async () => {
    try {
      const res = await fetch(`${API_URL}/api/collection`);
      const data: CollectionData = await res.json();
      setCollection(data.collection);
      setTotalValue(data.totalValue);
    } catch (error) {
      console.error('Error fetching collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSets = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sets`);
      const data = await res.json();
      setSets(data.sets || []);
    } catch (error) {
      console.error('Error fetching sets:', error);
    }
  };

  const fetchSetCards = async (setName: string) => {
    setIsSetLoading(true);
    setSelectedSet(setName);
    try {
      const res = await fetch(`${API_URL}/api/sets/${encodeURIComponent(setName)}/cards`);
      const data: SetInfo = await res.json();
      setSetCards(data.cards || []);
    } catch (error) {
      console.error('Error fetching set cards:', error);
    } finally {
      setIsSetLoading(false);
    }
  };

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/collection/add`, {
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
      const res = await fetch(`${API_URL}/api/collection/remove`, {
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

  const addCardFromSet = async (cardName: string) => {
    try {
      const res = await fetch(`${API_URL}/api/collection/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardName }),
      });
      
      if (res.ok) {
        alert(`Added ${cardName} to collection!`);
        fetchCollection();
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  if (loading) {
    return <div className="App"><h1>Loading...</h1></div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎴 YGO Collection</h1>
        <div className="nav-tabs">
          <button 
            className={view === 'collection' ? 'active' : ''} 
            onClick={() => setView('collection')}
          >
            My Collection
          </button>
          <button 
            className={view === 'browse' ? 'active' : ''} 
            onClick={() => setView('browse')}
          >
            Browse Sets
          </button>
        </div>
        <p className="total-value">Total Value: ${totalValue}</p>
      </header>

      <main>
        {view === 'collection' ? (
          <>
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
          </>
        ) : (
          <div className="browse-section">
            {!selectedSet ? (
              <>
                <h2>📚 Browse Sets</h2>
                <div className="sets-grid">
                  {sets.map((set) => (
                    <div 
                      key={set.code} 
                      className="set-card"
                      onClick={() => fetchSetCards(set.name)}
                    >
                      <h3>{set.name}</h3>
                      <p>📅 {set.year}</p>
                      <p className="set-code">{set.code}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="set-results">
                <button className="back-btn" onClick={() => {
                  setSelectedSet(null);
                  setSetCards([]);
                }}>
                  ← Back to Sets
                </button>
                <h2>📦 {selectedSet}</h2>
                <p>{setCards.length} cards found</p>
                
                {isSetLoading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="set-cards-grid">
                    {setCards.map((card) => (
                      <div key={card.id} className="set-card-item">
                        <img
                          src={`https://images.ygoprodeck.com/images/cards/${card.id}.jpg`}
                          alt={card.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x200?text=No+Image';
                          }}
                        />
                        <div className="card-info">
                          <h4>{card.name}</h4>
                          <p className="rarity">{card.rarity}</p>
                          <p className="price">${parseFloat(card.price).toFixed(2)}</p>
                          <button onClick={() => addCardFromSet(card.name)}>
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
