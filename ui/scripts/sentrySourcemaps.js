//script for uploading sourcemaps to sentry with version, project, org and dist folder settings
const fs = require('fs');
const ini = require('ini');
const execSync = require('child_process').execSync;

const packageJson = require('../package.json');
const sentryConfig = ini.parse(fs.readFileSync('.sentryclirc', 'utf8'));

const version = packageJson.version;
const org = sentryConfig.defaults.org;
const project = sentryConfig.defaults.project;
const distPath = process.argv[2];

const releaseCommand = `sentry-cli releases new ${version} --org ${org} --project ${project}`;
const uploadCommand = `sentry-cli releases files ${version} upload-sourcemaps ${distPath} --rewrite --org ${org} --project ${project}`;

execSync(releaseCommand, { stdio: 'inherit' });
execSync(uploadCommand, { stdio: 'inherit' });
