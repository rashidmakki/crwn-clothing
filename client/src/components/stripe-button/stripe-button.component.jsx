import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { useToast } from "@chakra-ui/core";

const StripeCheckoutButton = ({ price }) => {
  const toast = useToast();
  const priceForStripe = price * 100;
  const publishableKey ="pk_test_51H2a4YBFNahoJiBBTQDQ3guYdvsLv74Nyxj0BWDvMc24EG2MDnHfJJjMRG3TWpWcd7dPiatNP1qwq8jL0ig0e9mo00HZg33sxx";

  const onToken = (token) => {
     const body={
        amount: priceForStripe,
        token
     }
      return fetch(`https://apparel-live.herokuapp.com/checkout`,{
       method:'POST',
       headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
                },
       body:JSON.stringify(body)
    })
    .then(response=>response.json())
    .then(({id,balance_transaction,amount})=>({id,balance_transaction,amount}))
    .then(data=>{
      console.log('Payment Successful :',data);
      toast({
        position: "top",
        title: "Payment Successful",
        description: "Your payment was successful.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    })
    .catch((error) => {
      console.log("Payment", error);
      toast({
        position: "top",
        title: "An error occurred.",
        description:"There was an issue with your payment. Please make sure you use the provided credit card.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    });
  };

  return (
    <StripeCheckout
      label="Pay Now"
      name="CRWN Clothing Ltd."
      billingAddress
      shippingAddress
      image="https://svgshare.com/i/CUz.svg"
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel="Pay Now"
      token={onToken}
      stripeKey={publishableKey}
    />
  );
};

export default StripeCheckoutButton;
