const puppeteer = require('puppeteer');
const fs = require('fs');
const { createPage } = require('./notion')


const parent = {
    type: 'database_id',
    database_id: '100de2a91181804a8b67f8d47deb7698'
}
const makePage = async (restaurant) => {


    let fields = {
        Name: {
            type: 'title', title: [{
                text: {
                    content: restaurant.name } }] },
        YelpAlias: { type: 'rich_text', rich_text: [{ text: { content: restaurant.alias } }] }
        // Description: { type: 'title', title: [{ text: { content: album.id } }] },
    }



    await createPage(parent, fields)
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getRestaurants = async () => {
    let restaurants = []

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.yelp.com/collection/nWz8gJe5ReVI_CkDk8BZ6Q/Want-to-Visit');
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('.collection-content.collection-left-pane');

    for (let i = 0; i < 5; i++) {
        await page.$eval('.collection-content.collection-left-pane', (el) => el.scrollTop += 4000)
        await timeout(1000)
    }
    let items = await page.$$('.collection-item')

    for (let item of items) {
        let alias = await item.$eval('a', x => x.getAttribute('href').replace('/biz/', ''))
        let name = await item.$eval('a span', x => x.innerText.trim())
        restaurants.push({ name, alias })
    }

    // fs.writeFileSync('out.js', (r));
    await browser.close();
    return restaurants;


}


(async function start() {


    let restaurants = await getRestaurants();
    fs.writeFileSync('want-to-go-restaurants.json', JSON.stringify(restaurants));
    // let restaurants = JSON.parse(fs.readFileSync('restaurants.json'));
    // await makePage(restaurants[0])
    // for (let restaurant of restaurants) {
    //     await makePage(restaurant);
    // }


})();