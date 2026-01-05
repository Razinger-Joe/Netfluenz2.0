# Contributing to Netfluenz

Thank you for your interest in contributing to Netfluenz! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone <your-fork-url>
   cd "Netfluenz 2.0"
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(auth): add password strength indicator
fix(campaigns): resolve date picker timezone issue
docs(readme): update installation instructions
```

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Run tests with `npm test`

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## 📁 Code Style

### TypeScript
- Use strict TypeScript
- Define explicit types for props and return values
- Use interfaces for object shapes

```typescript
// Good
interface UserProps {
  name: string;
  age: number;
}

const User: React.FC<UserProps> = ({ name, age }) => { ... };

// Avoid
const User = ({ name, age }: any) => { ... };
```

### React Components
- Use functional components with hooks
- One component per file
- Use descriptive prop names

```typescript
// Good
export const InfluencerCard: React.FC<InfluencerCardProps> = ({ ... }) => { ... };

// Avoid
export default function Card({ ... }) { ... };
```

### File Naming
- Components: PascalCase (`InfluencerCard.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.tsx`)
- Services: camelCase (`authService.ts`)
- Types: PascalCase (`User.ts`)

## 🔀 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update the README** if applicable
5. **Fill out the PR template**

### PR Title Format
```
<type>(<scope>): <description>
```

Example: `feat(messaging): add file attachment support`

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how to test the changes

## Screenshots (if applicable)
```

## 🐛 Reporting Bugs

Use the issue template and include:
- Bug description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

## 💡 Suggesting Features

Use the feature request template and include:
- Feature description
- Use case
- Proposed solution
- Alternative solutions considered

## 📚 Documentation

- Keep documentation up to date
- Use JSDoc comments for functions
- Update README for new features

```typescript
/**
 * Authenticates a user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to the authenticated user
 * @throws Error if credentials are invalid
 */
async function login(email: string, password: string): Promise<User> { ... }
```

## ✅ Code Review Checklist

Before requesting review:
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Types are properly defined
- [ ] Components have proper prop types
- [ ] Accessible (ARIA labels, keyboard navigation)

## 🎨 UI Guidelines

- Follow the orange/yellow brand theme
- Use Tailwind CSS classes
- Ensure responsive design
- Test on mobile viewports
- Maintain accessibility standards

## 📞 Questions?

Open an issue with the `question` label or reach out to the maintainers.

---

Thank you for contributing to Netfluenz! 🙏
