# UniLearn: Setup & Quick-Start Guide

A clean, practical step-by-step guide to get the UniLearn system fully running and tested.

---

## 🛠️ Step 1: Installation & Setup

1. **Install Dependencies** (Run at the root directory):
   ```bash
   pnpm install
   ```

2. **Backend Configuration**:
   Create a `.env` file in `apps/backend/` and populate it with your database and service details:
   ```env
   # Database connection
   DATABASE_URL="postgresql://<db_username>:<db_password>@localhost:5432/<db_name>?schema=public"

   # Security keys (use any secure random strings)
   ACCESS_TOKEN_SECRET="your_access_token_secret"
   REFRESH_TOKEN_SECRET="your_refresh_token_secret"

   # Allowed client domains
   CLIENT_ORIGIN="http://localhost:5173,http://localhost:5174"

   # AI Service (if applicable)
   AI_SERVICE_URL="http://127.0.0.1:8000"
   AI_INTERNAL_API_KEY="your_ai_api_key"

   # Cloudinary Media credentials
   CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

   # Brevo SMTP configuration (for verification & password recoveries)
   BREVO_EMAIL="your_brevo_smtp_username"
   BREVO_SMTP_KEY="your_brevo_smtp_password"
   FROM_EMAIL="UniLearn <your_verified_sender_email>"
   ```

3. **Frontend Configuration**:
   Create a `.env` file in `apps/frontend/` and configure your API endpoint:
   ```env
   VITE_API_URL="http://localhost:3000/api/"
   ```

4. **Initialize Database & Seed Data** (Run at the root directory):
   ```bash
   pnpm db:push
   pnpm db:generate
   pnpm db:seed
   ```

5. **Start the Workspace**:
   ```bash
   pnpm dev
   ```
   * **Frontend App**: `http://localhost:5173`
   * **Backend API**: `http://localhost:3000`

---

## 🚀 Step 2: Step-by-Step Functional Walkthrough

To verify the system, open the browser and follow this sequence:

1. **Create Student Account**:
   * Navigate to `http://localhost:5173/register`.
   * Register using a university email (must end with `@aau.edu.et`).
2. **Verify Email**:
   * Open the activation link sent to your email (or copy the local verification link printed in your backend terminal log).
   * Your account is now verified!
3. **Onboard Profile**:
   * Log in at `http://localhost:5173/login`.
   * Complete the first-time profile popup by entering a **Student ID** and selecting an **Academic Year**.
4. **Study & Use AI Workspace**:
   * Go to **Courses**, choose a course, and select any study document uploaded by instructors.
   * Use **AI Chat** on the right side to ask questions about pages, click **Summary** to read a quick chapter breakdown, or take an **AI Quiz** to test your knowledge.
5. **Recover Account (Forgot Password)**:
   * Log out, go to `/login`, and click **Forgot password?**.
   * Enter your university email.
   * Open the link received in your inbox.
   * Enter a new secure password, confirm it, and submit.
   * The page will clear your session and redirect you back to `/login` after 3 seconds.
   * Log in with your email and new password successfully!

---

## 👥 Step 3: Admin & Instructor Course Assignment Walkthrough

To verify administrative control and instructor material management, use the seeded demo accounts:

### 1. Assigning an Instructor (Admin Workflow)
1. Navigate to the login page and sign in using the pre-seeded **Admin** credentials:
   * **Email**: `Admin@uni.test`
   * **Password**: `12345678`
2. Once on the **Admin Hub / Ops Console**, select the **User Management** tab on the sidebar to view all registered students and instructors.
3. Select **Course Management** on the sidebar to view all created university courses.
4. Select a course (e.g., *Programming Fundamentals*) and click **Assign Instructor**.
5. Select **Dr. Jane Smith** or **Prof. Samuel Alemayehu** from the instructor dropdown menu and click **Assign**.
6. Log out of the Admin console.

### 2. Uploading Study Materials (Instructor Workflow)
1. Sign in using the pre-seeded **Instructor** credentials:
   * **Email**: `Ins@uni.test`
   * **Password**: `12345678`
2. On your **Instructor Console / teaching dashboard**, you will see your active course assignments (e.g., *Artificial Intelligence* or *Programming Fundamentals*).
3. Select the course and click **Upload Resource**.
4. Drag or select a lecture PDF, slides (`.pptx`), or worksheet (`.docx`, `pdf`), then click **Upload**.
5. The system will ingest, chunk, and index the file. Once it shifts to a `READY` state, it is fully accessible to all enrolled student dashboards!




### notice - it doesn't include mobile app, the folder is aimed for mobile app course submission. 
