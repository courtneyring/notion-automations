const { createPage, getPageById, queryDatabase, updatePage } = require('./notion');
const moment = require('moment');

const parent = {
  type: 'database_id',
  database_id: 'fdae95c80f954bc595d659e8accbe15e'
}
const database_id = 'fdae95c80f954bc595d659e8accbe15e'

function weekOfMonth(m) {
  return m.week() - moment(m).startOf('month').week();
}

const existingCheck = async (name) => {
  let filter = {
    and: [
      {
        property: 'Name',
        title: {
          contains: name,
        },
      },
      {
        property: 'Scheduled',
        date: {
          on_or_before: moment().format('YYYY-MM-DD')
        }
      },
      {
        property: 'Status',
        status: {
          does_not_equal: 'Done'
        }
      }
    ],
  }
  let resp = await queryDatabase({database_id, filter})
  console.log(resp)
  return resp.results
}

const createJournal = async () => {
  let startDate = moment().day(4).format('YYYY-MM-DD')
  let properties = {
    Name: { type: 'title', title: [{ text: { content: 'Journal' } }] },
    Scheduled: { type: 'date', date: { start: startDate } },
    Category: {type: 'multi_select', multi_select: [{name: 'Photos'}] }
  }

  let existingTasks = await existingCheck('Journal');
  if (existingTasks.length) {
    await updatePage({ page_id: existingTasks[0].id, properties })
    console.log('Updated Journal Page')
  }
  else {
    createPage(parent, properties)
    console.log('Created Journal Page')
  }
  
}


const createClean = async () => {
  if (await existingCheck('Clean')) {
    console.log('Clean Task Exists')
    return
  }
  let roomArr = ['Kitchen', 'Bedroom', 'Bathroom']
  let room = roomArr[weekOfMonth(moment())]

  if (room) {
    let startDate = moment().day(3).format('YYYY-MM-DD')
    let properties = {
      Name: { type: 'title', title: [{ text: { content: `Clean - ${room}` } }] },
      Due: { type: 'date', date: { start: startDate } },
    }
    createPage(parent, properties)
    console.log('Created Clean Task')
  }
  console.log('No Clean Task Created')
}

const _findNext = async () => {
  const sorts = [
    {
      property: 'Name',
      direction: 'descending',
    },
  ]

  let filter = {
    and: [
      {
        property: 'Category',
        multi_select: {
          contains: 'Photos',
        },
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
  let next = resp.results[0]
  return next
}

const createPhotosTask = async () => {
  const properties = {
    Scheduled: {
      date: { start: moment().day(3).format('YYYY-MM-DD') }
    }
  }
  let existingTasks = await existingCheck('Photos');
  let pageToUpdate = existingTasks.length > 0 ? existingTasks[0] : await _findNext();
  await updatePage({ page_id: pageToUpdate.id, properties})
  console.log('Updated Photos Task')
}

const _createPrs = () => {
  let properties = {
    Name: { type: 'title', title: [{ text: { content: 'PRs' } }] },
    Category: { type: 'multi_select', multi_select: [{ name: 'Work' }] }
  }

  for (let i = 1; i < 6; i++) {
    properties['Scheduled'] = { type: 'date', date: { start: moment().day(i).format('YYYY-MM-DD') } },
      createPage(parent, properties)
  }
}

const _createTimesheets = () => {
  let properties = {
    Name: { type: 'title', title: [{ text: { content: 'Timesheets' } }] },
    Scheduled: { type: 'date', date: { start: moment().day(1).format('YYYY-MM-DD') } },
    Category: { type: 'multi_select', multi_select: [{ name: 'Work' }] }
  }
  createPage(parent, properties)
}

const _createAttendance = () => {
  let properties = {
    Name: { type: 'title', title: [{ text: { content: 'Attendance' } }] },
    Scheduled: { type: 'date', date: { start: moment().day(1).format('YYYY-MM-DD') } },
    Category: { type: 'multi_select', multi_select: [{ name: 'Work' }] }
  }
  for (let i = 1; i <=2; i++) {
    properties['Scheduled'] = { type: 'date', date: { start: moment().day(i).format('YYYY-MM-DD') } },
    createPage(parent, properties)
  }
}

const createWorkTasks = async () => {
  
  _createPrs();
  _createTimesheets();
  _createAttendance();

}

(async function start() {
  createWorkTasks();
  // createJournal();
  // createClean();
  // createPhotosTask()
})();


