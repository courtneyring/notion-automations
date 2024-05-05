const { createPage, getPageById, queryDatabase, updatePage } = require('./notion');
const moment = require('moment');
const tasks = require('./tasks');
const {listEvents} = require('./google');

const parent = {
  type: 'database_id',
  database_id: 'fdae95c80f954bc595d659e8accbe15e'
}
const database_id = 'fdae95c80f954bc595d659e8accbe15e'

function weekOfMonth(m) {
  return m.week() - moment(m).startOf('month').week();
}


const _mapCategories = (category) => {
  return { name: category }
}

const _buildProperties = (props) => {
  let formatted = {
    ...(props.name && { Name: { type: 'title', title: [{ text: { content: props.name } }] } }),
    ...(props.scheduled && { Scheduled: { type: 'date', date: { start: moment().day(props.scheduled).format('YYYY-MM-DD') } } }),
    ...(props.categories && { Category: { type: 'multi_select', multi_select: props.categories.map(_mapCategories) } }),
    ...(props.gid && { gid: { type: 'rich_text', rich_text: [{text: {content:props.gid}}] } })

  }
  return formatted
}


const existingCheck = async (name) => {
  const sorts = [
    {
      property: 'Name',
      direction: 'descending',
    },
  ]
  let filter = {
    and: [
      {
        property: 'Name',
        title: {
          contains: name,
        },
      },
      {
        or: [
          {
            property: 'Scheduled',
            date: {
              on_or_before: moment().format('YYYY-MM-DD')
            }
          },
          {
            property: 'Scheduled',
            date: {
              is_empty: true
            }
          },
        ],
      },
      {
        property: 'Status',
        status: {
          does_not_equal: 'Done'
        }
      }
    ],
  }
  let resp = await queryDatabase({ database_id, filter, sorts })
  console.log(resp)
  return resp.results
}


const _genericTaskHandler = async (props) => {
  if (props.disabled) return;
  let existingTasks = await existingCheck(props.name);
  if (props.keepName) delete props.name
  const properties = _buildProperties(props)
  if (existingTasks.length) {
    await updatePage({ page_id: existingTasks[0].id, properties })
  }
  else {
    createPage(parent, properties)
  }

}

_syncCalendarEvents = async () => {
  let events = await listEvents();
  console.log(events)
  for (let event of events) {
    let props = {
      name: event.summary,
      scheduled: parseInt(moment(event.start.dateTime || event.start.date).format('d')),
      categories: ['Google Calendar'], 
      gid: event.id
    }
    const properties = _buildProperties(props)
    await createPage(parent, properties)
  }
}


(async function start() {

  for (let task of tasks) {
    await _genericTaskHandler(task)   
  }
  await _syncCalendarEvents();

})();


