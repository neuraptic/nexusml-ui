<p align="center">
  <img src="src/assets/LOGO_WITH_NAME.svg" style="width: 50%" alt=""/>
</p>

---

# NexusML-UI

This is the official repository for the NexusML-UI. You can find the production version of the app
[here](https://app.nexusml.ai).

## :hammer_and_wrench: Installation

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

## :lock: Auth0

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

## :gear: Environment variables

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

## :bookmark_tabs: License Requirements

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

<br/>

## :book: Documentation

The official documentation of the NexusML-UI will be available in this repo.

:warning: Work in progress.

<br/>

## :sparkles: Contribute

All the guidelines are available at the [contributing](CONTRIBUTING.md) file, so make sure that your code and
documentation follow all the instructions there before completing any contribution.

:warning: Work in progress.

<br/>

## :bug: Issues and requests

All the issues and feature requests must be created at the [issue](https://github.com/neuraptic/nexusml-ui/issues)
section of the official NexusML-UI repository, and all the following discussions will be handled there.
