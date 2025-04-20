import {default as createPage} from './notion.js'
import fs from 'fs';
import puppeteer from 'puppeteer';
import { htmlToNotion } from 'html-to-notion-blocks'
import pkg from 'node-html-markdown';
const { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } = pkg;
;


const parent = {
    type: 'database_id',
    database_id: '155de2a9118180b38e47d8c13d47af45'
}


const getQuizQuestions = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.greatfrontend.com/questions/quiz');
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('ul.isolate li');
    const questions = await page.$$eval('ul.isolate li a', (questions) => questions.map((qusetion) => qusetion.getAttribute('href')));
    let arr = []
    return 

    for (let [idx, question] of questions.entries()) {
        try {
            await page.goto('https://www.greatfrontend.com' + question);
            const title = await page.$eval('h1', (el) => el.innerText)
            const difficulty = await page.$$eval('article button div span', (els) => els[1].innerText)
            const gh = await page.$eval('article a', (el) => el.getAttribute('href'))
            const ghSegments = gh.split('/');
            const markdownUrl = `https://raw.githubusercontent.com/yangshun/${ghSegments[4]}/refs/heads/${ghSegments.slice(6).join('/')}`;
            await page.goto(markdownUrl);
            const markdown = await page.$eval('pre', (el) => el.innerText);
            const blocks = convertToBlocks(markdown);
            arr.push({ title, difficulty, blocks, markdown, url: `https://www.greatfrontend.com${question}` })
            
            // await makePage({ difficulty, markdown, url: `https://www.greatfrontend.com${question}`, title })

        }
        catch (e) {
            console.log(e, idx, question)
        }
        
    }
    fs.writeFileSync('quiz.json', JSON.stringify(arr));
    browser.close();
}


const login = async (page) => {
    await page.goto('https://www.greatfrontend.com/sign-up');
    await page.setViewport({ width: 1800, height: 700 });
    await page.waitForSelector('a[href="#auth-sign-in"]');
    await page.$eval('a[href="#auth-sign-in"]', (el) => el.click());
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="email"]', 'cering@umich.edu');
    await page.type('input[type="password"]', 'tBC99AittjQCMrH');
    await page.$eval('button[type="submit"]', (btn) => btn.click());
    await page.waitForNavigation();
}

