const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, error => {
  if (error) throw error;
  console.log('Server running on port ' + port);
});

app.post('/payment', (req, res) => {
   const {token,amount}=JSON.parse(req.body);
   const idempotentencyKey=uuidv4();

   return stripe.customers.create({
     source: token.id,
     email:token.email
   } ).then(customer=>{
      return stripe.charges.create({
         amount:amount,
         currency:'usd',
         customer:customer.id,
         receipt_email:token.email,
         shipping:{
          name:token.card.name,
          address:{
            country:token.card.address_country,
            line1:token.card.address_line1,
            line2:token.card.address_line2,
            city:token.card.address_city,
            postal_code:token.card.address_zip
           }
         }
      },{idempotentencyKey})
   })
   .then(result=>res.status(200).json(JSON.parse(result)))
   .catch(err=>res.status(500).send(err));
});
