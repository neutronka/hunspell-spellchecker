// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
let vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {


    // to handle camelCase
    var xregexp = require('xregexp');
    //Nodehun library
    var nodehun = require('nodehun');
    //Path maker
    var path = require('path');
    //Filesystem 
    var fs = require('fs');
    //First status bar
    var statusBarItemSpell;
    //Language status bar
    var statusBarItemLanguage;
    //is extension active
    var active = false;
    var currentLangIndex = 0;
    var DEBUG = false;
    //parse user specified settings or load default 
    var settings;
    //
    var timeout;
    //timestamp
    var time = Date.now();
    // Interval to do spellcheck when typing
    const checkInterval = 1000; // 1sec 1000 milisec

    // language specified ignored words
    var ignoredWords = [];
    // array that hold record of used langid in session
    var fixProviderLanguageIds = [];

    var diagnosticCollection = vscode.languages.createDiagnosticCollection('SpellingErrors');
    var diagnostics = [];
    if (DEBUG) {
        console.log('Congratulations, your extension "spellchecker" is now active!');
    }

    // align bars to left with priority Left:statusBarItemSpell:statusBarItemLanguage:Right
    statusBarItemSpell = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
    statusBarItemLanguage = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    //register commands
    vscode.commands.registerCommand("activateSpell", activateSpell.bind(this));
    vscode.commands.registerCommand("changeLanguage", changeLanguage.bind(this));
    vscode.commands.registerCommand("addToDictionary", addToDictionary.bind(this));
    vscode.commands.registerCommand("addToIgnored", addToIgnored.bind(this));
    

    //register actionsprovider -- lightbulb

    const fixProvider = {
        // this function is called whenever user click onto text that have diagnostic collection 
        provideCodeActions: function (document, range, context, token) {
            let word = document.getText(range);
            console.log(JSON.stringify(str));
            return [
                { title: "Add \'" + word + "\' to dictionary", command: "addToDictionary", arguments: [word] },
                { title: "Ignore \'" + word + "\' in '" + vscode.window.activeTextEditor.document.languageId + "'", command: "addToIgnored", arguments: [word] }
            ];
        }

    };

    // Action provider - lightbulb
    var fixer;
    context.subscriptions.push(fixer);
    // Register code action provider
    fixer = vscode.languages.registerCodeActionsProvider(vscode.window.activeTextEditor.document.languageId, fixProvider);
    // add to array so its not used twice for same document
    fixProviderLanguageIds.push(vscode.window.activeTextEditor.document.languageId);



    // activate extension
    activateSpell();

    // Event fired when opening new document also fired when changing document languageID
    vscode.workspace.onDidOpenTextDocument(checkLanguageID, this, context.subscriptions);

    // Event fired when editing text
    vscode.workspace.onDidChangeTextDocument(timedSpellCheck, this, context.subscriptions);


    try {
        settings = require("./settings/settings.json");
    }
    catch (error) {
        console.log("Unable to load user specified settings. Loading default settings from settings_backup");
        vscode.window.showInformationMessage("Spellchecker: Unable to load user specified settings. Loading default settings from settings_backup");
        console.log(error);
        settings = require("./settings/settings_backup.json");
    }

    //bars setup
    statusBarItemSpell.command = "activateSpell";
    statusBarItemSpell.tooltip = "Toggle Spellchecking On/Off";
    statusBarItemSpell.show();

    statusBarItemLanguage.command = "changeLanguage";
    statusBarItemLanguage.tooltip = "Toggle to change language";
    statusBarItemLanguage.show();
    statusBarItemLanguage.text = "$(three-bars) " + settings.languages[0].id;


    // Load aff souboru
    var affbuf = fs.readFileSync(path.join(context.extensionPath, "languages/" + settings.languages[0].aff_file));
    // Load slovniku
    var dictbuf = fs.readFileSync(path.join(context.extensionPath, "languages/" + settings.languages[0].dic_file));
    var dict = new nodehun(affbuf, dictbuf);
    


    // Funkce 
    // Add wrong spelled word to dictionary
    function addToDictionary(word) {
        if (DEBUG) {
            console.log("Adding word: " + word + " to dictionary");
        }
        dict.addWordSync(word);
        // Spellcheck again using updated dict
        spellCheck();
    }
    // Add wrong spelled word to lang specified ignored list "plaintext,javascript etc."
    function addToIgnored(word) {
        if (DEBUG) {
            console.log("Adding word: " + word + " to lang. ignored list");
        }
        // Add word to current array
        ignoredWords.push(word);
        // Add word to file for next time
        fs.appendFileSync(path.join(context.extensionPath, './settings/' + vscode.window.activeTextEditor.document.languageId + '.txt'), word + '\r\n');

        // Spellcheck again using updated list
        spellCheck();
    }



    function checkLanguageID() {
        if (DEBUG) {
            console.log(vscode.window.activeTextEditor.document.languageId);
        }

        // If is not in array yet
        if (fixProviderLanguageIds.indexOf(vscode.window.activeTextEditor.document.languageId) == -1){
            // Register code action provider
            fixer = vscode.languages.registerCodeActionsProvider(vscode.window.activeTextEditor.document.languageId, fixProvider);
            // add to array so its not used twice for same document
            fixProviderLanguageIds.push(vscode.window.activeTextEditor.document.languageId);
        }

        // Load language specified words to array based on current languageid
        try {
            ignoredWords = fs.readFileSync(path.join(context.extensionPath, './settings/' + vscode.window.activeTextEditor.document.languageId + '.txt')).toString().replace(/\r\n/g, '\n').split("\n");
        }
        catch (error) {
            console.log("Unable to load " + vscode.window.activeTextEditor.document.languageId + " ignored words file. Creating new empty file");
            //vscode.window.showInformationMessage("Spellchecker: Unable to load languageid ignored words file. Loading default file from /settings/default");
            //ignoredWords = fs.readFileSync(path.join(context.extensionPath, './settings/default.txt')).toString().replace(/\r\n/g,'\n').split("\n"); 
            //console.log(error);

            // Makes new empty file for current language id, wx - no rewrite
            fs.closeSync(fs.openSync(path.join(context.extensionPath, './settings/' + vscode.window.activeTextEditor.document.languageId + '.txt'), 'wx'));
        }




        // Spell_check document
        spellCheck();

    }

    function timedSpellCheck(){
        
        clearTimeout(timeout);
        timeout = setTimeout(spellCheck, 1000);
    }
    function spellCheck() {

        console.time("spellchecking");

        //CELY TEXT SOUBORU
        //console.log(vscode.window.activeTextEditor.document.getText());
        if (active && dict != undefined) {

            diagnostics = [];
            // Retrieve text from current document
            var origText = vscode.window.activeTextEditor.document.getText();
            // Replace line endings
            origText = origText.replace(/\r?\n/g, '\n');

            var editedText = origText;
            //most non number,letter chars for space
            origText = origText.replace(/[©—’'“”`\"!#$%&()*+,.\/:;<=>?@\[\]\\^_{|}\n\r\-~]/g, ' ');
            // convert tabs to spaces
            origText = origText.replace(/\t/g, ' ');

            // split camelCase -> camel Case with xregexp handles unicode YEAH FINALY 
            var camelCase = xregexp('(\\p{Ll})(\\p{Lu})');
            origText = xregexp.replace(origText,camelCase, '$1 $2', 'all');
            //only ascii
            //origText = origText.replace(/([a-z])([A-Z])/g, '$1 $2');

            var lastposition = 0;
            var position = 0;
            var linenumber = 0;
            var colnumber = 0;
            // Split to array seperated by spaces
            var words = origText.split(' ');

            // Filter array with filterArray function remove '\n'
            words = words.filter(filterArray);


            // Split lines by new line to keep track of words position
            var lines = editedText.split('\n');
            
            for (var i in words) {
             

                
                //TODO DONT CHECK LANG SPECIFIC WORDS
                
                // If word is not in ignored words, converted to lowercase Ahoj,ahoj equals ahoj in ignoredwords
                if (ignoredWords.indexOf(words[i].toLocaleLowerCase()) == -1) {


                    //If wrong
                    if (!dict.isCorrectSync(words[i])) {

                        // Find position of wrong spelled word
                        position = lines[linenumber].indexOf(words[i], lastposition);
                        // If not found on first line
                        while (position < 0) {
                            //Reset lastposition and search next line
                            lastposition = 0;
                            linenumber++;

                            // When found 
                            if (linenumber < lines.length) {
                                position = lines[linenumber].indexOf(words[i], lastposition);
                            }
                            else {
                                console.log("eror zacykleni");
                            }
                        
                        }
                        // Next word in array must be after the previous word so we can set new start position from the old one
                        colnumber = position;
                        lastposition = position + words[i].length;
                        
                        //console.log(linenumber, colnumber, linenumber, colnumber + words[i].length);
                        

                        var lineRange = new vscode.Range(linenumber, colnumber, linenumber, colnumber + words[i].length);
                        var diag = new vscode.Diagnostic(lineRange,"Suggested word/s: " + dict.spellSuggestionsSync(words[i]).toString(), vscode.DiagnosticSeverity.Error);
                        diagnostics.push(diag);

                        

                    }

                }






            }


            //Set new
            diagnosticCollection.set(vscode.window.activeTextEditor.document.uri, diagnostics);

        }
        console.timeEnd("spellchecking");
    }
    

    function filterArray(value) {

        if (value != '\n' && value != '\r\n' && value != '\r') {
            return value;
        }
    }



    // Changes current language to the next one
    function changeLanguage() {

        if (DEBUG) {
            console.log("Current language: " + settings.languages[currentLangIndex].name);

        }
        // change index without overflow
        if ((currentLangIndex + 1) == settings.languages.length) {
            currentLangIndex = 0;
        }
        else {
            currentLangIndex++;
        }
        // Load new language depending on currentLangIndex
        affbuf = fs.readFileSync(path.join(context.extensionPath, "languages/" + settings.languages[currentLangIndex].aff_file));
        dictbuf = fs.readFileSync(path.join(context.extensionPath, "languages/" + settings.languages[currentLangIndex].dic_file));
        dict = new nodehun(affbuf, dictbuf);
        // Update status bar text
        statusBarItemLanguage.text = "$(three-bars) " + settings.languages[currentLangIndex].id;
        //spellcheck after changing language
        spellCheck();

    }

    // Activates/Deactivate extension and change statusbar info 
    function activateSpell() {
        if (active) {
            active = false;
            statusBarItemSpell.text = "$(x) Spellchecking Off";
            statusBarItemSpell.color = "red";
            diagnosticCollection.clear();
        }
        else {
            active = true;
            statusBarItemSpell.text = "$(check) Spellchecking On";
            statusBarItemSpell.color = "white";
            spellCheck();
        }
    }



    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

