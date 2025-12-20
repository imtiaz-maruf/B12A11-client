// ===========================================
// CLIENT/src/components/payment/CheckoutForm.jsx
// ===========================================
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ amount, orderId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const { data } = await axiosSecure.post('/api/payment/create-intent', {
        amount: amount
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || 'Anonymous',
              email: user?.email || 'anonymous@email.com'
            }
          }
        }
      );

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Save payment to database
        await axiosSecure.post('/api/payment/save', {
          orderId: orderId,
          userEmail: user.email,
          amount: amount,
          transactionId: paymentIntent.id,
          paymentMethod: 'card',
          paymentTime: new Date()
        });

        toast.success('Payment successful!');

        if (onSuccess) {
          onSuccess();
        }

        navigate('/payment-success');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444'
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Test card: 4242 4242 4242 4242 | Any future date | Any CVC
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;