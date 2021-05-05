## Welcome to the development documentation of the Brentlab RNAseq metadata front end  

This documentation is intended for developers. Code documentation is to the sidebar to the left. Sripts available in the project directory
are described below.

## Contribution workflow
1. fork the repository into your own github account
2. clone the fork onto your local
3. __CRITICAL__: add a file called called `/src/config.json`. It must be in /src and it must be called `config.json`. It must include at least the key value pairs included below (obviously with correct values for your use case). Here is an example (__repeat__: the keys below are minimally required for the site to function): 

```
{
    "PUBLIC_TABLES_URL": "http://3.21.241.229/metadata_tables/",
    "DATABASE_API_ROOT": "http://3.21.241.229/api/v1/",
    "SERVER_ROOT": "http://3.21.241.229/",
    "MAX_NEW_SAMPLES": 100,
    "FIRST_TABLE": "BioSample",
    "CREDENTIALS_ERROR_MSG": "You have not signed in. Sign in using your issued credentials, or email chasem@wustl.edu for new credentials"
}
```
4. Run either `npm run build_dev` (the name does need to be changed -- it installs, it does not build) or simply run `npm install`. However, note the NOTE in big and bold below. There is an open issue as of 20210505 with a create-react-app dependency that conflicts with new versions of `npm`. To "fix" it currently, run `npm update --legacy-peer-deps` after `npm install`. Keep an eye on the issue though -- this should be resolved at some point.

5. Look through the documentation, and the code. Choose an `@todo` to work on. Register the issue on the __brentlab__ github repo (not your fork). Please look through the `@todo` first, but if your issue isn't already noted in the `@todo`, just register a new issue on n the __brentlab__ github repo. 

6. Create a branch (in your local repo), name it something descriptive related to the issue report, and knock out that `@todo`/issue. Commit frequently. However, when you're feature is done, squish down your commits so that the log isn't littered, rebase your branch, and merge with your master branch. [See this for help](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase) or ask chasem@wustl.edu. Make sure your master branch on github is up to date with your local (including these git log revisions/etc), and issue a pull request to the __brentlab__ github repo.

# NOTE! There is an open issue with a react dependency. You'll need to troubleshoot this on your own until facebook fixes it  


When you run `npm run start` or `npm run build`, you'll run into a problem with the chokadir dependency.  See this issue:  
https://github.com/facebook/create-react-app/issues/10811

There are three npm audits. I'm not concerned about those -- they have to do with some security vulnerabilities that don't apply to this project.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

I have used nginx to serve this site from AWS. Instructions can be found {@tutorial deployment}

The suggestion from react/node is to deploy following the instructions [here](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run build_dev`

executes `npm install`, which should install all dependencies, including the dev dependencies
   -- please note: there is a versioning conflict with better-docs and react v17. If the issue arises, then `--force` the install

### `npm run eject`  
**Note: this is a one-way operation. Once you `eject`, you can’t go back!**  
If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm run docs`  
Generate the documentation  

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
