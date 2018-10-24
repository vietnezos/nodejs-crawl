const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const { Builder, By, until, Capabilities } = require('selenium-webdriver');
const screen = {
    width: 640,
    height: 480
};

const URL = "";
const USERNAME = "";
const PASSWORD = "";
const TIMEOUT = 30000;        // 30s
const RESULT_PATH = __dirname + "/../results/"

let browser = new Builder()
    .withCapabilities(Capabilities.chrome())
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();

function makeFileName() {
    let now = new Date();
    let date = now.getDate().toString();
    let month = (now.getMonth() + 1).toString();
    let year = now.getFullYear().toString();
    let hour = now.getHours().toString();
    let minute = now.getMinutes().toString();
    let second = now.getSeconds().toString();

    date = (date < 10) ? ("0" + date) : date;
    month = (month < 10) ? ("0" + month) : month;
    hour = (hour < 10) ? ("0" + hour) : hour;
    minute = (minute < 10) ? ("0" + minute) : minute;
    second = (second < 10) ? ("0" + second) : second;

    return year + month + date + "_" + hour + minute + second + "-result.html";
}

function doLogin() {
    browser.findElement(By.name("id")).sendKeys(USERNAME);

    browser.wait(until.elementLocated(
        By.name("passwd")), TIMEOUT).then(function(element) {

        element.sendKeys(PASSWORD);
        browser.findElement(By.xpath("//input[@value='ログイン']")).click();

        browser.wait(until.elementLocated(By.id("footer")), TIMEOUT)
            .then(getPageSources);
    });
}

function getPageSources() {
    browser.getPageSource().then(function(source) {
        let fileName = RESULT_PATH + makeFileName();
        fs.writeFile(fileName, source, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved to " + fileName);
        });

        browser.quit();
    });
}


browser.get(URL);
browser.findElement(By.xpath("//img[@src='/images/adult/btb_login.gif']"))
    .findElement(By.xpath(".."))
    .click(); 
browser.wait(until.titleIs(""), TIMEOUT)
    .then(doLogin);