const getCode = async () => {
    const browser = await puppeteer.launch({headless: false} );
    const page = await browser.newPage();
    await login(page);
    const questions = JSON.parse(fs.readFileSync('systemQuestions.json', 'utf8'))

    const arr = [];
    // const ui = questions.filter((q) => q.split('/')[2] === 'user-interface');
    for (let [idx, question] of Object.entries(questions)) {
        // try {
            const url = 'https://www.greatfrontend.com' + question
            await page.goto(url);
            // await page.waitForNavigation();
            try {
                await page.waitForSelector('article')
            }
            catch (e) {
                const title  = await page.evaluate(() => document.title.split('|')[0].trim());
                makePage({ difficulty:'unset', time: 'unset', url: `https://www.greatfrontend.com${question}`, title })
                continue
            };
            
            const title = await page.$eval('h1', (el) => el.innerText)
            const difficulty = await page.$$eval('article section button span', (els) => els[0].innerText)
            const time = await page.$$eval('article section button span', (els) => els[1].innerText)

            // const starterCode = await page.$eval('textarea', (el) => el.value);
            // const testCode = await page.$$eval('textarea', (els) => els[1].value);
            // await page.$$eval('#data-panel-id-right-column .flex.h-8.flex-col button', (els) => els[1].click());
            // await page.waitForSelector('#data-panel-id-right-column .relative.grow .border-neutral-200 button.transition-colors');
            // await page.$$eval('#data-panel-id-right-column .relative.grow .border-neutral-200 button.transition-colors', (els) => els[2].click());
            // await page.waitForSelector('#data-panel-id-right-column pre');
            // const submissionCode = await page.$eval('#data-panel-id-right-column pre', (el) => el.innerText);

            // const q = await page.$$eval('#data-panel-id-left-column .prose', (els) => els[0].innerHTML)
            // const { markdown: questionsMarkdown } = convertToBlocks(q);


            // await page.goto('https://www.greatfrontend.com' + question.split('?')[0] + '/solution');
            // await page.waitForNavigation();
            // await page.waitForSelector('#data-panel-id-left-column .prose');
            // const answer = await page.$$eval('#data-panel-id-left-column .prose', (els) => els[1].innerHTML)
            // const { markdown: answerMarkdown } = convertToBlocks(answer)

            // const directoryName = title.trim().replace(/ /g, '-').toLowerCase();
            // fs.mkdirSync('greatfrontend/ui/' + directoryName);
            // // fs.writeFileSync(`greatfrontend/ui/${directoryName}/${directoryName}.js`, starterCode);
            // // fs.writeFileSync(`greatfrontend/ui/${directoryName}/test.js`, testCode);
            // // fs.writeFileSync(`greatfrontend/ui/${directoryName}/test.js`, submissionCode);
            // fs.writeFileSync(`greatfrontend/ui/${directoryName}/question.md`, questionsMarkdown);
            // fs.writeFileSync(`greatfrontend/ui/${directoryName}/answer.md`, answerMarkdown);

            // -----------------------------------//

            const content = await page.$eval('article', (el) => el.innerHTML)
            const details = await page.$eval('article > div:nth-child(1)', (el) => el.innerHTML)
        const { markdown: detailsMarkdown, blocks: detailsBlocks } = convertToBlocks(details);
            const q = await page.$eval('article > div:nth-child(2)', (el) => el.innerHTML)
            const { markdown: questionsMarkdown, blocks: questionsBlocks } = convertToBlocks(q);
            const answer = await page.$eval('article > div:nth-child(4)', (el) => el.innerHTML)
            const { markdown: answerMarkdown, blocks: answersBlocks } = convertToBlocks(answer);

            // arr.push({ title, blocks, markdown, url: `https://www.greatfrontend.com${question}` })
            const directoryName = title.trim().replace(/ /g, '-').toLowerCase();
            fs.mkdirSync('greatfrontend/system-design/' + directoryName);
            fs.writeFileSync(`greatfrontend/system-design/${directoryName}/question.md`, questionsMarkdown);
            fs.writeFileSync(`greatfrontend/system-design/${directoryName}/answer.md`, answerMarkdown);
            fs.writeFileSync(`greatfrontend/system-design/${directoryName}/meta.md`, detailsMarkdown);
            await makePage({ difficulty, time, url: `https://www.greatfrontend.com${question}`, title })


        // }
        // catch (e) {
        //     console.log(e, idx, question)
        // }

    }
    browser.close();
}

const getCodingQuestions = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await login(page);
    await page.goto('https://www.greatfrontend.com/questions/system-design');
    await page.waitForSelector('ul.isolate li');
    // const questions = await page.$$eval('ul.isolate li a', (questions) => questions.map((qusetion) => qusetion.getAttribute('href')));
    // fs.writeFileSync('systemQuestions.json', JSON.stringify(questions));
  
    let arr = []
    // const questions = JSON.parse(fs.readFileSync('systemQuestions.json', 'utf8'));
    // const javascript = questions.filter((q) => q.split('/')[2] === 'javascript');
    // const algo = questions.filter((q) => q.split('/')[2] === 'algo');
    // const ui = questions.filter((q) => q.split('/')[2] === 'user-interface');
    const questions = JSON.parse(fs.readFileSync('systemQuestions.json', 'utf8'))

    for (let [idx, question] of questions.entries()) {
        try {
            const url = 'https://www.greatfrontend.com' + question
            await page.goto(url);
            const title = await page.$eval('h1', (el) => el.innerText)
            const difficulty = await page.$$eval('section button div span', (els) => els[0].innerText)
            const time = await page.$$eval('section button div span', (els) => els[1].innerText)
            await page.waitForSelector('article > div:nth-child(4)');
            
            const q = await page.$eval('article > div:nth-child(2)', (el) => el.innerHTML)
            const { blocks: questionBlocks, markdown: questionsMarkdown} = convertToBlocks(q);
            // const answerUrl = url.split('?')[0] + '/solution';
            // await page.goto(answerUrl);
            // await page.waitForSelector('article > div:nth-child(4)');
            const answer = await page.$eval('article > div:nth-child(4)', (el) => el.innerHTML)
            const { blocks: answerBlocks, markdown: answerMarkdown} = convertToBlocks(answer);
            // await page.$$eval('#data-panel-id-right-column button', (els) => els[2].click());

            arr.push({ title, difficulty, url: `https://www.greatfrontend.com${question}`, questionBlocks, answerBlocks, questionsMarkdown, answerMarkdown, time })
        }
        catch (e) {
            console.log(e, idx, question)
        }

    }
    fs.writeFileSync('coding.json', JSON.stringify(arr));
    browser.close();
}




