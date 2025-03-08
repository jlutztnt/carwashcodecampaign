# Car Wash Code Campaign - Next.js Version

This is a Next.js implementation of the Car Wash Code Campaign application. The application allows customers to enter their name and phone number to receive a complimentary car wash code via SMS.

## Features

- Name and phone number validation
- Proper case name formatting
- Phone number formatting
- SMS code delivery
- Marketing consent management
- Duplicate submission prevention
- Responsive design
- Rate limiting
- Session timeout

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/pages` - Next.js pages including the main index page and API routes
- `/components` - Reusable React components
- `/styles` - Global styles including Tailwind CSS
- `/app` - Next.js app directory structure

## API Routes

- `/api/submit-form` - Handles form submissions and forwards them to the external API

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Axios for API requests
