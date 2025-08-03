# Contributing to Tivento

Thank you for your interest in contributing to Tivento! We welcome contributions from the community and are pleased to have you join us.

## 🤝 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker to report bugs
- Include a clear description of the problem
- Provide steps to reproduce the issue
- Include screenshots if applicable

### Suggesting Features
- Open a GitHub issue with the "feature request" label
- Describe the feature and its benefits
- Provide mockups or examples if possible

### Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature
4. Make your changes
5. Test your changes
6. Submit a pull request

#### Development Setup
```bash
# Clone your fork
git clone https://github.com/your-username/Tivento.git
cd Tivento/Front\ End/tivento

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

#### Code Standards
- Use TypeScript for all new code
- Follow the existing code style
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic

#### Pull Request Process
1. Update the README.md if needed
2. Make sure all tests pass
3. Request review from maintainers
4. Address any feedback
5. Once approved, your PR will be merged

## 📋 Development Guidelines

### File Structure
```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable components
├── lib/             # Utility functions
└── pages/           # Legacy pages (being migrated)
```

### Component Guidelines
- Use functional components with hooks
- Export components as default
- Use TypeScript interfaces for props
- Keep components focused and reusable

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add user registration
fix(events): resolve date validation issue
docs(readme): update installation guide
```

## 🐛 Issues and Support

- Check existing issues before creating new ones
- Use issue templates when available
- Be respectful and constructive in discussions

## 📄 License

By contributing to Tivento, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in the project documentation and release notes.

Thank you for contributing to Tivento! 🎉
