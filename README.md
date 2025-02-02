# Toot'n Totum Express Wash Code Campaign

Production build v1.0.0

A web application for Toot'n Totum Express Wash customers to receive complimentary car wash codes via SMS.

## Features
- Name and phone number validation
- SMS code delivery
- Proper case name formatting
- Phone number formatting
- Marketing consent management
- Duplicate submission prevention
- Responsive design
- Rate limiting (30-second cooldown between submissions)
- Session timeout (5-minute inactivity reset)

## Technical Stack
- React
- Vite
- Tailwind CSS
- Axios for API calls

## Deployment
Deployed on Railway.app
Production URL: https://carwashcodecampaign-production.up.railway.app

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Setup Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/jlutztnt/carwashcodecampaign.git
   cd carwashcodecampaign
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   This will start the application on `http://localhost:5173`

4. For production build:
   ```bash
   npm run build
   ```
   This will create an optimized build in the `dist` folder

## Project Structure
```
carwashcodecampaign/
├── src/
│   ├── components/
│   │   └── CustomerForm.jsx
│   ├── App.jsx
│   └── index.css
├── postcss.config.js
├── tailwind.config.js
└── package.json
```

## Deployment on Railway

1. Create a Railway account at [railway.app](https://railway.app)

2. Connect your GitHub repository:
   - Log in to Railway
   - Create a new project
   - Choose "Deploy from GitHub repo"
   - Select `jlutztnt/carwashcodecampaign`

3. Railway will automatically:
   - Detect your Node.js application
   - Install dependencies
   - Build and deploy your application

## Environment Variables
For production deployment, configure these variables in Railway:
- `VITE_API_URL`: Your API endpoint
- `VITE_AUTH_TOKEN`: Your authentication token

## Technologies Used
- React - Frontend framework
- Tailwind CSS - Styling
- Axios - HTTP client
- Vite - Build tool

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License 