import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { xumm } from '../utils/xumm';
import { db } from '../firebase'; // Adjusted to match your import path
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

export const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  
  const payloadId = searchParams.get('id');

  useEffect(() => {
    const verifyPayment = async () => {
      // Ensure we have a payload ID and an authenticated user before proceeding
      if (!payloadId || !user) return;

      try {
        // 1. Fetch the payload result from Xaman using the UUID from the URL
        const result = await xumm.payload?.get(payloadId);
        
        // 2. Check the JSON body to confirm the user actually signed the transaction
        if (result?.meta?.signed === true) {
          console.log("Payment Verified! Hash:", result.response.txid);

          // 3. Save the transaction details to Firestore
          // Using payloadId as the document ID prevents duplicate entries
          await setDoc(doc(db, "transactions", payloadId), {
            userId: user.uid,
            userName: user.displayName,
            xrplAddress: result.response.account,
            txHash: result.response.txid,
            status: 'completed',
            amount: "1000", 
            timestamp: serverTimestamp()
          });

          setStatus('success');
        } else {
          console.error("Transaction was not signed or was rejected.");
          setStatus('failed');
        }
      } catch (error) {
        console.error("Verification Error:", error);
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [payloadId, user]);

  if (status === 'loading') return <div>Verifying your procurement...</div>;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {status === 'success' ? (
        <div>
          <h1 style={{ color: '#10b981' }}>✅ Payment Confirmed!</h1>
          <p>Your medical procurement request has been authorized and recorded.</p>
          <p>Transaction Hash: <code>{payloadId}</code></p>
          {/* Path updated to /items to match your working route */}
          <button onClick={() => navigate('/items')}>Return</button>
        </div>
      ) : (
        <div>
          <h1 style={{ color: '#ff4444' }}>❌ Verification Failed</h1>
          <p>We couldn't verify your signature. Please try again or contact support.</p>
          {/* Path updated to /items to match your working route */}
          <button onClick={() => navigate('/items')} style={buttonStyle}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  marginTop: '20px',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};