const { createPage, getPageById, queryDatabase, updatePage, buildProperties } = require('./notion');
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
  const properties = buildProperties(props)
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
    const properties = buildProperties(props)
    await createPage(parent, properties)
  }
}


(async function start() {

  for (let task of tasks) {
    await _genericTaskHandler(task)   
  }
  await _syncCalendarEvents();

})();


