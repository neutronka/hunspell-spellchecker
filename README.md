#Multi-language spellchecker for source code and simple text

This spellchecker is based on hunspell library using npm module "nodehun". It supports Multi-Language via .dic and .aff files.
It checks WORD by WORD and ignores all symbols and punctuation.

## Features

Simple on/off switch 

#### Example
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/switch.gif)

Simple suggestions

#### Example
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/suggestions.gif)


Multi-Language Support

#### Example
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/multilangsupport.gif)


Camel-case Support => "smallRectangle" is treated as "small Rectangle"

#### Example
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/camelcase.gif)


Adding word to Language Mode (typescript,javascript,c++,...) so language specified keywords are not marked as wrong spelled words 

#### Example
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/addwordlang.gif)


Adding word to current dictionary

#### Example
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/addworddictionary.gif)


## Supported Languages

Pre-installed:

* English (default) 
* Spanish
* Czech




## Extension Settings

### Adding new language

Additional dictionaries can be downloaded here https://github.com/titoBouzout/Dictionaries, but you can use any ".dic" and ".aff" files based dictionary downloaded somewhere else.
Download both <YOUR_LANG>.dic and <YOUR_LANG>.aff files and place them into:

C:\Users\<YOURNAME>\.vscode\extensions\denisgerguri.hunspell-spellchecker\languages\


Then open a settings.json file:
C:\Users\<YOURNAME>\.vscode\extensions\denisgerguri.hunspell-spellchecker\settings\settings.json and insert new language.



### Manually editing document type ignored words

For each document type a text file is created in 

C:\Users\<YOURNAME>\.vscode\extensions\denisgerguri.hunspell-spellchecker\settings\

If there is no document created for type that you need just open a new document of that type in VS Code and it is going to be automatically created.
All you have to do is write all the words that you want to ignore in here. One word per line.


## Release Notes


### 1.0.0

Initial release of spellchecker


-----------------------------------------------------------------------------------------------------------

**Enjoy!**