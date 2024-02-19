const { Client } = require("@notionhq/client")
const dotenv = require('dotenv');
dotenv.config();

// Initializing a client
const notion = new Client({
	auth: process.env.NOTION_TOKEN,
})

const getUsers = async () => {
	const listUsersResponse = await notion.users.list({})
  console.log(listUsersResponse)
}

const getDatabase = async () => {
  const db = await notion.databases.query({
    database_id: 'fdae95c80f954bc595d659e8accbe15e'
  })
  console.log(db)
}

const getPage = async () => {
  let pageId = '35c32442-1dfd-43ec-a65d-b33915cfb1dd';
  const response = await notion.pages.retrieve({ page_id: pageId });
  console.log(response);
  console.log(response.properties)
}

const createPage = async () => {
  let parent = {
    type: 'database_id',
    database_id: 'fdae95c80f954bc595d659e8accbe15e'
  }
  let properties = {
    // Category: { type: 'multi_select', multi_select: [Array] },
    Name: {  type: 'title', title: [{text: {content: 'TEST'}}] },
    // Due: { type: 'date', date: null },
    // Label: { type: 'multi_select', multi_select: [] },
    // Status: {  type: 'select', select: null }
  }

  const resp = await notion.pages.create({
    parent, 
    properties
  })
  console.log(resp)
}

createPage();