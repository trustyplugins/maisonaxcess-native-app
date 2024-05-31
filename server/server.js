
const stripe = require('stripe')('sk_test_51PMN9f03dsvurDQtZy7hpH6HRIhAaHZFm7dZtAAnAW19cEY66HrqUQPUPx2tWSwzfV2GjjvnbRRNZOKo4lJgjnnj00JUpkNAkB');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())

app.get('/',(req, res)=>{
    res.send("Hello Folks.")
})


app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.

    const {amount, currency} = req.body

    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2022-08-01'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      payment_method_types: [ 'card'],
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  });

app.listen(4002, ()=> console.log("Running on http://localhost:4002"))