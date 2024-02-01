const fs = require('fs');
const { resolve } = require('path');

// Insert a debugger statement to pause execution here
// debugger;

const templatex = process.env.npm_config_template;
const languagex = process.env.npm_config_language;

console.log(`\tTemplate: ${templatex} Language: ${languagex} were passed in as parameters`);

const envConfig = {
  "md-co-external": '../../md-co/src/environments/environment.prod-',
  "md-co-internal": '../../md-co/src/environments/environment.prod.internal-',
  "md-rt": '../../md-rt/src/environments/environment.prod-',
};
const baseEnvConfig = {
  "md-co-external": '../../md-co/src/environments/env.ts',
  "md-co-internal": '../../md-co/src/environments/env.ts',
  "md-rt": '../../md-rt/src/environments/env.ts',
}

const baseenv_filepath = baseEnvConfig[templatex];
const env_filepath = envConfig[templatex] + languagex + '.ts';
console.log(`\tbaseenv_filepath: ${baseenv_filepath} env_filepath: ${env_filepath} `);
try {

  const baseEnv = fs.readFileSync(resolve(__dirname, baseenv_filepath), 'utf-8');
  // console.log(`\tContent of ${baseenv_filepath}:\n`, baseEnv);
  let dateIssued, serverBaseUrl;

  const match2 = baseEnv.match(/dateIssued\s*:\s*'([^']+)'/);

  if (match2) {
    dateIssued = match2 ? match2[1] : null;
  } else {
    console.error(`\tFailed to extract dateIssued from ${baseenv_filepath}:\n`);
  }

  // Read the content of environment.prod.ts
  // const environmentContent = fs.readFileSync(resolve(__dirname, '../../md-co/src/environments/environment.prod-en.ts'), 'utf-8');
  const environmentContent = fs.readFileSync(resolve(__dirname, env_filepath), 'utf-8');
  // Output debug information
  // console.log(`\tContent of ${env_filepath}:\n`, environmentContent);

  // Extract the value from environment file
  const match1 = environmentContent.match(/serverBaseUrl\s*:\s*'([^']+)'/);

  if (match1) {
    serverBaseUrl = match1 ? match1[1] : null;
  } else {
    console.error('\tFailed to extract serverBaseUrl from environment.prod.ts');
  }

  // these are not just console.log, they are actually output of this task which will be used in next task
  // the sequence of the output matters, these two variables need to be at the end
  console.log(dateIssued);
  console.log(serverBaseUrl);
    
} catch (err) {
  console.error(`ERROR OCCURED DURING READING ${env_filepath}`);
  console.error(err);
}




