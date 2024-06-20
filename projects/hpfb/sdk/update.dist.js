var replace = require('replace-in-file');
const fs = require('fs-extra');

// Insert a debugger statement to pause execution here
// debugger;   

var modificationDate = formatDate(new Date(), "yyyy-mm-dd");

const DIST_DIR = "dist";
const ASSETS_TEMP = "/assets/temp";     // the folder is configured in angular.json
const config = {
    "md-co-external": {
        "outputPath": DIST_DIR + "/md-co/external",
        "breadcrumbsPath": "md",
        "en": {
            "indexFileOriginalName": "/index-en.html",
            "indexFileNewName": "/md-company.html",
        },
        "fr": {
            "indexFileOriginalName": "/index-fr.html",
            "indexFileNewName": "/im-compagnie.html",
        }
      },
      "md-co-internal": {
        "outputPath": DIST_DIR + "/md-co/internal",
        "breadcrumbsPath": "md",
        "en": {
            "indexFileOriginalName": "/index-en.html",
            "indexFileNewName": "/index-internal.html",
        },
        "fr": {
            "indexFileOriginalName": "/index-fr.html",
            "indexFileNewName": "/index-internal.html",
        }
      },
      "md-rt": {
        "outputPath": DIST_DIR + "/md-rt",
        "breadcrumbsPath": "md",
        "en": {
            "indexFileOriginalName": "/index-en.html",
            "indexFileNewName": "/md-regulatory-transaction.html",
        },
        "fr": {
            "indexFileOriginalName": "/index-fr.html",
            "indexFileNewName": "/im-transaction-reglementaire.html",
        }
      },
      "md-ai": {
        "outputPath": DIST_DIR + "/md-ai",
        "breadcrumbsPath": "md",
        "en": {
            "indexFileOriginalName": "/index-en.html",
            "indexFileNewName": "/md-application-information.html",
        },
        "fr": {
            "indexFileOriginalName": "/index-fr.html",
            "indexFileNewName": "/im-information-demande-homologation.html",
        }
      },
      "mf-rt": {
        "outputPath": DIST_DIR + "/mf-rt",
        "breadcrumbsPath": "mf",
        "en": {
            "indexFileOriginalName": "/index-en.html",
            "indexFileNewName": "/mf-regulatory-transaction.html",
        },
        "fr": {
            "indexFileOriginalName": "/index-fr.html",
            "indexFileNewName": "/im-transaction-reglementaire.html",
        }
      }

    }

