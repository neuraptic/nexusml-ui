# Quickstart Guide

Welcome to the NexusML UI Quickstart Guide! This guide is designed to help you set up and use NexusML UI, with clear 
instructions to ensure a smooth onboarding experience.

<!-- toc -->

- [Quickstart Guide](#quickstart-guide)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
    - [Auth0 (Optional)](#auth0-optional)
  - [License Requirements](#license-requirements)
    - [Material UI License](#material-ui-license)
    - [How to Obtain a License](#how-to-obtain-a-license)
    - [License Key Configuration](#license-key-configuration)

## Environment Variables

Here is the list of required environment variables:

> ⚠️ **Warning:** There are three environments set up (```.env.local```, ```.env.dev```, and ```.env.prod```) to ensure smooth deployment and proper configuration across different stages of development. Remember to update the package.json scripts to match your ```.env``` configuration.

```
REACT_APP_NAME='APP name'
REACT_APP_ENV='environment (development or production)'
REACT_APP_API_URL='API url'

# OPTIONAL ENVIRONMENT VARIABLES
## AUTH0 CONFIG
REACT_APP_AUTH_REDIRECT_URI='Auth0 redirect/callback URL'
REACT_APP_AUTH0_DOMAIN='Auth0 tenant domain'
REACT_APP_AUTH0_CLIENT_ID='Auth0 client ID'
REACT_APP_AUTH0_AUDIENCE='Auth0 audience'
REACT_APP_AUTH0_SCOPE='Auth0 scopes'

## MUI LICENSE
REACT_APP_MUI_LICENSE='Your Material UI license'
```

<br/>

## Installation

For installation, you must follow first this set of instructions:

1. Install [Node.js](https://nodejs.org/en) in your local machine (last tested version Node 22.6.0)

2. Clone the repository.

```
git clone https://github.com/neuraptic/nexusml-ui
```

3. Install all the necessary packages by going to the root directory of the project and using the `npm install` on the command line.

> **IMPORTANT:**
If the installation retrieves a breaking error, remove node_modules folder, package-lock.json and reinstall.

```javascript
npm install
```

> ⚠️ **Warning:** Remember to update the scripts to match your environment configuration.
> 
- Once you have all set, you can start the app:

> 
```
npm start
npm start-dev
npm start-prod
```

- or create a new build for the required environment:

```
npm run build
npm run build-dev
npm run build-prod
```

<br/>

### Auth0 (Optional)

> ⚠️ **Warning:** While Auth0 is optional when running NexusML UI in single-tenant mode, it is highly recommended to 
> set up Auth0 in production environments for security reasons.

NexusML UI uses Auth0 for authentication, ensuring secure login and access management. To set up Auth0, please refer to the instructions in [auth0.md](docs/auth0.md).

After setting up Auth0, you will need to set the environment variables:

```
REACT_APP_AUTH_REDIRECT_URI='Auth0 redirect/callback URL'
REACT_APP_AUTH0_DOMAIN='Auth0 tenant domain'
REACT_APP_AUTH0_CLIENT_ID='Auth0 client ID'
REACT_APP_AUTH0_AUDIENCE='Auth0 audience'
REACT_APP_AUTH0_SCOPE='Auth0 scopes'
```

<br/>

## License Requirements

### Material UI License

This application utilizes Material UI, which requires a valid license (Pro Plan) for certain features and usage.

**Please note:**

- **Material UI License**: You must obtain a valid Material UI license to use this application. You can get more information about licensing [here](https://mui.com/store/items/mui-x-pro/).
- **Commercial Use**: If you plan to use Material UI for commercial purposes or access premium features, ensure that your license covers these use cases.

### How to Obtain a License

1. Visit the [Material UI Licensing Page](https://mui.com/store/items/mui-x-pro/).
2. Follow the instructions on the licensing page to purchase and activate your license.

### License Key Configuration

Once you have your license key, configure it by adding it to your project’s environment variables.

```
# MUI LICENSE
REACT_APP_MUI_LICENSE='Your material UI license'
```

For further assistance, please refer to the [Material UI documentation](https://mui.com/getting-started/installation/).