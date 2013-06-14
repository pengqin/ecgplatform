set CHROME_HOME=C:\Program Files (x86)\Google\Chrome\Application
for %%x in ("%CHROME_HOME%") do set CHROME_HOME=%%~sx
set EXE_CHROME=%CHROME_HOME%\chrome.exe
%EXE_CHROME% --disable-web-security index.html