# TaurusCanis Rex Web Store

The TaurusCanis Rex Web Store is a part of a music project originally built using Django, and later transitioned to a more modern stack utilizing React for the front-end and Django REST Framework for the back-end. It provides a platform where users can browse products, view product details, add items to a shopping cart, and proceed through a checkout process. The checkout process is powered by Stripe (currently configured with the sandbox API for demonstration purposes, so no real transactions will occur).

## Features

- **Product Browsing**: Users can browse through various products available in the store.
- **Product Details**: Clicking on a product provides more detailed information.
- **Shopping Cart**: Users can add items to a shopping cart.
- **Checkout Process**: Users can proceed to checkout and enter payment details (Note: Stripe is configured in sandbox mode, no real transactions will occur).

## Technologies

- **Frontend**: React
- **Backend**: Django REST Framework
- **Payment Processing**: Stripe

## Live Demo

- [TaurusCanis Rex Web Store](https://andrewdole.com/ecommerce/)

## Project Structure

The project is structured into two separate sub-folders for the frontend and backend within the Portfolio repo:

- **Frontend**: Contains all the React code for rendering the user interface of the web store.
- **Backend**: Houses the Django REST Framework code for the backend logic, APIs, and interaction with Stripe for payment processing.
