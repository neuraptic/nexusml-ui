# Quickstart Guide

Welcome to the NexusML Quickstart Guide! This guide is designed to help you set up and use NexusML, with clear 
instructions to ensure a smooth onboarding experience.

<!-- toc -->

- [Quickstart Guide](#quickstart-guide)
  - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Auth0 (Optional)](#auth0-optional)
  - [Installation](#installation)
  - [Auth0](#auth0)
  - [Environment variables](#environment-variables-1)
  - [License Requirements](#license-requirements)
    - [Material UI License](#material-ui-license)
    - [How to Obtain a License](#how-to-obtain-a-license)
    - [License Key Configuration](#license-key-configuration)
  - [Usage](#usage)

## Prerequisites

This guide uses [Ubuntu](https://ubuntu.com/download), but you may choose any Linux distribution that suits your 
needs. However, we can only ensure compatibility with Ubuntu or [Amazon Linux](https://aws.amazon.com/amazon-linux-2). 
Windows is also supported.

### Environment Variables

The [nexusml/env.py](../nexusml/env.py) file contains the environment variables used by NexusML.

Here is the list of required environment variables:

- `REACT_APP_NAME`: The name of the application.
- `REACT_APP_ENV`: The environment in which the app is running (e.g., development or production).
- `REACT_APP_API_URL`: The base URL for the application's API.

Here is the list of optional environment variables:

- `REACT_APP_AUTH_REDIRECT_URI`: The URL to which Auth0 redirects after authentication (callback URL).
- `REACT_APP_AUTH0_DOMAIN`: The domain of the Auth0 tenant.
- `REACT_APP_AUTH0_CLIENT_ID`: The client ID for the Auth0 application.
- `REACT_APP_AUTH0_AUDIENCE`: The audience for Auth0 API access.
- `REACT_APP_AUTH0_SCOPE`: The scopes requested for Auth0 authentication.

Note: If you are using Auth0 or AWS S3, you will need to set all the environment variables related to these services.

### Auth0 (Optional)

> ⚠️ **Warning:** While Auth0 is optional when running NexusML in single-tenant mode, it is highly recommended to 
> set up Auth0 in production environments for security reasons.

NexusML uses [Auth0](https://auth0.com/) for authentication, ensuring secure login and access management. To set up 
Auth0 for NexusML, please refer to the instructions in [auth0.md](auth0.md). After setting up Auth0, you will need to 
set the following environment variables:

```
REACT_APP_AUTH_REDIRECT_URI='Auth0 redirect/callback URL'
REACT_APP_AUTH0_DOMAIN='Auth0 tenant domain'
REACT_APP_AUTH0_CLIENT_ID='Auth0 client ID'
REACT_APP_AUTH0_AUDIENCE='Auth0 audience'
REACT_APP_AUTH0_SCOPE='Auth0 scopes'
```

## Installation

For installation, you must follow first this set of instructions:

1. Install Node.js in your local machine (https://nodejs.org/en) (last tested version Node 22.6.0)

<br/>

2. Clone the repository.

```
git clone https://github.com/neuraptic/nexusml-ui
```

<br/>

3. Install all the necessary packages by going to the root directory of the project and using the `npm install` on the command line.

```javascript
npm install
```

**IMPORTANT:**
(If the installation retrieves a breaking error, remove node_modules folder, package-lock.json and reinstall.)

<br/>

4. Once you have all set, you can start the app

```
npm start
npm start-dev
npm start-prod
```

or create a new build for the required environment6

```
npm run build
npm run build-dev
npm run build-prod
```

<br/>

## Auth0

This project uses Auth0 for authentication. Follow these steps to set up your Auth0 tenant: (visit Auth0 documentation: [Auth0 Docs](https://auth0.com/docs) and [React Auth0 Docs](https://auth0.com/docs/quickstart/spa/react/interactive))

1. Create an Auth0 Account:
   Go to Auth0 and sign up for an account.

2. Create a New Application:
   In the Auth0 dashboard, navigate to the "Applications" section and click "Create Application".
   Select "Single Page Web Applications" and give your application a name.
   Choose "React" as the technology.

3. Configure the Application:

In the "Settings" tab of your application, configure the following settings:

- Allowed Callback URLs
- Allowed Logout URLs
- Allowed Web Origins

<br/>

## Environment variables

To set up the environment variables in your project, you need to create three .env files in the root of your project: `.env.local`, `.env.development`, and `.env.production`.

```
REACT_APP_NAME='APP name'
REACT_APP_ENV='environment (development or production)'

# API CONFIG
REACT_APP_API_URL='API url'

# AUTH0 CONFIG
REACT_APP_AUTH_REDIRECT_URI='Auth0 redirect/callback URL'
REACT_APP_AUTH0_DOMAIN='Auth0 tenant domain'
REACT_APP_AUTH0_CLIENT_ID='Auth0 client ID'
REACT_APP_AUTH0_AUDIENCE='Auth0 audience'
REACT_APP_AUTH0_SCOPE='Auth0 scopes'

# MUI LICENSE
REACT_APP_MUI_LICENSE='Your material UI license'
```

Make sure not to share this file publicly, as it may contain sensitive information.

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

## Usage

> ⚠️ **Warning:** Make sure authentication is enabled in production.

> ℹ️ Multi-tenancy requires authentication to be enabled in the API.

By default, authentication is disabled to allow for easy testing. To enable authentication, you need to set up Auth0 
and update the following line in the `config.yaml` file located in the `nexusml` package directory:

```yaml
general:
  auth_enabled: true
```