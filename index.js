const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

// Initialize Stripe with your secret key from environment variables
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(cors()); // To allow cross-origin requests from the SwiftUI app
app.use(express.json()); // To parse incoming JSON requests

// Endpoint to create a PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // Create a PaymentIntent with the provided amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount is in cents
      currency: currency || 'usd', // Default currency is USD
    });

    // Send the client secret to the frontend
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check route
app.get('/', (req, res) => {
  res.send('Stripe backend is running');
});

// Start the server
const port = process.env.PORT || 4242;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/create-setup-intent', async (req, res) => {
    try {
      const setupIntent = await stripe.setupIntents.create();
      res.send({
        clientSecret: setupIntent.client_secret,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
app.post('/charge-user', async (req, res) => {
const { amount, paymentMethodId } = req.body;

try {
    const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Amount in cents
    currency: 'usd',
    payment_method: paymentMethodId,
    confirm: true,
    });

    res.send({
    success: true,
    paymentIntent,
    });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});
  
