const { createPage, getPageById, queryDatabase, updatePage } = require('./notion');
const moment = require('moment');

const parent = {
  type: 'database_id',
  database_id: 'fdae95c80f954bc595d659e8accbe15e'
}

function weekOfMonth(m) {
  return m.week() - moment(m).startOf('month').week();
}

const existingCheck = async (name) => {
  let database_id = 'fdae95c80f954bc595d659e8accbe15e'
  let filter = {
    and: [
      {
        property: 'Name',
        title: {
          contains: name,
        },
      },
      {
        property: 'Due',
        date: {
          on_or_after: moment().subtract(1, 'week').day(0).format('YYYY-MM-DD')
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
  let resp = queryDatabase({database_id, filter})
  return !!resp.results.length
}

const createJournal = async () => {
  if (existingCheck('Journal')) return
  let startDate = moment().day(4).format('YYYY-MM-DD')
  let properties = {
    Name: { type: 'title', title: [{ text: { content: 'Journal' } }] },
    Due: { type: 'date', date: { start: startDate } },
  }
  createPage(parent, properties)
}


const createClean = async () => {
  if (existingCheck('Clean')) return
  let roomArr = ['Kitchen', 'Bedroom', 'Bathroom']
  let room = roomArr[weekOfMonth(moment())]

  if (room) {
    let startDate = moment().day(3).format('YYYY-MM-DD')
    let properties = {
      Name: { type: 'title', title: [{ text: { content: `Clean - ${room}` } }] },
      Due: { type: 'date', date: { start: startDate } },
    }
    createPage(parent, properties)
  }
}


const createPhotosTask = async () => {
  if (existingCheck('Photos')) return
  let database_id = 'fdae95c80f954bc595d659e8accbe15e'
  let filter = {
    and: [
      {
        property: 'Parent item',
        relation: {
          contains: 'ef1c3b3fc51448f5bb9708fc0138d9d5',
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
  let sorts = [
    {
      property: 'Name',
      direction: 'descending',
    },
  ]
  let resp = await queryDatabase({ database_id, filter, sorts })
  let latest = resp.results[0]
  let properties = {
    Due: {
      date: { start: moment().day(2).format('YYYY-MM-DD') }
    }
  }
  updatePage({page_id: latest.id, properties})

}

(async function start() {
  // createJournal();
  // createClean();
  createPhotosTask()
})();


