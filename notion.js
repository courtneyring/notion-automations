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

const getDatabaseById = async (database_id) => {
  const db = await notion.databases.query({
    // database_id: 'fdae95c80f954bc595d659e8accbe15e'
    database_id
  })
  console.log(db)
}

const getPageById = async () => {
  let page_id = 'be48d29280ad40f9b07ec47ad2eaea11'
  const response = await notion.pages.retrieve({ page_id });
  console.log(response);
  console.log(response.properties.Duration.rich_text)
}

const createPage = async (parent, properties) => {
  const resp = await notion.pages.create({
    parent,
    properties
  })
  console.log(resp)
}

const queryDatabase = async ({database_id, filter, sorts}) => {
  const response = await notion.databases.query({
    database_id,
    filter, 
    sorts
  })
  console.log(response.results[0])
  return response
}

const updatePage = async ({page_id, properties}) => {
  const response = await notion.pages.update({
    page_id,
    properties,
  });
}

module.exports = {
  createPage,
  getPageById,
  queryDatabase, 
  updatePage
}