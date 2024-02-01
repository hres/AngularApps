const { execSync } = require('child_process');
const pkg = require('../../../package.json')

const template = process.env.npm_config_template;
const language = process.env.npm_config_language;

console.log(`\n*** START post build process for '${template}' for language: ${language}`);

if (!pkg.scripts.postBuildSubEnvDependency || !pkg.scripts.postBuildSubUpdateDist) {
    console.error(`!!! cannot find the requeired scripts in package.json`)
    return process.exit(0)
}

// Run env.dependency.js and capture its output
console.log('\n--- postBuildSubEnvDependency starts');
const subtask1Output = execSync(`npm run postBuildSubEnvDependency -- --template=${template} --language=${language} `, { encoding: 'utf-8' });
console.log(subtask1Output);
console.log('--- postBuildSubEnvDependency ends');

const lines = subtask1Output.trim().split('\n');
// console.log(lines);
const dateIssued = lines[lines.length - 2];
const serverBaseUrl = lines[lines.length - 1];

if (isValidDateFormat(dateIssued) && startsWithHttp(serverBaseUrl)) {
    // Continue with update.dist.js if dateIssued and serverBaseUrl are retreived
    console.log('\n--- postBuildSubUpdateDist starts');
    const subtask2Output = execSync(`npm run postBuildSubUpdateDist -- --template=${template}  --language=${language} --serverBaseUrl=${serverBaseUrl} --dateIssued=${dateIssued} `, { encoding: 'utf-8' });
    console.log(subtask2Output);
    console.log('--- postBuildSubUpdateDist ends');
} else {
    console.error(`\ncouldn't retrieve dateIssued: ${dateIssued} and serverBaseUrl: ${serverBaseUrl} from environment config files`);
}

console.log(`\n*** COMPLETED post build process for '${template}' for language: ${language}`);
return process.exit(0);

function isValidDateFormat(dateString) {
    if (!dateString)
        return false;

    // Regular expression for yyyy-mm-dd format
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  
    // Test if the dateString matches the regex
    return dateFormatRegex.test(dateString);
}

function startsWithHttp(urlString) {
    if (!urlString)
        return false;
    return urlString.startsWith("http");
  }
  