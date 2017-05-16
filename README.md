# Multi-language simple spellchecker

This spellchecker is based on hunspell core rewritten library using npm module "nspell". It supports Multi-Language via .dic and .aff files.
It checks WORD by WORD and ignores all symbols and punctuation.

## Features


#### Simple on/off switch 
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/switch.gif)


#### Simple suggestions
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/suggestions.gif)


#### Multi-Language Support
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/multilangsupport.gif)


#### Camel-case Support
=> "smallRectangle" is treated as "small Rectangle"
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/camelcase.gif)


Adding word to Language Mode (typescript,javascript,c++,...) so language specified keywords are not marked as wrong spelled words 

#### Example
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/addwordlang.gif)


#### Adding word to current dictionary
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/addworddictionary.gif)


## Supported Languages

Pre-installed:

* English (default) 
* Spanish

## Extension Settings

### Adding new language

Additional dictionaries can be downloaded here https://github.com/titoBouzout/Dictionaries, https://github.com/wooorm/dictionaries but you can use any ".dic" and ".aff" files based dictionary downloaded somewhere else.
Download both <YOUR_LANG>.dic and <YOUR_LANG>.aff files and place them into:

C:\Users\<YOURNAME>\.vscode\extensions\denisgerguri.hunspell-spellchecker\languages\


Then open a settings.json file:
C:\Users\<YOURNAME>\.vscode\extensions\denisgerguri.hunspell-spellchecker\settings\settings.json and insert new language.

#### How-to
![Example](https://raw.githubusercontent.com/neutronka/hunspell-spellchecker/new/images/addnewlang.gif)

### Manually editing document type ignored words (C++,Javascript,LaTEX)

For each document type a text file is created in 

C:\Users\<YOURNAME>\.vscode\extensions\denisgerguri.hunspell-spellchecker\settings\

If there is no document created for type that you need just open a new document of that type in VS Code and it is going to be automatically created.
All you have to do is write all the words that you want to ignore in here. One word per line.

#### Example
Javascript ignored words

break
case
catch
continue 
default 
delete 
do 
else
finally 
for 
function 
if 
in 
instanceof 
new
return
switch
this
throw
try
typeof
var
void
while
with
abstract
boolean
byte 
char 
class 
const 
debugger 
double 
enum
export 
extends 
final 
float 
goto 
int
interface
implements
import
long
native
package
private
protected
public
short
static
super
synchronized
throws
transient
volatile


## Release Notes


### 1.0.0

Initial release of spellchecker


-----------------------------------------------------------------------------------------------------------

**Enjoy!**