try {   
    // Get the command-line arguments
    const args = process.argv.slice(2);

    // Parse the arguments and create an object for easier access
    const params = args.reduce((acc, arg) => {
        const [key, value] = arg.split('=');
        acc[key.replace(/^--/, '')] = value;
        return acc;
    }, {});

    const argLang = params.language;
    const argTemplate = params.template;
    const argServerBaseUrl = params.serverBaseUrl;
    const argDateIssued = params.dateIssued;

    // console.log(`Template: ${argTemplate} Language: ${argLang} serverBaseUrl: ${argServerBaseUrl} dateIssued: ${argDateIssued} were passed in as parameters`);

    var tempConfig= config[argTemplate]
    console.log(`found configurations for ${argTemplate}\n`, tempConfig);

    // remove the "broswer" folder, https://github.com/angular/angular-cli/issues/26304
    const destinationDir = tempConfig.outputPath + "/" + argLang;
    const sourceDir = destinationDir + '/browser';
    console.log("\nstep 1:  move files from", sourceDir, "to", destinationDir);
    // Ensure the destination directory exists
    fs.ensureDirSync(destinationDir);
    // Move contents from source to destination
    fs.copySync(sourceDir, destinationDir, { overwrite: true });
    // Optionally, you can remove the source directory after moving its contents
    fs.removeSync(sourceDir);

    const indexFilePath = destinationDir + tempConfig[argLang].indexFileOriginalName; 
    const assetsTempFilePath = destinationDir + ASSETS_TEMP          

    // replace breadcrumbs' placeholders in the index file with application breadcrumbs
    breadcrumbsFilePath = assetsTempFilePath + "/breadcrumbs/" + tempConfig.breadcrumbsPath + "/breadcrumbs-" + argLang + ".html";
    console.log("\nstep 2:  replace breadcrumbs placeholder in ", indexFilePath, "with content from", breadcrumbsFilePath);

    const breadcrumbsHtml = fs.readFileSync(breadcrumbsFilePath, 'utf8');

    const breadcrumbsOptions = {
        files: indexFilePath,
        from: [new RegExp(`<!-- build:breadcrumbs-${argLang}.html -->`, 'g')],
        to: [breadcrumbsHtml],
        countMatches: true,
    };

    changeFiles(breadcrumbsOptions);

    // replace metadata placeholders in the index file with application metadata
    const metaDataFilePath = assetsTempFilePath + '/metadata/' + (/^md-co/.test(argTemplate)? 'md-co': argTemplate) + '/metaData-' + argLang+ '.html'
    const metaDataHtml = fs.readFileSync(metaDataFilePath, 'utf8');
    console.log("\nstep 3:  replace metadata placeholder in ", indexFilePath, "with content from", metaDataFilePath);
    
    const metadataReplaceOptions = {
        files: indexFilePath,
        from: [new RegExp(`<!-- build:metaData-${argLang}.html -->`, 'g')
        ],
        to: [metaDataHtml],
        countMatches: true,
    };

    changeFiles(metadataReplaceOptions);

    // replace CDTS static files placeholders in the index file with content/data
    staticFilePath = assetsTempFilePath + "/static/";
    console.log("\nstep 4:  replace cdts static files' placeholder in ", indexFilePath, "with files from", staticFilePath, "folder");

    const refTopHtml = fs.readFileSync(staticFilePath + 'refTop.html', 'utf8');
    const topHtml = fs.readFileSync(staticFilePath + 'top-' + argLang+ '.html', 'utf8');
    const prefFooterHtml = fs.readFileSync(staticFilePath + 'preFooter-' + argLang+ '.html', 'utf8');
    const footerHtml = fs.readFileSync(staticFilePath + 'footer-' + argLang+ '.html', 'utf8');

    const staticFileOptions = {
        files: indexFilePath,
        from: [/<!-- build:refTop.html -->/g,
            new RegExp(`<!-- build:top-${argLang}.html -->`, 'g'),
            new RegExp(`<!-- build:preFooter-${argLang}.html -->`, 'g'),
            new RegExp(`<!-- build:footer-${argLang}.html -->`, 'g')],
        to: [refTopHtml, topHtml, prefFooterHtml, footerHtml],
        countMatches: true,
    };

    changeFiles(staticFileOptions);

    // replace generic placeholders in the index file with data
    const lng = argLang == 'en'? 'fr' : 'en';
    const lngHref = '../' + lng + tempConfig[lng].indexFileNewName
    console.log(`\nstep 5:  replace generic placeholders in ${indexFilePath} with these values: ${lngHref}, ${argDateIssued}, ${modificationDate}, ${argServerBaseUrl}`);

    const replaceOptions = {
        files: indexFilePath,
        from: [/<!-- build:lngHref -->/g,
            /<!-- build:dateIssued -->/g,
            /<!-- build:dateModified -->/g,
            /<!-- build:serverBaseUrl -->/g],
        to: [lngHref, argDateIssued, modificationDate, argServerBaseUrl],
        countMatches: true,
    };

    changeFiles(replaceOptions);

    // remove temp asset files
    console.log(`\nstep 6:  remove the ${assetsTempFilePath} folder from dist package`)
    fs.rmSync(assetsTempFilePath, { recursive: true, force: true });

    // rename index file name
    const indexFileNewName = destinationDir + tempConfig[argLang].indexFileNewName;
    console.log("\nstep 7:  rename index file from ", indexFilePath, "to", indexFileNewName)
    fs.rename(indexFilePath, indexFileNewName, () => { });   

} catch (err) {
    console.error("ERROR OCCURED DURING UPDATING DIST FILES");
    console.error(err);
}

function formatDate(date, format) {
    const map = {
        mm: ('0' + (date.getMonth() + 1)).slice(-2),
        dd: ('0' + date.getDate()).slice(-2),
        yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|yyyy/gi, matched => map[matched])
}

function changeFiles(options) {
    const numberOfFroms = options.from.length;
    console.log('Number of "from" patterns:', numberOfFroms);
    let results = replace.sync(options);
    if (results == 0) {
        throw "!!! Nothing was changed";
    }
    console.log("change results");
    console.log(results);
}