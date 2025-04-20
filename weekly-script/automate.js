const { createPage, getPageById, queryDatabase, updatePage, buildProperties, buildIcon } = require('../notion');
const moment = require('moment');
const tasks = require('./tasks');
const workouts = require('./workouts');
const { listEvents } = require('../google');

// const master_database_id = 'fdae95c80f954bc595d659e8accbe15e'
// const workouts_database_id = '1a3de2a9118180d19be0f7540c5b8926'

// https://www.notion.so/1a3de2a9118180d19be0f7540c5b8926?v=1a3de2a91181800cb1d8000c1fc43b35&pvs=4
// let database_id = null;
// let ignoreExisting = false;

// const parent = {
//   type: 'database_id',
//   database_id: database_id
// }

const taskConfig = {
  ignoreExisting: false,
  parent: {
    type: 'database_id',
    database_id: 'fdae95c80f954bc595d659e8accbe15e'
  }
}
const workoutConfig = {
  ignoreExisting: true,
  parent: {
    type: 'database_id',
    database_id: '1a3de2a9118180d19be0f7540c5b8926'
  }
}

let config = null;

function weekOfMonth(m) {
  return m.week() - moment(m).startOf('month').week();
}


const _mapCategories = (category) => {
  return { name: category }
}


const existingCheck = async ({name, category, sort}) => {
  // console.log(name, category)
  const sorts = [
    {
      property: sort,
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
              on_or_before: moment().startOf('week').format('YYYY-MM-DD')
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
  let resp = await queryDatabase({ database_id: config.parent.database_id, filter, sorts })
  // console.log(resp)
  return resp.results
}

const _createUpdateTask = async (props, day) => {
  let filter = props.filter ?? { name: props.name}
  filter['sort'] = props.sort || 'Name'
  let existingTasks = !config.ignoreExisting ? await existingCheck(filter) : [];
  if (props.keepName) delete props.name
  props.scheduled = day;
  const properties = buildProperties(props)
  const icon = props.icon ? buildIcon(props.icon): null;
  if (existingTasks.length) {
    await updatePage({ page_id: existingTasks[0].id, properties })
  }
  else {
    await createPage({parent: config.parent, properties, icon})
  }
}


const _genericTaskHandler = async (props) => {
  if (props.disabled) return;
  
  for (let day of props.day) {
    let perDay = props.perDay || 1;
    for (let i = 0; i < perDay; i++) {
      await _createUpdateTask(props, day);
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
    await createPage(config.parent, properties)
  }
}


(async function start() {
  if (!process.argv[2]) {
    console.log('Specify a or b Week')
    return
  }

  // for (let task of tasks) {
  //  config = taskConfig;
  //   await _genericTaskHandler(task)
  // }

  for (let workout of workouts[process.argv[2]]) {
    config = workoutConfig;
    await _genericTaskHandler(workout)
  }
  // await _syncCalendarEvents();

})();


