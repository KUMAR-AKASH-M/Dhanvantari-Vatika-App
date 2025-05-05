const express = require('express');
const stripe = require('stripe')(''); // Enter your Stripe secret key
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create a payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, paymentMethodId, description } = req.body;

    if (!amount || !currency || !paymentMethodId) {
      return res.status(400).json({
        error: {
          message: 'Missing required parameters: amount, currency, or paymentMethodId'
        }
      });
    }

    console.log('Creating payment intent for:', { amount, currency, paymentMethodId });

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      description,
      return_url: 'https://dhanvantarivatikaapp.com/payment-success', // Add a return URL for 3D Secure
    });

    console.log('Payment intent created:', paymentIntent.id);
    
    // Return the client secret to the client
    res.json({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).json({
      error: {
        message: error.message,
        type: error.type,
        code: error.code
      }
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
