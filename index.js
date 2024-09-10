const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');

const stripe = Stripe('sk_test_YOUR_SECRET_KEY'); // Replace with your Stripe Secret Key

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a PaymentIntent (handles dynamic payment amounts)
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amounts in cents
      currency: currency || 'usd',
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start the server
const port = process.env.PORT || 4242;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
