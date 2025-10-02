const stripe = require('../utils/stripe');

exports.createPaymentIntent = async (req, res) => {
  const { amount, currency, customerEmail } = req.body;
  try {
    const customer = await stripe.customers.create({ email: customerEmail });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
