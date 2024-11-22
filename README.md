## File Exchange Platform

<p>A web application for secure file sharing with user authentication, admin management, and role-based permissions.</p>

### Technologies Used

**Backend:**

- **FastAPI**: High-performance backend framework.
- **SQLAlchemy**: ORM for asynchronous interaction with the database.
- **Alembic**: Database migrations.
- **Redis**: In-memory database for JWT blacklisting.
- **FastAPI-JWT**: JWT-based authentication and authorization.
- **MySQL**: Database for file information and user storage.

**Frontend:**

- **Vue.js**: Framework for building the user interface.
- **Vite**: Fast development build tool.
- **Bootstrap**: CSS framework for responsive UI design.

### Features

- **JWT Authentication & Authorization:** Secure user access with JWT tokens, featuring token blacklisting for expired tokens.
- **Role-Based Access Control:**
  - **Admins:** Access detailed statistics (e.g., file download counts, user-specific download counts); view a complete list of all files; manage files (upload, download, delete); assign admin rights to other users; and grant file download permissions to specific users. 
  - **Regular Users:** Can only view and download files they have explicit permission for.
- **File Operation Logging:** Comprehensive logging for file uploads and downloads, implemented using middleware for tracking actions.
- **File Storage:** Files are saved with unique names (uuid4) to prevent collisions, while their original names are securely stored in the database for reference.

### Installation and Setup

**Prerequisites**

- Docker installed on your system.

**Remarks**

- I added an `.env` file to the repository to simplify the installation process. I know that this cannot be done in real
  projects.
- The first user created will automatically receive admin rights if none exist in the database.

**Steps**

1. Clone repository:

```
git clone git@github.com:bihunva/file-sharing-system.git
```

2. Go to the project directory:

```
cd file-sharing-system
```

3. Start containers in detached mode with image build (add `-d` to run in detached mode):

```
docker compose up --build
```

4. Open this URL in your browser to start interacting with the application: [http://localhost:5173/]()

### Demo

![Demo](demo.gif)