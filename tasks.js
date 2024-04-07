const moment = require('moment');
const rooms = ['Kitchen', 'Bedroom', 'Bathroom']

module.exports = (() => {
  return [
    {
      name: 'Full View',
      scheduled: 3,
      categories: ['Weeklys']
    },
    {
      name: 'Attendance',
      scheduled: 1,
      categories: ['Work']
    },
    {
      name: 'Attendance',
      scheduled: 2,
      categories: ['Work']
    },
    {
      name: 'Timesheets',
      scheduled: 1,
      categories: ['Work']
    },
    {
      name: 'PRs',
      scheduled: 1,
      categories: ['Work']
    },
    {
      name: 'PRs',
      scheduled: 2,
      categories: ['Work']
    },
    {
      name: 'PRs',
      scheduled: 3,
      categories: ['Work']
    },
    {
      name: 'PRs',
      scheduled: 4,
      categories: ['Work']
    },
    {
      name: 'PRs',
      scheduled: 5,
      categories: ['Work']
    },
    {
      name: 'Journal',
      scheduled: 4,
      categories: ['Weeklys']
    },
    {
      name: 'Photos',
      scheduled: 3,
      categories: ['Photos', 'Weeklys'],
      keepName: true
    }, 
    {
      name: `Clean - ${rooms[moment().week() % 3]}`,
      scheduled: 3,
      categories: ['Weeklys'],
    }, 

  ]
})();
