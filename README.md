# AngularApps

This repository follows a monorepo architecture that contains multiple applications and a library.

## Repository Structure


    .
    ├── apps/               # Application directory
    │   ├── csp/            # Certificate of Supplementary Protection Application
    │   ├── md-ai/          # Medical Devices - Application Information
    │   ├── md-co/          # Medical Devices - Company Template
    │   ├── md-rt/          # Medical Devices - Regulatory Transaction
    │   ├── mf-rt/          # Master File Application Form
    │   ├── pbv-co/         # PharmaBio/Vet - Company Template
    │   ├── pbv-pi/         # PharmaBio/Vet - Product Information
    │   └── pbv-rt          # PharmaBio/Vet - Regulatory Transaction
    ├── libs/               # Built tarball files of libraries
    ├── projects/           # Libraries
    │   ├── pbv/            # PharmaBio/Vet library
    │   └── sdk/            # General library
    ├── python/             # Scripts for building apps
    │   ├── buildHtmlFiles/
    │   ├── post-app-build/
    │   └── utils/
    ├── angular.json/
    ├── package.json/       # Root-level dependencies and scripts
    └── README.md

## Local Development and Deployment Instructions

### Prerequisites
- Node.js (downloaded from company portal)
- pnpm `Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression`
- Python3 (downloaded from company portal)
- Angular `npm install -g @angular/cli"`
- Jinja `pip install Jinja2`

### Run Instructions

Go to project root and install packages and dependencies.

`pnpm install`

Head over to the project root's package.json. Run the specified app using the scripts that start with "start-(app)". Right click on the script and click "Run script". The application will open in your browser.

### Build/Deployment Instructions

- Go to root's package.json
- Build scripts for each application start with "build-(app)"
- Once the application is built, the built files will be located in /dist/
- First delete the en and fr folder that is currently in the branch so only the new files will exist and then copy the new en and fr folders to [development or production repos](https://github.com/hres/REP-Form/tree/rep_dev)
- Push to GitHub and make sure to add a comment with the form name and version # (i.e. Masterfile Form - v1.0.2)
- Dev will deploy automatically but for Production, The IT HRE team must be contacted once the code has been pushed to the production branch.

## Library Structure and Usage


> [!IMPORTANT]
> Whenever a new library build is merged, make sure to pull the latest changes from the main branch and run pnpm install. This ensures your setup stays up to date with the latest library updates.


### pbv/
Contains shared components, models, and utility functions used across all PharmaBio/Vet applications. Library is also used in CSP app.

### sdk/
Contains common logic, services, and shared utilities across all apps in the monorepo. Any general-purpose code should go here.

#### SDK Usage
**check-sum**
a service to create checksum value for xml output

**component-base**
abstract BaseComponent class. It emits errors in the AfterViewInit lifecycle.

**converter**
a service to convert between ICode and IIdTextLabel objects

**data-loader**
a service to load json data into the application

**directives**
NumbersOnlyDirective to stripe alpha chars when user does copy/paste

**error-msg**
shared components to display the field error message and the aggregation of the form's error messages

**expander**
shared component to expand/collapse a section

**file-io**
shared component to handle importing form exported data

**information**
shared components for Privacy Notice Statement and Security Disclaimer

**interceptor**
contains an interceptor to modify outgoing HTTP requests to include headers that prevent caching

**layout**
shared component for form's layout

**logger**
contains a service to log messages to console

**model**
shared entity models and html CheckboxOption 

**pipes**
various customized pipes used in forms

**popup**
shared component to display a popup window

**record-list**
shared component to handle list of records

**routing**
contains a service to handle page navigation

**utils**
various common utility functions

**validation**
shared formControl's validtion functions

**version**
a service to deal with form version number

common.constants.ts
common constants

### Creating and Building an Angular Library

Inside the projects/ directory, create a new folder named after your project. Then, in the root of the newly created folder, run the following command to generate a new library:

`ng generate library library-name`

Unfortunately, there's no easy command to create the library inside the projects/hpfb.

You will need to create the library using the command above and move it in using:

`mv projects/pbv projects/hpfb`

After, you will need to edit the main angular.json file and a couple files inside the library since it has been moved:

- The ng-package.json, tsconfig.lib.json and tsconfig.spec.json will all need an extra ../ where needed.
- The name of the package.json will need to change if you change it in the main angular.json file.
- Also, in the main angular.json file anywhere that says projects/NameOfLibrary you will need to change it to projects/hpfb/NameOfLibrary.
- If you change the prefix in the main angular.json file you will need to change the selector in the src/lib/NameOfLibrary.component.ts of the library.
- After that you should be able to run the command ng build NameOfLibrary and see it in the dist folder.

https://v17.angular.io/cli/generate#library-command

## Best Practices for Version Control
https://jill.hc-sc.gc.ca/jira/browse/SCRADMIN-10

## Other useful commands

### Create a new application

Run `ng g application app-name --routing=false` to generate a new application. 

? Which stylesheet format would you like to use? CSS

? Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? No

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Generate a new component

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
