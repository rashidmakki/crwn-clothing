const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const enforce=require("express-sslify");
const { v4: uuidv4 } = require('uuid');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({trustProtoHeader:true}));
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, error => {
  if (error) throw error;
  console.log('Server running on port ' + port);
});

app.get('/service-worker.js',(req,res)=>{
   res.sendFile(path.resolve(__dirname,'..','build','service-worker.js'));
})

app.post('/payment', (req, res) => {
   const {token,amount}=req.body;
   const idempotentencyKey=uuidv4();
    console.log('Token :',token,amount);
   return stripe.customers.create({
     source: token.tokenId,
     email:token.email
   } ).then(customer=>{
      const charge=stripe.charges.create({
         amount:amount*100,
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
           },
         }
      })
      return charge;
   })
   .then(result=>res.status(200).json({...result}))
   .catch(err=>res.status(500).send(err));
});