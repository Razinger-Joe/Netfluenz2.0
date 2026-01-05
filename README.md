# Netfluenz 2.0

Kenya's leading influencer marketing platform connecting brands with content creators.

![Netfluenz Platform](https://api.dicebear.com/7.x/shapes/svg?seed=netfluenz)

## 🚀 Features

### For Brands
- **Discover Influencers** - Browse 22+ verified Kenyan creators across 10 niches
- **Campaign Management** - Create, track, and manage influencer campaigns
- **Analytics Dashboard** - Real-time ROI tracking and performance metrics
- **Secure Payments** - M-Pesa, card, and bank transfer support

### For Influencers
- **Profile Showcase** - Highlight your content and stats
- **Campaign Applications** - Apply to relevant brand campaigns
- **Earnings Tracking** - Monitor earnings and payment history
- **Real-time Messaging** - Communicate directly with brands

### Admin Panel
- **Platform Analytics** - Comprehensive metrics and reporting
- **User Management** - View and manage all platform users
- **Campaign Moderation** - Approve/reject campaigns

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: TanStack Query, React Context
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **UI Components**: Radix UI primitives
- **Testing**: Vitest, React Testing Library

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd "Netfluenz 2.0"

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Influencer | influencer@netfluenz.com | demo123 |
| Brand | brand@netfluenz.com | demo123 |
| Admin | admin@netfluenz.com | admin123 |

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin panel components
│   ├── auth/           # Authentication forms
│   ├── campaign/       # Campaign-related components
│   ├── charts/         # Recharts visualizations
│   ├── common/         # Shared/utility components
│   ├── dashboard/      # Dashboard components
│   ├── filters/        # Search filters
│   ├── influencer/     # Influencer cards
│   ├── messages/       # Messaging UI
│   ├── notifications/  # Notification system
│   ├── profile/        # Profile components
│   ├── search/         # Search functionality
│   └── stats/          # Statistics cards
├── contexts/           # React Context providers
├── data/               # Mock data
├── hooks/              # Custom React hooks
├── lib/                # Utilities
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   └── Auth/           # Authentication pages
├── services/           # API services (mock)
├── test/               # Test utilities
└── types/              # TypeScript types
```

## 🎨 Component Documentation

### Core Components

#### `InfluencerCard`
Displays influencer profile with stats, niches, and rating.

```tsx
<InfluencerCard 
  influencer={influencer} 
  onClick={() => console.log('View profile')} 
/>
```

#### `CampaignCard`
Shows campaign details with status, budget progress, and requirements.

```tsx
<CampaignCard 
  campaign={campaign} 
  variant="default" // or "compact"
/>
```

#### `StatCard`
Reusable statistics display with trend indicators.

```tsx
<StatCard
  title="Total Earnings"
  value="KES 328,000"
  change={12.5}
  changeLabel="vs last month"
  icon={DollarSign}
/>
```

### Hooks

#### `useAuth`
Access authentication state and methods.

```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

#### `useInfluencerSearch`
Filter and sort influencer listings.

```tsx
const { influencers, filters, setFilters, resetFilters } = useInfluencerSearch();
```

#### `useMessages`
Manage messaging conversations.

```tsx
const { conversations, messages, sendMessage } = useMessages();
```

## 📡 API Documentation (Mock)

### Authentication

```typescript
// Login
authService.login({ email, password }): Promise<User>

// Signup
authService.signup({ email, password, name, role }): Promise<User>

// Logout
authService.logout(): Promise<void>
```

### Campaigns

```typescript
// Get all campaigns
campaignService.getAll(): Promise<Campaign[]>

// Get campaign by ID
campaignService.getById(id): Promise<Campaign>

// Create campaign
campaignService.create(data, brandId, brandName): Promise<Campaign>
```

### Payments

```typescript
// Initiate M-Pesa payment
paymentService.initiateMpesaPayment(request, userId): Promise<Payment>

// Subscribe to plan
paymentService.subscribeToPlan(userId, planId): Promise<Subscription>
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Files
- `src/components/auth/LoginForm.test.tsx` - Login form validation
- `src/components/auth/SignupForm.test.tsx` - Signup form validation
- `src/services/auth.test.ts` - Authentication service

## 🎯 Roadmap

- [x] Authentication system
- [x] Influencer marketplace
- [x] Campaign management
- [x] Role-based dashboards
- [x] Real-time messaging
- [x] Notification system
- [x] Admin panel
- [x] Pricing & subscriptions
- [ ] M-Pesa live integration
- [ ] Email notifications
- [ ] Mobile app (React Native)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see LICENSE for details.

---

Built with ❤️ in Kenya 🇰🇪
