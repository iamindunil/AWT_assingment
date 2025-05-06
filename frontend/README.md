# Online Book Manager - Frontend

This is the frontend application for the Online Book Manager platform, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**
  - Registration with form validation
  - Login/logout functionality
  - Email verification

- **Book Management**
  - Browse book catalog
  - Search and filter books
  - View detailed book information

- **Shopping Experience**
  - Add books to cart
  - Update quantities
  - Checkout process
  - Shipping and payment forms

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Static typing for better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Axios**: HTTP client for API requests
- **React Icons**: Icon library

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/online-book-manager.git
cd online-book-manager/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js App Router pages
- `/components`: Reusable React components
- `/context`: React context providers for state management
- `/public`: Static assets

## Backend Integration

This frontend connects to a Node.js/Express backend API. Make sure the backend server is running on port 5000 for the application to work correctly.

## Responsive Design

The application is fully responsive and works on devices of all sizes, from mobile phones to desktop computers.

## Environment Setup

To ensure the application can connect to the backend server properly, create a `.env.local` file in the frontend directory with the following content:

```
# Backend API URL - This needs to be NEXT_PUBLIC_ to be accessible in the browser
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Add other environment variables as needed
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Make sure to adjust the URL if your backend is running on a different port or host.

**Important**: After creating or changing the `.env.local` file, restart your development server for the changes to take effect. 