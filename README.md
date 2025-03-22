# Role-Based Access Control (RBAC) Backend

A NestJS and TypeScript backend project for managing user roles and authentication with role-based access control.

## Features

- User authentication with JWT
- Role-based access control (RBAC)
- MongoDB integration
- TypeScript and NestJS

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by creating a `.env` file in the root directory:
   ```
   JWT_SECRET=your_jwt_secret
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/rbac-system
   ```
   Note: Replace the MongoDB URI with your actual connection string.

4. Seed the database with initial roles and an admin user:
   ```bash
   # Seed the database
   node seed-db.js
   ```

   The admin user will be created with the following credentials:
   - Email: admin@example.com
   - Password: Admin@123

## Usage

### Development

```bash
# Start the development server
npm run start:dev
```

### Production

```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Troubleshooting

If you encounter issues running the application:

1. Make sure MongoDB is running and accessible
2. Verify your `.env` file contains the correct configuration
3. Try clearing the `dist` directory and rebuilding:
   ```bash
   rm -rf dist
   npm run build
   ```
4. Check for any permission issues with node_modules:
   ```bash
   rm -rf node_modules
   npm install
   ```

## API Documentation

### Authentication Endpoints

#### Register a new user

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "name": "String (required)",
    "email": "String (required)",
    "password": "String (required)",
    "gender": "String (required)",
    "age": "Number (required)"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "message": "User registered successfully",
      "token": "JWT_TOKEN",
      "user": {
        "name": "User Name",
        "email": "user@example.com",
        "gender": "male",
        "age": 30,
        "role": {
          "name": "user",
          "scopes": ["view_dashboard"],
          "rank": 1
        }
      }
    }
    ```

#### Login user

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "email": "String (required)",
    "password": "String (required)"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Login successful",
      "token": "JWT_TOKEN",
      "user": {
        "name": "User Name",
        "email": "user@example.com",
        "gender": "male",
        "age": 30,
        "role": {
          "name": "user",
          "scopes": ["view_dashboard"],
          "rank": 1
        }
      }
    }
    ```

### User Endpoints

#### Get User Profile

- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Auth required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "gender": "male",
      "age": 30,
      "role": {
        "name": "user",
        "scopes": ["view_dashboard"],
        "rank": 1
      }
    }
    ```

#### Update User Profile

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Auth required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body**:
  ```json
  {
    "name": "String (optional)",
    "email": "String (optional)",
    "gender": "String (optional)",
    "age": "Number (optional)"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "name": "Updated Name",
      "email": "user@example.com",
      "gender": "male",
      "age": 31,
      "role": {
        "name": "user",
        "scopes": ["view_dashboard"],
        "rank": 1
      }
    }
    ```

#### Get All Users

- **URL**: `/api/users`
- **Method**: `GET`
- **Auth required**: Yes (JWT Token with `manage_users` scope)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    [
      {
        "name": "Admin User",
        "email": "admin@example.com",
        "gender": "other",
        "age": 30,
        "role": {
          "name": "admin",
          "scopes": ["manage_users", "manage_roles", "view_dashboard"],
          "rank": 10
        }
      },
      {
        "name": "Regular User",
        "email": "user@example.com",
        "gender": "male",
        "age": 25,
        "role": {
          "name": "user",
          "scopes": ["view_dashboard"],
          "rank": 1
        }
      }
    ]
    ```

#### Get User by ID

- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Auth required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "gender": "male",
      "age": 30,
      "role": {
        "name": "user",
        "scopes": ["view_dashboard"],
        "rank": 1
      }
    }
    ```

#### Assign Role to User

- **URL**: `/api/users/assign-role`
- **Method**: `POST`
- **Auth required**: Yes (JWT Token with `manage_users` scope)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body**:
  ```json
  {
    "userId": "String (required)",
    "roleId": "String (required)"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "gender": "male",
      "age": 30,
      "role": {
        "name": "manager",
        "scopes": ["view_dashboard", "manage_users"],
        "rank": 5
      }
    }
    ```

### Role Endpoints

#### Create a New Role

- **URL**: `/api/roles`
- **Method**: `POST`
- **Auth required**: Yes (JWT Token with `manage_roles` scope)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body**:
  ```json
  {
    "name": "String (required)",
    "scopes": "Array of strings (required)",
    "rank": "Number (required)"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "name": "manager",
      "scopes": ["view_dashboard", "manage_users"],
      "rank": 5
    }
    ```

#### Get All Roles

- **URL**: `/api/roles`
- **Method**: `GET`
- **Auth required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    [
      {
        "name": "admin",
        "scopes": ["manage_users", "manage_roles", "view_dashboard"],
        "rank": 10
      },
      {
        "name": "user",
        "scopes": ["view_dashboard"],
        "rank": 1
      }
    ]
    ```

#### Get Role by ID

- **URL**: `/api/roles/:id`
- **Method**: `GET`
- **Auth required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "name": "admin",
      "scopes": ["manage_users", "manage_roles", "view_dashboard"],
      "rank": 10
    }
    ```

#### Update Role

- **URL**: `/api/roles/:id`
- **Method**: `PUT`
- **Auth required**: Yes (JWT Token with `manage_roles` scope)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body**:
  ```json
  {
    "name": "String (optional)",
    "scopes": "Array of strings (optional)"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "name": "updated-role",
      "scopes": ["view_dashboard", "manage_users"],
      "rank": 5
    }
    ```

#### Delete Role

- **URL**: `/api/roles/:id`
- **Method**: `DELETE`
- **Auth required**: Yes (JWT Token with `manage_roles` scope)
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Success Response**:
  - **Code**: 200

## Role Scopes

The application uses the following scopes for permission control:

- `view_dashboard` - Can access dashboard functionality
- `manage_users` - Can create, update, and delete users
- `manage_roles` - Can create, update, and delete roles

## Default Roles

The application comes with two predefined roles:

1. **Admin** - Has all scopes (`manage_users`, `manage_roles`, `view_dashboard`), rank 10
2. **User** - Has only basic dashboard access (`view_dashboard`), rank 1

## Testing the API

After starting the application, you can test the API endpoints:

1. First, seed the database with roles and admin user
2. Login with the admin user to get a JWT token
3. Use the token to access protected routes

Example using curl:

```bash
# Login with admin user
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "Admin@123"}'

# Register a new user
curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d '{"name": "New User", "email": "user@example.com", "password": "Password123", "gender": "male", "age": 25}'

# Get all users (admin only)
curl -X GET http://localhost:3000/api/users -H "Authorization: Bearer YOUR_JWT_TOKEN"
```