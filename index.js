const rp = require('request-promise');
const delay = require('delay');
const generate = require('./lib/generate')
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chalk = require('chalk');

const functionRegister = (username) => new Promise((resolve, rejected) => {
    const options = {
        method: 'POST',
        uri: 'https://passport.jd.id/register',
        formData: {
            ReturnUrl: '_ga=2.52916974.799630456.1565617199-1216282360.1565617199',
            spreadUserPin: '',
            cpsPin: '',
            phone: '',
            email: `${username}@hostelland.ru`,
            password: 'anjaymabar123',
            smsCode: '',
            eid: 'MB7MEDTTOPIXMKVHL4JZUJJHA5I3VCF5D4FAW5VRD6BL2CABEIA2K4I34LUPOZXBISOUU62DTL6FB2L5HOWKEHVI34',
            fp: 'b921be185fcb215d2231f55a82aca399',
            mode: 'EMail'
        },
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        }
    };
    rp(options)
        .then(function (body) {
            resolve(body)
        })
        .catch(function (err) {
            rejected(err)
        });
});

const functionGetLink = (email, domain) =>
    new Promise((resolve, reject) => {
        fetch(`https://generator.email/`, {
            method: "get",
            headers: {
                accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "accept-encoding": "gzip, deflate, br",
                cookie: `_ga=GA1.2.1164348503.1554262465; _gid=GA1.2.905585996.1554262465; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=-aUNS6XIdbbHj__faWS_; surl=${domain}%2F${email}`,
                "upgrade-insecure-requests": 1,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
            }
        })
            .then(res => res.text())
            .then(text => {
                const $ = cheerio.load(text);
                const src = $("p[class=style5] span a").attr("href");
                resolve(src);
            })
            .catch(err => reject(err));
    });

const functionVeryf = (url) => new Promise((resolve, rejected) => {
    const options = {
        method: 'GET',
        uri: url
    };
    rp(options)
        .then(function (body) {
            const $ = cheerio.load(body);
            const src = $("strong").text();
            resolve(src)
        })
        .catch(function (err) {
            rejected(err)
        });
});

(async () => {
    console.log(chalk.red('Auto Register & Verification JD.ID'));
    const user = await generate.genUniqueId(5);
    console.log('Mendaftarkan user ' + chalk.red(`${user}`));
    const register = await functionRegister(user);
    const reg = JSON.parse(register);
    if (reg.success === false) {
        console.log(register)
    }
    console.log(chalk.green('Register Sukses.'))
    await delay(2000);
    console.log('Mengambil ' + chalk.yellow('url'))
    await delay(10000)
    const getUrlVeryf = await functionGetLink(user, 'hostelland.ru');
    console.log(`Sukses mengambil link ${getUrlVeryf}`);
    console.log(chalk.yellow('mencoba verifikasi.'))
    await delay(5000);
    const veryf = await functionVeryf(getUrlVeryf);
    console.log(veryf.split('Daftar')[1]);
    console.log('email ' + chalk.green(`${user}@hostelland.ru`) + '| password ' + chalk.green('anjaymabar123'))

})();

