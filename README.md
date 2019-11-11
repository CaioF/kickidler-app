# КП-шник Kickidler

Приложение для оформления кормеческих предложений, система создана для автоматизирования и нормализирования оформления кп.<br>

## Чтобы запустит приложение:

### 1. `git clone https://github.com/CaioF/kickidler-app.git`<br>
Clones the repo into a new folder.

### 2. `cd kickidler-app`
Change your terminal directory into the `kickidler-app` folder.<br>

### 3. `npm install`
Installs all the required dependencies
* **Warning! the app is configured to work with nodejs 10.**<br>

### 4. Поменяйте IP в файлах внутри папки компонентов
App is configured to work on a local host via the local IPv4 adress. Follow these steps to do so: 
* Get your IPv4 via `ipconfig` (on Windows) or `ip addr show` (on Linux).
* Change the IPs on the files inside the `/components` folder.<br>

### 5. Добавляйте логин и пароль к `server.js`
You need to add the login and password in order to gain acess to the remote mongodb database.
Get the credentials and put them at `const uri = "mongodb+srv://user:password@...`<br>

### 6. `npm run build`
Builds the app for production to the `build` folder.<br>

### 7. `node server.js`
Starts the app.<br>

### 8. Open your browser and type in: `http://your.ipv4.adress:8008`
Opens the app.<br>

## BAT Executable for lazy managers:
`@echo on`<br>
`taskkill /IM "node.exe" /F`<br>
`cd C:\path\to\kickidler-app`<br>
`start cmd /k node server.js`<br>
`ping your.ipv4.adress`<br>
`start "" http://your.ipv4.adress:8008`<br>
`pause`<br>
