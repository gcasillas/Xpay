import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { xumm } from '../utils/xumm';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export const ItemPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [xrplAccount, setXrplAccount] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);

  // Removed trailing slash to prevent double-slashes in redirects
  const BASE_URL = "https://5173-firebase-payrlusd-1770648897105.cluster-4n5u5hogsrboetonl5ts5gkcgy.cloudworkstations.dev"; 

  useEffect(() => {
    xumm.user.account.then(a => setXrplAccount(a ?? ''));

    // Real-time listener for transaction history
    if (user) {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(docs);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = async () => {
    xumm.logout();
    await logout();
    navigate('/');
  };

  const handleProcurement = async () => {
    try {
      const payload = await xumm.payload?.create({
        txjson: {
          TransactionType: 'Payment',
          Destination: 'rH61QHFGQxvu4SYXdhSR7cCYqnZtJq7EYT',
          Amount: "1000", 
        },
        custom_meta: { instruction: "Pay for RLUSD tokens" },
        options: {
          identifier: user?.uid,
          return_url: {
            app: `${BASE_URL}/success?id={id}`,
            web: `${BASE_URL}/success?id={id}`
          }
        }
      } as any); 

      if (payload?.next.always) {
        window.location.href = payload.next.always;
      }
    } catch (error) {
      console.error("Xaman SDK Error:", error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Xpay Portal</h2>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </header>

      <div style={cardStyle}>
        <h3>Welcome, {user?.displayName}</h3>
        {xrplAccount === '' ? (
          <button onClick={() => xumm.authorize()} style={connectButtonStyle}>Connect Xaman Wallet</button>
        ) : (
          <div>
            <p>Wallet: <code>{xrplAccount}</code></p>
            <button onClick={handleProcurement} style={payButtonStyle}>Pay 0.001 XRP (Test)</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h3>Transaction History</h3>
        {history.length === 0 ? <p>No transactions found.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Hash</th>
              </tr>
            </thead>
            <tbody>
              {history.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{tx.timestamp?.toDate().toLocaleDateString()}</td>
                  <td style={{ padding: '10px', color: '#10b981' }}>{tx.status}</td>
                  <td style={{ padding: '10px' }}><small>{tx.txHash.substring(0, 10)}...</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Styles
const logoutButtonStyle = { background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const cardStyle = {
  marginTop: '2rem',
  background: 'rgba(255, 255, 255, 0.1)', // Glassmorphism effect
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '2rem',
  borderRadius: '12px',
  textAlign: 'center' as const
};const connectButtonStyle = { padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const payButtonStyle = { padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' };