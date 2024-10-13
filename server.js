const express = require('express');
const cors = require('cors');
const app = express();
const stripe = require('stripe')('sk_test_51OB8JlIPoM7JHRT2Dz4UeKOU5Snexc9lFpmu2Hp6d0PfCZKCwqWE4NanolwHC5fSd5hbLwsnpHAEJphTByN5c93w00pEpp1vJt');
const path = require('path');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('Creating checkout session');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'EMS Product',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
cancel_url: `${req.headers.origin}/singup.html`, // Corrected this line
    });
    // console.log('Checkout session created:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    // console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  // console.log('Server is running on port 3000');
});
