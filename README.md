# **Tasker – Project & Sprint Management App**

Tasker is a modern, full-stack project management application built with **Next.js App Router**, offering organization management, project boards, sprint planning, issue tracking, and authentication.
The app provides a clean UI using **Tailwind CSS** and **shadcn/ui**, with a modular structure for scalability.

---

## 🚀 **Features**

### **🔐 Authentication**

* Sign in / sign up flows (App Router + Auth routes under `/app/(auth)/`)
* Protected routes for main application pages
* Onboarding screen for new users

### **🏢 Organization Management**

* Create and manage organizations
* Organization dashboard
* View user issues grouped by project
* Delete projects inside an organization

### **📁 Project Workspace**

* Create new projects (`/project/create`)
* Project dashboard with layout segmentation
* Board filters & search
* Sprint manager and sprint board
* Create issues within a project
* Create sprints for agile workflow

### **📦 Components Structure**

* Well-structured project-level components under:

  ```
  app/(main)/project/_components/
  app/(main)/organization/[orgId]/_components/
  ```

### **🎨 UI & Styling**

* Tailwind CSS
* Custom fonts (Geist)
* Reusable shadcn/ui components

### **⚙️ Middleware**

* Authentication and route protection logic inside `middleware.js`

---

## 🧱 **Tech Stack**

| Area               | Technologies                                |
| ------------------ | ------------------------------------------- |
| Frontend           | Next.js (App Router), React                 |
| UI                 | Tailwind CSS, shadcn/ui, Lucide Icons       |
| State & Logic      | React hooks, custom validators              |
| Auth               | Middleware-based auth flow                  |
| Forms & Validation | Zod-like validation utilities               |
| Build Tools        | PostCSS, Next config, jsconfig path aliases |

---

## 📁 **Project Structure**

```
app/
 ├── (auth)/
 │    ├── sign-in/
 │    └── sign-up/
 ├── (main)/
 │    ├── onboarding/
 │    ├── organization/[orgId]/
 │    └── project/
 ├── fonts/
 ├── globals.css
 ├── layout.js
 └── page.js
components.json
middleware.js
tailwind.config.js
package.json
```

---

## 🛠️ **Getting Started**

### **1. Install Dependencies**

```bash
npm install
```

### **2. Set Environment Variables**

Create a `.env` file (example based on your project structure):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

DATABASE_URL=
```

*(Add any other required env vars depending on your backend/auth setup.)*

### **3. Run Development Server**

```bash
npm run dev
```

App will be available at **[http://localhost:3000](http://localhost:3000)**

---

## 📸 Screenshot
| Finance Tracker Interface |
|----------------------|
| Landing Page |
| <img width="1878" height="921" alt="image" src="https://github.com/user-attachments/assets/a2bb8937-35b3-4420-b900-fb40568d842d" />|
| Organization Page |
| <img width="1878" height="921" alt="image" src="https://github.com/user-attachments/assets/c7f621de-f4c3-45ac-b25f-f6f04d57f3b2" />|
| My Issues section of Organization Page |
| <img width="1878" height="921" alt="image" src="https://github.com/user-attachments/assets/3fdcf6f0-c197-485a-8e0f-c2e0c9efccd8" />|
| Create Projects |
| <img width="1878" height="921" alt="image" src="https://github.com/user-attachments/assets/9e146a71-4189-4699-89e5-7d04df0303ac" />|
| Projects Page with Sprint and Issue creation and Kanban Board |
| <img width="1878" height="921" alt="image" src="https://github.com/user-attachments/assets/1948c193-f408-418a-922d-b0793b60dd55" />|
| Issue Creation Drawer |
| <img width="1878" height="921" alt="image" src="https://github.com/user-attachments/assets/f7b4d9ea-5040-4d92-9bd2-ae19c0a14bb3" />|
| Organization Invitation System |
| <img width="1878" height="921" alt="image" src="https://github.com/user-attachments/assets/0e489e4f-a565-442d-8264-af4e8c882bc7" />|
| <img width="1570" height="719" alt="image" src="https://github.com/user-attachments/assets/3188ad49-89b1-4e9b-bf9c-827937e26cd5" />|

---

## 🏗️ **Build for Production**

```bash
npm run build
npm start
```

---

## 📌 **Scripts**

| Command         | Description            |
| --------------- | ---------------------- |
| `npm run dev`   | Run development server |
| `npm run build` | Build application      |
| `npm start`     | Run production build   |

---

## 👨‍💻 Author

**Mehedi Hasan Shahed**

* **Email:** [mehedihasanshahed3@gmail.com](mailto:mehedihasanshahed3@gmail.com)

* **LinkedIn:** [Mehedi Hasan Shahed](https://www.linkedin.com/in/mehedi-hasan-153404287/)

💼 Software Developer | Web Engineer
