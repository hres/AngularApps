var replace = require('replace-in-file');
const fs = require("fs");

var modificationDate = formatDate(new Date(), "yyyy-mm-dd");

const DIST_DIR = "dist/master-file/";
const config = {
    "en": {
        "outputPath": DIST_DIR + "en/",
        "staticFilePath": DIST_DIR + "en/assets/static/",
        "indexFileOldPath": DIST_DIR + "en/index.html",
        "indexFileNewPath": DIST_DIR + "en/master-file-form.html",
        "lngHref": "../fr/formulaire-fiche-maitresse.html",
    },
    "fr": {
        "outputPath": DIST_DIR + "fr/",
        "staticFilePath": DIST_DIR + "fr/assets/static/",
        "indexFileOldPath": DIST_DIR + "fr/index-fr.html",
        "indexFileNewPath": DIST_DIR + "fr/formulaire-fiche-maitresse.html",
        "lngHref": "../en/master-file-form.html"
    }
}

try {
    
    if (process.env.npm_config_language == 'en') {
        const refTopHtml = fs.readFileSync(config.en.staticFilePath + 'refTop.html', 'utf8');
        const topEnHtml = fs.readFileSync(config.en.staticFilePath + 'top-en.html', 'utf8');
        const prefFooterEnHtml = fs.readFileSync(config.en.staticFilePath + 'preFooter-en.html', 'utf8');
        const footerEnHtml = fs.readFileSync(config.en.staticFilePath + 'footer-en.html', 'utf8');

        const optionsEn = {
            files: config.en.indexFileOldPath,
            from: [/<!-- build:refTop.html -->/g,
                /<!-- build:top-en.html -->/g,
                /<!-- build:preFooter-en.html -->/g,
                /<!-- build:footer-en.html -->/g,
                /<!-- build:lngHref -->/g,
                /<!-- build:dateModified -->/g],
            to: [refTopHtml, topEnHtml, prefFooterEnHtml, footerEnHtml, config.en.lngHref, modificationDate],
            countMatches: true,
        };

        changeFiles(process.env.npm_config_language, optionsEn);
        // Rename index files
        fs.rename(config.en.indexFileOldPath, config.en.indexFileNewPath, () => { });
        // remove the static
        fs.rmSync(config.en.staticFilePath, { recursive: true, force: true });

    } else if (process.env.npm_config_language == 'fr') {
        const refTopHtml = fs.readFileSync(config.fr.staticFilePath + 'refTop.html', 'utf8');
        const topFrHtml = fs.readFileSync(config.fr.staticFilePath + 'top-fr.html', 'utf8');
        const prefFooterFrHtml = fs.readFileSync(config.fr.staticFilePath + 'preFooter-fr.html', 'utf8');
        const footerFrHtml = fs.readFileSync(config.fr.staticFilePath + 'footer-fr.html', 'utf8');

        const optionsFr = {
            files: config.fr.indexFileOldPath,
            from: [/<!-- build:refTop.html -->/g,
                /<!-- build:top-fr.html -->/g,
                /<!-- build:preFooter-fr.html -->/g,
                /<!-- build:footer-fr.html -->/g,
                /<!-- build:lngHref -->/g,
                /<!-- build:dateModified -->/g],
            to: [refTopHtml, topFrHtml, prefFooterFrHtml, footerFrHtml, config.fr.lngHref, modificationDate],
            countMatches: true,
        };

        changeFiles(process.env.npm_config_language, optionsFr);
        // Rename index files
        fs.rename(config.fr.indexFileOldPath, config.fr.indexFileNewPath, () => { });
        // remove the static
        fs.rmSync(config.fr.staticFilePath, { recursive: true, force: true });
    }

    console.error("UPDATE DIST FILES ARE SUCCESSFULLY COMPLETED!");

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

function changeFiles(lang, options) {
    console.log("==> process dist file text replacement for ", lang);
    let results = replace.sync(options);
    if (results == 0) {
        throw "Nothing was changed!!";
    }
    console.log(results);
}