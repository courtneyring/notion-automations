const { Client } = require("@notionhq/client")
const dotenv = require('dotenv');
dotenv.config();

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const getUsers = async () => {
  const listUsersResponse = await notion.users.list({})
  // console.log(listUsersResponse)
}

const getDatabaseById = async (database_id) => {
  const db = await notion.databases.query({
    // database_id: 'fdae95c80f954bc595d659e8accbe15e'
    database_id
  })
  // console.log(db)
}

const getPageById = async () => {
  let page_id = 'd5aee65102d640efa37113c29ce99634'
  const response = await notion.pages.retrieve({ page_id });
  console.log(response);
  console.log(response.properties.Category.multi_select)
}

const createPage = async (parent, properties) => {
  const resp = await notion.pages.create({
    parent,
    properties
  })
  // console.log(resp)
}

const queryDatabase = async ({ database_id, filter, sorts }) => {
  const response = await notion.databases.query({
    database_id,
    filter,
    sorts
  })
  // console.log(response.results[0])
  return response
}

const updatePage = async ({ page_id, properties }) => {
  const response = await notion.pages.update({
    page_id,
    properties,
  });
}

const buildProperties = (props) => {
  let formatted = {
    ...(props.name && { Name: { type: 'title', title: [{ text: { content: props.name } }] } }),
    ...(props.scheduled && { Scheduled: { type: 'date', date: { start: moment().day(props.scheduled).format('YYYY-MM-DD') } } }),
    ...(props.categories && { Category: { type: 'multi_select', multi_select: props.categories.map(_mapCategories) } }),
    ...(props.gid && { gid: { type: 'rich_text', rich_text: [{ text: { content: props.gid } }] } })

  }
  return formatted
}



// getPageById();

module.exports = {
  createPage,
  getPageById,
  queryDatabase,
  updatePage,
  buildProperties
}
