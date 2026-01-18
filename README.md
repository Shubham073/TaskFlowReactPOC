# TaskFlow - Smart Task Management Application

A comprehensive React TypeScript application demonstrating modern React development practices with Material UI 6, featuring authentication, task management, role-based access control, and responsive design.

## 🚀 Features

### Core Functionality
- **User Authentication** - JWT-based login/logout with role management
- **Task Management** - Create, update, delete, and mark tasks as completed
- **Dashboard Analytics** - Visual task statistics and progress tracking
- **Role-Based Access** - Admin and User roles with different permissions
- **Responsive Design** - Mobile-first design with Material UI components

### Technical Features
- **Modern React** - React 18 with TypeScript and hooks
- **State Management** - Context API with useReducer for global state
- **Routing** - React Router with protected routes and lazy loading
- **Theme Support** - Dark/Light mode switching with custom themes
- **Performance** - Code splitting, memoization, and optimized rendering
- **Error Handling** - Error boundaries and graceful fallbacks
- **Animations** - Framer Motion for smooth UI transitions

## 🎨 Design System

### Color Palette
- **Primary (Brightly Orange)**: `#ff1e00` - For primary actions and branding
- **Secondary (Dimly Blue)**: `#e8f9fd` - For secondary elements
- **Success/Highlight Green**: `#59ce8f` - For success states and highlights

### UI Philosophy
- Rounded edges and subtle shadows for modern appearance
- Material Design principles with custom theming
- Responsive breakpoints for all device sizes
- Consistent spacing and typography

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   ├── TaskContext.tsx
│   └── ThemeContext.tsx
├── hooks/              # Custom hooks
│   └── index.ts
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   ├── ProfilePage.tsx
│   └── TasksPage.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── theme.ts
├── App.tsx
└── index.tsx
```

### Key Patterns
- **Context + Reducer** for state management
- **Custom hooks** for shared logic
- **Error boundaries** for error handling
- **Protected routes** for authentication
- **Lazy loading** for performance

## 🛠️ Technologies

- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Material UI 6** - Component library and theming
- **React Router 6** - Client-side routing
- **Framer Motion** - Animation library
- **Recharts** - Chart visualization
- **Axios** - HTTP client (with mock fallback)

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd TaskFlow

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_USE_REAL_API=false
```

## 🎯 Usage

### Demo Credentials
The application includes mock authentication for demonstration:

- **Admin User**: `admin / admin123`
- **Regular User**: `user / user123`

### Features by Role

#### Admin Users
- Create, edit, and delete any task
- View all tasks in the system
- Access to dashboard analytics
- Full task management capabilities

#### Regular Users
- Create new tasks
- Edit and complete their own assigned tasks
- View tasks assigned to them
- Access to personal dashboard

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Configuration
- **TypeScript**: Strict mode enabled with proper type checking
- **ESLint**: Code quality and consistency rules
- **Material UI**: Custom theme with brand colors
- **React Scripts**: Create React App configuration

### Adding New Features
1. Define types in `src/types/index.ts`
2. Create components in appropriate directories
3. Add context/hooks for state management
4. Implement API services with mock fallbacks
5. Add routing and navigation as needed

## 🧪 Testing Strategy
The project is structured to support testing with:
- **Unit Tests**: For individual components and hooks
- **Integration Tests**: For component interactions
- **E2E Tests**: For complete user workflows

## 📱 Responsive Design
The application is fully responsive with:
- Mobile-first approach
- Tablet and desktop optimizations  
- Touch-friendly interfaces
- Accessible navigation patterns

## 🔐 Security Features
- JWT token-based authentication
- Role-based access control
- Protected route components
- Secure state management

## 🚀 Performance Optimizations
- Code splitting with lazy loading
- Memoized components and callbacks
- Optimized re-renders
- Efficient state updates
- Image and asset optimization

## 📈 Future Enhancements
- Real-time task updates with WebSocket
- File attachment support
- Task comments and collaboration
- Email notifications
- Advanced filtering and search
- Task templates and automation

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🎓 Learning Objectives
This project demonstrates:
- Modern React development patterns
- TypeScript best practices
- Material UI customization
- State management with Context API
- Authentication and routing
- Responsive design principles
- Performance optimization techniques
- Error handling strategies

Perfect for developers looking to understand enterprise-level React applications and modern frontend development practices.