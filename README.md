# 🎮 Gamingify Arena

Gamers often struggle to find a centralized, community-driven platform to share and consume up-to-the-minute gaming news, in-depth reviews, and practical tips. Existing platforms either lack robust community features, or are not tailored specifically for different users around the internet, leading to missed opportunities for connection and knowledge sharing.

Gamingify Arena provides a seamless, full-stack blog experience designed by gamers, for gamers. It offers a dedicated space for users to publish their insights, engage with fellow enthusiasts, and stay ahead of the curve with a constant stream of fresh, relevant gaming content, fostering a vibrant community around shared passions. This platform elevates the gaming content ecosystem by centralizing information and empowering community interaction.

---

## ✨ Features

### 🔐 Authentication System

- Secure JWT Authentication
- HTTP-only cookie based auth
- User Registration & Login
- Email Verification System
- Forgot Password / Reset Password
- Protected Routes
- Public Routes
- Persistent Authentication State
- Optimistic Logout Handling
- Global Auth Context API

---

### 📝 Blog System

- Create Gaming Blogs
- Edit Existing Blogs
- Delete Blogs
- Rich Text Editor (React Quill)
- Cover Image Upload
- Cloudinary Image Storage
- Slug-based Blog URLs
- Auto-generated SEO-friendly slugs
- Blog Validation with Zod
- Responsive Blog Reading Experience
- Dynamic Category Filtering
- YouTube Embed Support
- Sanitized HTML Rendering with DOMPurify

---

### ⚡ Performance Optimizations

- React Query Server State Management
- Query Caching
- Optimistic UI Updates
- Lazy Loaded Pages
- Suspense Boundaries
- Memoized Handlers
- Efficient Pagination
- Reduced Re-renders
- Reusable UI Components

---

### 🎨 UI/UX Features

- Modern Dark Gaming Theme
- Fully Responsive Layout
- Reusable Design System
- Accessible Form Inputs
- Loading States
- Error States
- Toast Notifications
- Professional Form Validation
- Image Preview Before Upload

---

## 🧱 Tech Stack

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- React Hook Form
- Zod
- TanStack React Query
- Axios
- React Quill
- React Toastify
- Lucide React
- DOMPurify

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary
- Nodemailer

---

## 📂 Project Structure

```bash
client/
├── src/
│   ├── api/
│   ├── components/
│   ├── constants/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── utils/
│   ├── validation/

server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validation/
```

---

## ⚙️ Installation
#### 1️⃣ Clone Repository
```bash
git clone https://github.com/tasmia-rafiq/gamingify-arena.git
```

#### 2️⃣ Install Frontend Dependencies
```bash
cd client
npm install
```

#### 3️⃣ Install Backend Dependencies
```bash
cd server
npm install
```

---

## ▶️ Run Application

Run the following command in both; server and client folders:
```bash
npm run dev
```

---

## 🧠 Future Improvements
- Comments System
- Likes & Reactions
- Admin Dashboard
- Blog Search
- Trending Posts
- Reading Time Estimation
- AI-assisted Blog Writing

## 👩‍💻 Author

**Tasmia Rafiq**  
Software Engineer — Full Stack MERN Developer

---