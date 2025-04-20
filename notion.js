
// import { Client } from "@notionhq/client";
// import dotenv from "dotenv";
// import moment from "moment";

const { Client } = require("@notionhq/client")
const moment = require('moment');
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
  // https://www.notion.so/AMP-d-1acde2a91181805a874acdd7b69e12c3?pvs=4
  // https://www.notion.so/test-7ec2f8601c6542efb33cb3ac61f22488?pvs=4
  let page_id = '1acde2a91181805a874acdd7b69e12c3'
  const response = await notion.pages.retrieve({ page_id });
  console.log(response);
  // console.log(response.properties.Category.multi_select)
}

const createPage = async ({parent, properties, children, icon}) => {
  const resp = await notion.pages.create({
    parent,
    properties, 
    children,
    icon
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


const _mapCategories = (category) => {
  return { name: category }
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

const buildIcon = (icon) => {
  let formatted = {
    "type": "external",
    "external": {
      "url": icon
    }
  }
  return formatted
}

const buildProperties2 = (props) => {

  let formatted = {};
  for (let [key, value] of Object.entries(props)) {
    if (value.type == 'string') {
      formatted[key] = { rich_text: [{ text: { content: value.value } }] }
    }
    else if (value.type == 'number') {
      formatted[key] = { number: value.value }
    }
    else if (value.type == 'date') {
      formatted[key] = {type: 'date', date: {start: value.value.start, end: value.value.end}}
    }
    else if (value.type == 'title') {
      formatted[key] = { type: 'title', title: [{ text: { content: value.value } }] }
    }
    
  }
  return formatted;

}

// export default createPage;
// getPageById();

module.exports = {
  createPage,
  getPageById,
  queryDatabase,
  updatePage,
  buildProperties,
  buildProperties2,
  buildIcon

}
