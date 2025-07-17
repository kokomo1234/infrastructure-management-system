# Netlify Environment Variables Setup

To properly configure authentication for the deployed application, you need to set environment variables in Netlify:

## Required Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

### Authentication
- `REACT_APP_ADMIN_USERNAME` = `your_secure_admin_username`
- `REACT_APP_ADMIN_PASSWORD` = `your_secure_admin_password`

### API Configuration
- `REACT_APP_API_URL` = `https://infrastructure-management-system-production.up.railway.app/api`

### Build Configuration (auto-generated)
- `REACT_APP_BUILD_DATE` = (auto-generated during build)
- `REACT_APP_VERSION` = (auto-generated during build)
- `REACT_APP_BUILD_TIMESTAMP` = (auto-generated during build)

## Security Notes

- **Never commit actual credentials to the repository**
- Use strong, unique passwords for admin access
- Environment variables are only accessible during build time and runtime
- Credentials are not exposed in the client-side bundle when properly configured

## Testing Authentication

After setting up the environment variables:

1. Redeploy your Netlify site
2. Try to create/edit/delete any database record
3. The authentication modal should appear
4. Use your configured admin credentials
5. If authentication fails, check the browser console for configuration errors
