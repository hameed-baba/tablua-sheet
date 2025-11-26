# School Management System - Vue.js

A modern school management system built with Vue.js 3 Composition API, Vue Router, and Pinia for state management.

## Features

- **Dashboard**: Overview of school statistics and recent activities
- **Students Management**: Add, edit, and manage student records
- **Staff Management**: Manage teaching and administrative staff
- **Parents Management**: Handle parent and guardian information
- **Classes Management**: Organize school classes and sections
- **Subjects Management**: Manage academic subjects and curriculum
- **Attendance Management**: Track and manage student attendance
- **Grades Management**: Handle student grades and academic performance

## Tech Stack

- **Vue.js 3** with Composition API
- **Vue Router 4** for navigation
- **Pinia** for state management
- **Vite** for build tooling
- **Modern CSS** with responsive design

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Layout.vue      # Main layout wrapper
│       ├── Sidebar.vue     # Navigation sidebar
│       ├── Navbar.vue      # Top navigation bar
│       └── Footer.vue      # Footer component
├── views/
│   ├── Dashboard.vue       # Dashboard page
│   ├── Students.vue        # Students management
│   ├── Staff.vue          # Staff management
│   ├── Parents.vue        # Parents management
│   ├── Classes.vue        # Classes management
│   ├── Subjects.vue       # Subjects management
│   ├── Attendance.vue     # Attendance tracking
│   └── Grades.vue         # Grades management
├── store/
│   ├── configStore.js     # App configuration store
│   └── sidebarStore.js    # Sidebar state store
├── router/
│   └── index.js           # Vue Router configuration
├── style.css              # Global styles
├── App.vue                # Root component
└── main.js                # App entry point
```

## Router Configuration

The router follows the specified format with nested routes:

```javascript
{
  path: "/dashboard",
  component: Layout,
  children: [
    {
      path: "",
      name: "dashboard",
      component: () => import("../views/Dashboard.vue"),
      meta: {
        requiresAuth: true,
        title: "Dashboard",
        description: "View an overview of key statistics, reports, and recent activities in the school system.",
      },
    },
    // ... other routes
  ],
}
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Key Features

### Layout Components
- **Layout.vue**: Main wrapper with sidebar, navbar, content area, and footer
- **Sidebar.vue**: Collapsible navigation with menu items and user actions
- **Navbar.vue**: Top header with page title and user profile
- **Footer.vue**: Simple footer with links

### State Management
- **configStore**: Manages app configuration (school name, user info, etc.)
- **sidebarStore**: Handles sidebar open/close state

### Responsive Design
- Mobile-friendly with collapsible sidebar
- Responsive grid layouts for stats and tables
- Touch-friendly interface elements

### Modern UI Features
- Glass morphism design with backdrop blur effects
- Smooth animations and transitions
- Interactive hover states
- Modal dialogs for forms
- Status badges and action buttons

## Development Notes

- Uses Vue 3 Composition API throughout
- Pinia stores for reactive state management
- Vue Router for client-side navigation
- Modular component architecture
- CSS Grid and Flexbox for layouts
- Mobile-first responsive design

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License