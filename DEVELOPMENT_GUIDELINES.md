# Development Guidelines

## Core Principle

**PRIORITIZE PERFORMANCE, EFFICIENCY, AND SPEED WHEN IMPLEMENTING SOLUTIONS**

---

## Performance-First Development Rules

### 🚀 **Speed & Efficiency**
- **Minimize API calls** - batch requests, use caching
- **Optimize database queries** - use indexes, limit results, avoid N+1 queries
- **Lazy load components** - only load what's needed when needed
- **Use React.memo()** for expensive components
- **Implement pagination** instead of loading all data
- **Compress and optimize assets** - images, CSS, JS bundles

### ⚡ **Frontend Performance**
- **Code splitting** - split bundles by routes/features
- **Tree shaking** - eliminate unused code
- **Minimize re-renders** - use useCallback, useMemo appropriately
- **Virtual scrolling** for large lists
- **Debounce user inputs** - search, form validation
- **Service workers** for caching and offline functionality

### 🗄️ **Backend Performance**
- **Database connection pooling** - reuse connections
- **Query optimization** - use EXPLAIN to analyze queries
- **Caching strategies** - Redis, in-memory caching
- **Async/await** over callbacks for better performance
- **Compression middleware** - gzip responses
- **Rate limiting** to prevent abuse

### 📊 **Database Performance**
- **Proper indexing** on frequently queried columns
- **Avoid SELECT \*** - only fetch needed columns
- **Use prepared statements** to prevent SQL injection and improve performance
- **Database normalization** vs denormalization based on use case
- **Connection pooling** with appropriate limits

### 🔧 **Development Efficiency**
- **Reusable components** - DRY principle
- **Generic API functions** - avoid code duplication
- **TypeScript** for better development experience and fewer runtime errors
- **ESLint + Prettier** for consistent, optimized code
- **Hot reloading** for faster development cycles

### 📈 **Monitoring & Optimization**
- **Performance monitoring** - Core Web Vitals, API response times
- **Bundle analysis** - identify large dependencies
- **Database query monitoring** - slow query logs
- **Error tracking** - catch and fix issues quickly
- **Load testing** before production deployment

### 🎯 **Implementation Priority**
1. **Measure first** - profile before optimizing
2. **Optimize bottlenecks** - focus on the slowest parts
3. **Progressive enhancement** - basic functionality first, enhancements second
4. **Mobile-first** - optimize for slower devices/connections
5. **Graceful degradation** - fallbacks for failed requests

---

## Quick Reference Checklist

### Before Every Feature:
- [ ] Will this impact performance?
- [ ] Can this be cached?
- [ ] Is this the most efficient approach?
- [ ] Can we reduce API calls?
- [ ] Will this scale with more data/users?

### Before Every Deployment:
- [ ] Bundle size analysis
- [ ] Performance audit (Lighthouse)
- [ ] Database query optimization
- [ ] Error handling implemented
- [ ] Loading states for better UX

---

**Remember: Fast applications provide better user experience and reduce infrastructure costs.**