const makePage = async ({ difficulty, questionBlocks, answerBlocks, url, title, time }) => {

 
    let properties = {
        Name: {
            type: 'title',
            title: [{
                text: {
                    content: title
                }
            }]
        },
        "Source": {
            "select": {
                "name": "Great Frontend"
            }
        },
        "Difficulty": {
            "select": {
                "name": difficulty
            }
        },
        "Question Type": {
            "select":
            {
                "name": "System Design"
            }
        },
        "FromScript": {
            "checkbox": true
        },
        "Recommended Time": {
            type: 'rich_text',
            "rich_text": [{
                "type": "text",
                "text": {
                    "content": time,
                },

            }],
        },
        "Answer": {
            type: 'rich_text',
            "rich_text": [{
                "type": "text",
                "text": {
                    "content": url.trim(),
                    link: {
                        "url": url.trim()
                    }
                },

            }],
        }

    }

    // let children = [
    //     ...questionBlocks,
    //     {
    //         //...other keys excluded
    //         "type": "divider",
    //         //...other keys excluded
    //         "divider": {}
    //     },
    //     {
    //         "type": "toggle",
    //         "toggle": {
    //             "rich_text": [{
    //                 "type": "text",
    //                 "text": {
    //                     "content": "Guide",
    //                 }
    //             }],
    //             "color": "default",
    //             "children": []
    //         }
    //     },
    //     {
    //         "type": "toggle",
    //         "toggle": {
    //             "rich_text": [{
    //                 "type": "text",
    //                 "text": {
    //                     "content": "Answer",
    //                 }
    //             }],
    //             "color": "default",
    //             "children": answerBlocks
    //         }
    //     },
    // ]

    // try {
        await createPage(parent, properties)
    // }
    // catch (e) {
    //     fs.appendFileSync('ui-errors.txt', `${title} ${url} ${e}\n`)
    // }
    
}


const createQuestions = async () => {
    let questions = JSON.parse(fs.readFileSync('coding.json', 'utf8'));
    for (let question of questions) {
        await makePage(question)
    }
}

const convertToBlocks = (html, md) => {

    const markdown = NodeHtmlMarkdown.translate(html);
    const blocks = htmlToNotion(html)


    for (let block of blocks) {
        let entries = [];
        if (block.type === 'bulleted_list_item') {
            entries = block.bulleted_list_item.rich_text
        }
        else if (block.type === 'paragraph') {
            entries = block.paragraph.rich_text
        }
        for (let paragraph of entries) {
            if (paragraph.text && paragraph.text.link && paragraph.text.link.url.startsWith('/')) {
                paragraph.text.link.url = `https://www.greatfrontend.com${paragraph.text.link.url}`
            }
        }
    }

    return { blocks, markdown };
}


(async function() {
    // await getCodingQuestions();
    // createQuestions();
    getCode();
})();

