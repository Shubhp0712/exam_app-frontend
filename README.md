# ExamHub - Online Examination System (Next.js Frontend)

A modern, full-featured online examination platform built with **Next.js 16**, **TypeScript**, **React Context API**, and **Tailwind CSS**.

## 📋 Project Structure

```
frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx          # Root layout with AuthProvider
│   │   ├── page.tsx            # Home page
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── exam/
│   │   │   ├── page.tsx        # Exam list
│   │   │   └── [id]/page.tsx   # Exam taking interface
│   │   ├── result/page.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── create-exam/page.tsx
│   │       └── manage-questions/page.tsx
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ExamCard.tsx
│   │   ├── QuestionCard.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── services/               # API service layer
│   │   ├── api.ts             # Axios base config with interceptors
│   │   ├── authService.ts
│   │   ├── examService.ts
│   │   └── resultService.ts
│   │
│   ├── context/                # Global state
│   │   └── AuthContext.tsx     # Authentication context
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.ts          # Auth context hook
│   │
│   ├── types/                  # TypeScript interfaces
│   │   ├── user.ts
│   │   ├── exam.ts
│   │   └── result.ts
│   │
│   ├── utils/                  # Helper functions
│   │   └── token.ts            # JWT token utilities
│   │
│   └── styles/
│       └── globals.css         # Global styles with Tailwind
│
├── public/
├── .env.local
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:5000/api`
- MongoDB Atlas (or local MongoDB) connection should be active

### Installation

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment (if needed):**
The `.env.local` file is already configured:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Development

**Start development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

**Build for production:**
```bash
npm run build
npm start
```

## 🔐 Authentication

### Flow
1. User signs up with email/password/role (Admin or Student)
2. Backend returns JWT token valid for 7 days
3. Token stored in `localStorage`
4. HTTP Interceptor automatically adds `Authorization: Bearer <token>` header
5. On page reload, `AuthProvider` verifies token with `/auth/me` endpoint
6. Session persists across browser restarts (until token expires)

### Protected Routes
- `/dashboard` - Requires authentication
- `/exam/:id` - Requires authentication (Student)
- `/admin` - Requires Admin role
- `/admin/create-exam` - Requires Admin role
- `/admin/manage-questions` - Requires Admin role
- `/result` - Requires authentication

## 📚 Key Features

### For Students
- ✅ Browse available exams
- ✅ Take exams with timer
- ✅ View exam questions with MCQ options
- ✅ Submit answers and get instant results
- ✅ View result history with pass/fail status

### For Admins
- ✅ Create and manage exams
- ✅ Add questions with 4 options and correct answer
- ✅ Publish/unpublish exams
- ✅ Delete exams and questions
- ✅ View student results and statistics

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Authentication:** JWT (with HttpInterceptor)
- **UI Components:** Custom (responsive, accessible)

## 📡 API Integration

### Base Configuration
All requests go through `axios` with auto-attached JWT tokens:

```typescript
// src/services/api.ts
- Adds Authorization header automatically
- Clears token on 401 responses
- Base URL from environment variable
```

### Services Available

**authService:**
- `signup(data)` - Create new account
- `login(data)` - Login with email/password
- `getMe()` - Get current user info
- `logout()` - Clear token and user data
- `isAdmin()` - Check if user is admin

**examService:**
- `getAllExams()` - Fetch all exams
- `getExamById(id)` - Get single exam
- `createExam(data)` - Create new exam (admin only)
- `updateExam(id, data)` - Update exam (admin only)
- `deleteExam(id)` - Delete exam (admin only)
- `publishExam(id)` - Publish exam (admin only)
- `getExamQuestions(examId)` - Fetch exam questions
- `createQuestion(data)` - Add question to exam
- `deleteQuestion(id)` - Delete question

**resultService:**
- `submitExam(data)` - Submit exam answers
- `getStudentResults()` - Get user's results
- `getAllResults()` - Get all results (admin only)
- `getExamStats(examId)` - Get exam statistics

## 🎨 Styling

**Tailwind CSS** with custom components defined in `globals.css`:
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger/delete button
- `.card` - Card component with shadow
- `.input-field` - Form input styling
- `.form-group` - Form group spacing
- `.label` - Form label styling

## 🔍 Debugging

### Browser Console
- API requests/responses logged
- Auth state changes logged
- Error messages displayed in UI

### Environment
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)
- MongoDB: Check `.env` in backend folder

### Troubleshooting

**"Failed to connect to backend"**
- Ensure backend is running: `npm start` in `/backend`
- Check MongoDB connection
- Verify API URL in `.env.local`

**"401 Unauthorized"**
- Token may have expired (7-day limit)
- Try logging out and logging back in
- Clear browser localStorage

**"Cannot find module"**
- Run `npm install` to ensure all dependencies installed
- TypeScript types should be auto-generated

## 📦 Building for Production

```bash
npm run build        # Build Next.js application
npm run start        # Start production server
```

Production output goes to `.next/` directory.

## 🤝 Backend Integration

Ensure your backend API provides these endpoints:

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout (optional)

### Exams
- `GET /api/exams` - List all exams
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams` - Create exam (admin only)
- `PUT /api/exams/:id` - Update exam (admin only)
- `DELETE /api/exams/:id` - Delete exam (admin only)
- `PUT /api/exams/:id/publish` - Publish exam

### Questions
- `GET /api/questions/:examId` - Get exam questions
- `POST /api/questions` - Create question (admin only)
- `DELETE /api/questions/:id` - Delete question (admin only)

### Results
- `POST /api/results` - Submit exam
- `GET /api/results/my-results` - Get user results
- `GET /api/results` - Get all results (admin only)
- `GET /api/results/stats/:examId` - Get exam statistics

## 📝 License

MIT License

## 🆘 Support

For issues or questions, check the console logs or contact support.

---

**Built with ❤️ using Next.js and TypeScript**
