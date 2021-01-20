const puppeteer = require('puppeteer')
const fs = require('fs')
const {URL} = require('url')

const startUrl = 'https://coderanch.com/f/33/java'
const titleSelector = '#rightPanel > div > div.forum-topics > ul > li:nth-child(3) > div > div > div > a > h3'
const nextLinkSelector = 'a[title="Next page"]'
// const maxPages = 20
const maxPages = 1

// Start the proxy server
require('./proxy-rotator')


;(async () => {
    let url = startUrl
    const origin = new URL(url)
    const browser = await puppeteer.launch({
        args: ['--proxy-server=http://185.198.188.55:8080']
        // args: ['--proxy-server="http://127.0.0.1:4000"']
    })
    const page = await browser.newPage()

    const stream = fs.createWriteStream('data.txt', {flags: 'a'})
    let i=0

    while (url && i<maxPages) {
        await page.goto(url)

        const pageData = await page.$$eval(titleSelector, topic => topic.map(el => el.textContent))
        pageData.forEach(item => stream.write(item + '\n'))
        stream.write('\n')

        console.log(`Scraped page ${url}`)
        
        const urlVal = await page.$eval(nextLinkSelector, el => el.getAttribute('href'))
        url = new URL(urlVal, origin).href
        i++
    }

    stream.close()

    await browser.close()
})()