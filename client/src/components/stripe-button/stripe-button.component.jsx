import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useToast } from "@chakra-ui/core";

const StripeCheckoutButton = ({ price }) => {
  const toast = useToast();
  const priceForStripe = price * 100;
  const publishableKey = "pk_test_51H2a4YBFNahoJiBBTQDQ3guYdvsLv74Nyxj0BWDvMc24EG2MDnHfJJjMRG3TWpWcd7dPiatNP1qwq8jL0ig0e9mo00HZg33sxx";

  const onToken = (token) => {
    axios({
      url: "payment",
      method: "post",
      data: {
        amount: priceForStripe,
        token,
      },
    }).then((response) => {
        toast({
          position:'top',
          title: "Payment Successful",
          description: "Your payment was successful.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log("Payment Error", error.toString());
        toast({
          position:'top',
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
