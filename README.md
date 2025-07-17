# Infrastructure Management System

A full-stack web application for managing telecommunications infrastructure, built with React, Node.js/Express, and MySQL.

## Features

- **Dashboard**: Overview of all infrastructure components
- **Location Management**: TDL sites and TSF facilities
- **Equipment Management**: AC/DC equipment, HVAC systems, generators
- **Supplier & Manufacturer Management**: Contact and vendor information
- **Requirements Management**: Track infrastructure needs and requests
- **Secure Authentication**: Protected database modifications with admin credentials
- **French Localization**: Complete French interface for all user-facing content

## Technology Stack

- **Frontend**: React 18 with Bootstrap 5
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **API**: RESTful API with full CRUD operations

## Project Structure

```
Project/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Database configuration
│   ├── routes/             # API route handlers
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── App.js          # Main app component
│   └── package.json        # Frontend dependencies
└── drawSQL-mysql-export-2025-07-16.sql  # Database schema
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Database Setup

1. Create a MySQL database named `infrastructure_db`
2. Import the provided schema:
   ```bash
   mysql -u root -p infrastructure_db < drawSQL-mysql-export-2025-07-16.sql
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env` file and update database credentials
   - Set your MySQL username, password, and database name

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## API Endpoints

### Locations
- `GET/POST /api/tdl` - TDL sites
- `GET/POST /api/tsf` - TSF facilities

### Equipment
- `GET/POST /api/ac` - AC equipment (UPS/OND)
- `GET/POST /api/dc` - DC equipment (batteries, systems)
- `GET/POST /api/hvac` - HVAC systems
- `GET/POST /api/gen-tsw` - Generators and TSW
- `GET/POST /api/autre` - Other equipment

### Management
- `GET/POST /api/besoin` - Requirements
- `GET/POST /api/fournisseurs` - Suppliers
- `GET/POST /api/fabricant` - Manufacturers

Each endpoint supports full CRUD operations:
- `GET /{endpoint}` - List all records
- `GET /{endpoint}/:id` - Get specific record
- `POST /{endpoint}` - Create new record
- `PUT /{endpoint}/:id` - Update record
- `DELETE /{endpoint}/:id` - Delete record

## Security & Authentication

### Frontend Authentication
The application includes secure authentication for database modifications:

1. **Environment Variables**: Admin credentials are stored in environment variables
2. **Session Management**: 30-minute session timeout for security
3. **Protected Operations**: Create, Update, Delete operations require authentication
4. **Secure Storage**: Credentials stored in sessionStorage (not localStorage)

### Setup Authentication

1. Copy the environment template:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Set your admin credentials in `frontend/.env`:
   ```env
   REACT_APP_ADMIN_USERNAME=your_admin_username
   REACT_APP_ADMIN_PASSWORD=your_secure_password
   ```

3. **Important**: Never commit the `.env` file to version control

### Security Best Practices
- Admin credentials are not displayed in the UI
- Environment variables are used for sensitive configuration
- Session tokens expire automatically
- Authentication is required for all data modifications

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Use the navigation menu to access different sections
4. Add, edit, and manage your infrastructure data through the web interface

## Development

- Backend uses nodemon for auto-restart during development
- Frontend uses React's hot reload for instant updates
- All API calls are proxied through the React dev server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
