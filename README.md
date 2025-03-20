# Infosec Compliance Chat

## Deployment Configuration

This project is configured for deployment on Netlify. The build process automatically generates the Firebase configuration from environment variables.

### Required Environment Variables

Set the following environment variables in your Netlify dashboard (Site settings > Environment variables):

- `apiKey`: Firebase API Key
- `authDomain`: Firebase Auth Domain
- `projectId`: Firebase Project ID
- `storageBucket`: Firebase Storage Bucket
- `messagingSenderId`: Firebase Messaging Sender ID
- `appId`: Firebase App ID

### Deployment Process

1. Push changes to your repository
2. Netlify will automatically:
   - Run the build script (`npm run build`)
   - Generate the Firebase configuration from environment variables
   - Deploy the site

### Troubleshooting

If deployment fails, check the build logs for missing environment variables or other errors. 