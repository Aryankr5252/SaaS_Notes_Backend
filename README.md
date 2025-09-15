# SaaS Notes Backend

A multi-tenant SaaS backend for note management, built with Express.js and MongoDB. Supports user authentication, tenant management, and note CRUD operations with role-based access control.

## Features
- Multi-tenant architecture (tenants, users, notes)
- User registration, login, profile, and logout
- Tenant registration and upgrade (free/pro plans)
- Note creation, retrieval, update, and deletion
- Role-based access (Admin, Member)
- JWT authentication and cookie-based sessions
- Express validation and error handling

## Folder Structure
```
├── app.js                # Main Express app setup
├── server.js             # Server entry point
├── package.json          # Dependencies and scripts
├── config/
│   └── dbConnect.js      # MongoDB connection logic
├── controllers/
│   ├── notesController.js    # Note CRUD logic
│   ├── tenantController.js   # Tenant registration/upgrade
│   └── userController.js     # User auth/profile logic
├── middleware/
│   └── authMiddleware.js     # Auth and admin checks
├── models/
│   ├── noteModel.js          # Note schema
│   ├── tenantModel.js        # Tenant schema
│   └── userModel.js          # User schema
├── routes/
│   ├── healthRouter.js       # Health check endpoint
│   ├── noteRouter.js         # Note endpoints
│   ├── tenantRouter.js       # Tenant endpoints
│   └── userRouter.js         # User endpoints
├── utils/                # Utility functions (empty)
└── README.md             # Project documentation
```

## API Endpoints

### Health
- `GET /api/health` — Health check

### Users
- `POST /api/users/register` — Register user
- `POST /api/users/login` — Login user
- `GET /api/users/profile` — Get user profile (auth required)
- `GET /api/users/logout` — Logout user

### Tenants
- `POST /api/tenants/register` — Register tenant
- `POST /api/tenants/:slug/upgrade` — Upgrade tenant plan (admin only)

### Notes
- `POST /api/notes/create` — Create note (auth required)
- `GET /api/notes/getAll` — Get all notes for tenant (auth required)
- `GET /api/notes/getOne/:id` — Get notes by user (auth required)
- `PUT /api/notes/update/:id` — Update note (auth required)
- `DELETE /api/notes/delete/:id` — Delete note (auth required)

## Models
- **User**: userName, email, password, role, slug, tenantId
- **Tenant**: name, slug, plan, noteLimit
- **Note**: title, content, tenantId, createdBy

## Setup
1. Clone the repo
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   - `MONGO_URL=<your_mongo_connection_string>`
   - `JWT_SECRET=<your_jwt_secret>`
4. Start server: `npm start`

## License
MIT
---

## Tenant Upgrade Endpoint Details

### Upgrade Tenant to Pro

**Endpoint:** `POST /api/tenants/:slug/upgrade`

- Only accessible by users with Admin role
- Upgrades the tenant's plan to "pro" and sets noteLimit to unlimited
- Example request body: `{}` (no body required)
- Example response:
   ```json
   {
      "message": "Tenant <slug> upgraded to Pro",
      "plan": "pro"
   }
   ```
