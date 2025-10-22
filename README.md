# 🎉 Tivento - Event Discovery & Community Platform

**Discover events and groups for all your passions. Join millions using Tivento to meet new people and explore your interests.**

![Tivento](https://img.shields.io/badge/Tivento-Event%20Platform-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Features

### 🎯 Core Features
- **Event Discovery**: Browse events by categories, tiers, and interests
- **Community Groups**: Create and join groups based on shared interests
- **Multi-Tier System**: Free, Silver, Gold, and Platinum membership tiers
- **Event Creation**: Comprehensive event creation with multiple details
- **Invite System**: Private invite-only events for exclusive gatherings
- **Real-time Notifications**: Stay updated with event invitations and updates

### 🎨 User Experience
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark/Light Theme**: Automatic theme adaptation
- **Progressive Web App**: Install on mobile devices
- **Fast Loading**: Optimized performance with Next.js 15

### 🔐 Authentication & Security
- **Secure Authentication**: Powered by Clerk
- **User Management**: Profile management and user preferences
- **Data Protection**: Environment variables properly secured
- **Role-based Access**: Different features based on user tiers

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Icons**: Custom SVG icons and Lucide React
- **Animations**: Framer Motion
- **State Management**: React Hooks

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Deployment & DevOps
- **Hosting**: Vercel
- **Version Control**: Git/GitHub
- **Environment**: Node.js
- **Package Manager**: npm

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

### 1. Clone the Repository
```bash
git clone https://github.com/mohammedsinan33/Tivento.git
cd Tivento/Front\ End/tivento
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Fill in your environment variables in `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Clerk Authentication Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Optional: Customize sign-in/sign-up pages
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Database Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up the required tables (refer to database schema below)
3. Configure Row Level Security (RLS) policies

### 5. Authentication Setup
1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure your authentication settings
3. Add your domain to allowed origins

### 6. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

### Core Tables
- **users**: User profiles and tier information
- **events**: Event details with categorization
- **event_registrations**: User event registrations
- **event_invitations**: Private event invitations
- **user_notifications**: In-app notifications

### Key Columns
```sql
-- Events table
events (
  UUID, title, description, category, tier, tags, group,
  max_attendees, event_date, starting_time, ending_time,
  reg_deadline, venue_name, Address, Agerestriction,
  price, currency, is_online, is_invite_only
)
```

## 🎯 User Tiers & Features

| Feature | Free | Silver | Gold | Platinum |
|---------|------|--------|------|----------|
| View Events | ✅ | ✅ | ✅ | ✅ |
| Join Events | ✅ | ✅ | ✅ | ✅ |
| Create Basic Events | ❌ | ✅ | ✅ | ✅ |
| Premium Categories | ❌ | ❌ | ✅ | ✅ |
| Invite-Only Events | ❌ | ❌ | ❌ | ✅ |
| Analytics Dashboard | ❌ | ❌ | ❌ | ✅ |

## 📱 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `.next` folder to your hosting provider
3. Configure environment variables
4. Start the server: `npm run start`

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📋 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Advanced search and filtering
- [ ] Event analytics dashboard
- [ ] Integration with calendar apps
- [ ] Social sharing features
- [ ] Event recommendations AI
- [ ] Multi-language support
- [ ] Payment integration for paid events

## 🐛 Known Issues

- Build warnings for authentication utility files (non-critical)
- Some mobile responsiveness improvements needed
- Event image upload optimization in progress

## 📞 Support

For support and questions:
- **Email**: mohammedsinan.k.33@gmail.com
- **Issues**: [GitHub Issues](https://github.com/mohammedsinan33/Tivento/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mohammedsinan33/Tivento/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Supabase** for backend infrastructure
- **Clerk** for authentication services
- **Tailwind CSS** for the utility-first CSS framework

---

**Made with ❤️ by the Tivento Team**

*Connecting people through shared interests and memorable experiences.*
