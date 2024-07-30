const { createPage, getPageById, queryDatabase, updatePage, buildProperties } = require('./notion');
const moment = require('moment');
const tasks = require('./tasks');
const { listEvents } = require('./google');

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


const existingCheck = async ({name, category}) => {
  // console.log(name, category)
  const sorts = [
    {
      property: 'Name',
      direction: 'descending',
    },
  ]
  let filter = {
    and: [
      {
        or: [
          ...(name ? [{
            property: 'Name',
            title: {
              contains: name,
            },
          }]: []),
          ...(category ? [{
            property: 'Category',
            "multi_select": {
              contains: category
            }
          }] : []),
        ]
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
  // console.log(resp)
  return resp.results
}

const _createUpdateTask = async (props) => {
  let filter = props.filter ?? { name: props.name }
  let existingTasks = await existingCheck(filter);
  if (props.keepName) delete props.name
  props.scheduled = day;
  const properties = buildProperties(props)
  if (existingTasks.length) {
    await updatePage({ page_id: existingTasks[0].id, properties })
  }
  else {
    await createPage(parent, properties)
  }
}


const _genericTaskHandler = async (props) => {
  if (props.disabled) return;
  
  for (let day of props.day) {
    let perDay = props.perDay || 1;
    for (let i = 0; i < perDay; i++) {
      await _createUpdateTask(props);
    }
    
  }


}

_syncCalendarEvents = async () => {
  let events = await listEvents();
  if (!events || !events.length) return
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
  // await _syncCalendarEvents();

})();


