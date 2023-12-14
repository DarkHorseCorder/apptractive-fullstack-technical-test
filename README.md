# Apptractive Fullstack Technical Test

## Background
This technical test assesses your full-stack application development skills using existing code similar to the project you'll be working on and includes tasks that simulate real project work.

Most applications connect to 3rd party APIs, which generally involve authentication by oauth2.0, retrieving some data via their API, then displaying it to the user. 

In this test you will be authenticating Xero using oauth 2, then call the Xero API (https://developer.xero.com) to retrieve the user's invoices and display them in the web application.

If you have not worked with oAuth before, it is recommended to read up on it before starting the test (sample video explaining oauth2 https://www.youtube.com/watch?v=ZV5yTm4pT8g). If it's your first time, at least by completing this test you will take away something important in your future coding career :)

## Project structure
- Project - NX monorepo (https://nx.dev - allows running lint, tests, build, etc. e.g. `npx nx lint backend`) 
- Frontend - React Typescript (https://nx.dev/nx-api/react)
- Backend Tooling - AWS CDK (Typescript) (https://github.com/adrian-goe/nx-aws-cdk-v2/blob/main/packages/aws-cdk-v2/README.md)
- Database - DynamoDB
- Functions - Lambda
- API - Appsync GraphQL (Apollo used in Frontend)
- 3rd Party API - Xero - Accounting software

## Prerequisites
There are some accounts you will need to set up before you can do the technical test.

If you have any issues or concerns with the below, please let us know.

### Amazon Web Services
You will need to use an existing Amazon Web Services account or create a new one to complete this test. (https://console.aws.amazon.com)
- If you are creating a new account, you will need to provide payment information to complete the test however you can delete the account after the interview is complete
- If you have an existing account, you can destroy the stack once complete (e.g. calling `cdk destory--profile enterprofilename` in the backend folder)
- There shouldn't be costs associated with this test, however make sure to destroy once the interview is complete
- The user stories will also guide you from this point

### Xero
Full instructions here: https://developer.xero.com/documentation/getting-started-guide/
1. Create a developer Xero account to complete this test, which will give you access to Xero APIs (https://www.xero.com/au/signup/developers)
2. Once you create and verify the developer account, it will prompt you to create an organisation and start a free trial (no payment information required)
3. A demo company will also be created for you to use in the test (Demo Company)
4. The user stories will also guide you from this point

### Github
Create a repo in Github and push this code before you begin. Use github workflows you are used to when completing this test. (e.g. feature branches, pull requests, etc)

## Run app

### Install dependencies
`yarn install && cd backend/src/layers/dependencyLayer/nodejs && yarn install`

### Serve react app
`npx nx serve react-app`

### Scripts
Review `package.json` for all scripts.

| Command             | Description                                                                                                                                        |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `yarn run codegen ` | Generates the latest graphql schema and typescript types. Run after deploying GraphQL schema updates                                               |
| `yarn run output`   | Copies output file to the react-app (providing it was generated during cdk deploy with flag. (e.g.  ` npx cdk deploy --outputs-file output.json `) |
| `yarn run esbuild`  | Used by AWS CDK to transpile typescript to javascript, shouldn't be necessary to run manually                                                      |

### Environment
For your information, the project was set up with:
- yarn 3.6.4
- node v18.16.1

## What we test
1. That you are able to set up your dev environment, of course if you run intro troubles and can't get it working, please let us know. This happens in a real project too
2. The code meets the requirements based on the user stories
3. Coding best practices (e.g. comments, security, code structure, git workflow, etc)
4. Demo of stories, code review together and discussion about your approach

## Stories
Once the stories are complete, let us know and we will review together. Create a pull request or whatever workflow you would follow prior to a code review. 

### TEST001 - Set up Xero App
**As a** developer

**I want** to be able to set up a Xero app

**So that** I can connect to Xero

#### Acceptance Criteria
1. When logged in to Xero, Set app name as 'Fullstack Test' at https://developer.xero.com/app/manage/
2. Select integration type as "Web app"
3. Enter application url as https://localhost:4200
4. Enter the redirect URI as https://localhost:4200/xero-redirect (it will be used in oauth2 to exchange code for access token) 
5. Once app is created, generate the client ID and Client Secret for application access

### TEST002 - Connect to Xero API
**As a** developer

**I want** to be able to connect to Xero API

**So that** I can access the Xero API

#### Acceptance Criteria
1. Insert the generated Xero client ID and Client Secret into the project to allow connecting to the Xero API (search `xeroClientId` and `xeroClientSecret` in the project)
2. Ensure client Secret is not exposed in the code

### TEST003 - Set up AWS CDK
**As a** developer

**I want** to be able to set up AWS CDK

**So that** I can deploy the backend to the correct AWS account

#### Acceptance Criteria
1. Authenticate to your AWS account
2. Set up AWS CDK using `npm install -g aws-cdk` or `yarn global add aws-cdk` if not already installed
3. If you have never used CDK in your AWS account, you will need to bootstrap it first `npx nx bootstrap backend --profile enterprofilename`
4. First deploy the lambda layer stack using `npx nx deploy backend FULLayerStack --profile enterprofilename`
5. Deploy all stacks in the backend using `npx nx deploy backend --all --require-approval=never --outputs-file output.json --profile enterprofilename`
6. Copy output file to react-app application by running `yarn run output` 

#### Developer notes
- Quick and Easy way to authenticate to your AWS account is to generate secret and access keys. https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html `aws configure --profile enterprofilename`), otherwise more ways here https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html

### TEST004 - Authenticated user - Connect Xero button
**As an** user

**I want** to be able to connect to Xero

**So that** I can be authenticated via Xero oAuth 2 to access my data

#### Acceptance Criteria
1. Once a user signs in, they should see the dashboard
2. On the dashboard there is a button "Connect Xero"
3. Clicking "Connect Xero" should open a new window to Xero oAuth 2.0
4. Once the user connects to Xero, they should be redirected back to the application (`/xero-redirect` route)

#### Developer notes
- All this functionality should already be completed without any development from your end, unless your environment / xero is not set up correctly

### TEST005 - Xero oauth2 - Exchange authorisation code for token set
**As a** user

**I want** the application to exchange the Xero authorisation code for a token set

**So that** I can make authenticated requests to access my Xero data

#### Acceptance Criteria
1. Backend uses the redirect URL to exchange the authorisation code for a token set
2. The token set is stored for my user in the database for subsequent Xero API requests
3. Once successfully authenticated, in the web application the user should see a message that says "Xero Connected"
4. Once successfully authenticated, in the web application the user should see a button "Go To Dashboard"
5. Clicking "Go to Dashboard", user should navigate to the dashboard page

#### Developer notes
- The lambda function you will work on is `/backend/src/functions/xeroCreateTokenSet/index.ts`
- The React component to work on is `react-app/src/app/pages/XeroRedirect/XeroRedirect.tsx`
- A user record is created for each sign up in the DynamoDB database, you can update this record using the sub to store the token set 
- Read more here to understand the Xero oAuth workflow and integration:
  - https://developer.xero.com/documentation/guides/oauth2/auth-flow
  - https://github.com/XeroAPI/xero-node
  - https://github.com/XeroAPI/xero-node-oauth2-react-app

### TEST006 - Xero API Invoices
**As a** user

**I want** to be able to view my invoices

**So that** I can see all my invoices that appear in Xero

#### Acceptance criteria
1. Retrieve the token set from the user's profile to call the Xero API 
2. If the token set is expired, the backend should refresh the token set before calling the Xero API
3. In the web application, the user should see a list of their invoices:
   - For each invoice, it should show the invoice number, status, amount paid, Tax total and total 
4. User should be able to toggle between paginated results
5. User should be able to filter invoices by status

#### Developer notes
- You will need to use AWS CDK to complete this task (previously done for you):
  - Update the GraphQL schema (at `backend/src/appsync/schema.graphql`)
  - Create a lambda function to retrieve the invoices (in the directory `backend/src/functions`)
  - Create a mutation that will trigger a lambda function (at `backend/src/stacks/AppSyncAPIStack.ts`)
  - Use the sub to retrieve the user's database record, which should have the stored token set
- For the UI:
  - Complete the UI in the component `react-app/src/app/pages/XeroTransactions/XeroTransactions.tsx`
  - Take note of the UI library the application uses, you may be able to use a UI component that will display the data nice, manage the columns and rows, whilst handling pagination
