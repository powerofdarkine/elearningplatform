# E-Learning Platform

A comprehensive online learning platform with features for managing courses, students, instructors, assessments, and payments.

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

## 📊 Database Setup (MySQL)

### Initial Setup:
1. **Setup MySQL**: Use MySQL Configurator to configure your local server with the root user
2. **Connect**: Open MySQL Workbench and connect to your local server
3. **Run Scripts**: Import the .sql files in the following order:
   - task 1.1.sql (Create database schema)
   - task 1.2.sql (Insert sample data)
   - task 2.1.sql (Procedures - Enrollment management)
   - task 2.2.sql (Triggers - Business logic)
   - task 2.3.sql (Procedures - Data retrieval)
   - task 2.4.sql (Functions - Reporting)

## ✨ Key Features

### 👥 User Management
- **3 User Types**: Administrators, Instructors, Students
- **Multi-Role Users**: Users can be both instructors and students
- **Personal Information**: Name, Email, Address (Street, City, Postal Code)
- **Teaching Languages**: Instructors can teach multiple languages

### 📚 Course Management
- **Create & Approve Courses**: Instructors create courses, administrators approve
- **Course Information**: Name, Description, Difficulty Level (Beginner/Intermediate/Advanced), Price
- **Course Categories**: Each course can belong to multiple categories
- **Course Languages**: Each course supports multiple languages
- **Prerequisites**: Courses can require completion of other courses first
- **Popular Courses List**: View courses with the highest enrollment numbers

### 📝 Course Content
- **Lessons**: Each course has 1-3 lessons
- **Learning Resources**: Support for multiple resource types:
  - Videos
  - Documents
  - Links
  - Other resources
- **Cloud Storage**: Store resources with URLs

### ✅ Assessments & Evaluation
- **Quizzes**:
  - Support for multiple questions with different types
  - Multiple attempts (Num_attempt)
  - Minimum passing score (Passing_score)
  - Time limit for completion (Time_limit)
  - Support for multiple answers per question

- **Projects**:
  - Detailed descriptions and project names
  - Team-based work support (Team_size)
  - Release and due dates

- **Assessment Weights**: Each quiz/project has a weight (0-100%)
- **Final Score Calculation**: Automatically calculated based on weights

### 📜 Certificates
- **Certificate Issuance**: Automatically issued when student completes a course
- **Issue Date**: Records the date of certificate issuance
- **Course Link**: Each certificate is tied to a course

### 💰 Payments
- **Payment History**: Records all transactions
- **Payment Methods**: Support for multiple payment methods (credit card, e-wallet, etc.)
- **Debt Monitoring**: Automatically updates total amount due when enrolling/dropping courses

### ⭐ Reviews & Ratings
- **Star Ratings**: Ratings from 1-5 stars
- **Text Reviews**: Detailed feedback from students
- **Review Timestamp**: Records when the review was submitted
- **Course Link**: Each review is tied to a course

### 📊 Advanced Features

#### Enrollment Management:
- **sp_enroll_create**: Enroll in a course with validations:
  - Verify student is valid
  - Course must be approved
  - Instructors cannot enroll in their own courses
  - Prevent duplicate enrollments

- **sp_enroll_update_transfer**: Transfer to another course with restrictions:
  - Only allowed within first 10 days
  - Check prerequisites
  - Prevent transfer if course is already completed

- **sp_enroll_delete**: Drop a course with constraints:
  - Cannot drop if already paid
  - Cannot drop if certificate has been issued

#### Automatic Triggers:
- **Prerequisite Checking**: Automatically validates when enrolling/transferring
- **Debt Calculation**: Automatically adds/subtracts course price when enrolling/dropping/transferring

#### Reporting Functions:
- **fn_student_category_preferences**: Analyzes student's category preferences
  - Calculate percentage for each category
  - Sort by interest level

- **fn_course_score_report**: Detailed student score report
  - List scores for each quiz/project
  - Display weights
  - Calculate final score

#### Query Procedures:
- **sp_get_enrolled_courses**: Get student's enrolled courses list
- **sp_get_popular_courses**: View most popular courses (with filters)

### 🎮 Learning Competitions
- **Create & Manage Competitions**: Administrators create competitions
- **Student Participation**: Students can participate
- **Timeline**: Start and end dates for competitions

## 🔐 Authentication & Security (Clerk)

### Create Clerk Account:
1. Visit https://clerk.com/
2. Create an account and new project
3. Get your API keys

### Configure Clerk:
1. Create an `.env` file in the root directory
2. Add the following environment variables:

```env
# Clerk API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database Connection (Replace PASSWORD with your MySQL root password)
DATABASE_URL="mysql://root:PASSWORD@localhost:3306/elearning_db"
```

## 🔗 Database Connection

Synchronize schema and generate Prisma client:

```bash
npx prisma db pull
npx prisma generate
```

## 🏃 Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

**Technologies Used**: Next.js, TypeScript, Tailwind CSS, MySQL, Prisma, Clerk
