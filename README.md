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

### pbv/
Contains shared components, models, and utility functions used across all PharmaBio/Vet applications. Library is also used in CSP app.

### sdk/
Contains common logic, services, and shared utilities across all apps in the monorepo. Any general-purpose code should go here.

> [!IMPORTANT]
> Every time a new build of a library is merged, pull the changes from the main branch and run `pnpm install`. This is important to stay updated with the libraries.

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
