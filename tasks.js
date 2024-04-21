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
      name: 'Emails',
      scheduled: 1,
      categories: ['Weeklys']
    },
    {
      disabled: moment().date() > 7,
      scheduled: 3,
      name: `Photos - ${moment().subtract(1, 'month').format('YYYY-MM')
        }`,
      categories: ['Photos'],
    },
    {
      name: 'Photos',
      disabled: moment().date() <= 7,
      scheduled: 3,
      categories: ['Photos', 'Weeklys'],
      keepName: true
    },
    {
      name: `Clean - ${rooms[moment().week() % 3]}`,
      scheduled: 3,
      categories: ['Weeklys'],
    }, 
    {
      disabled: moment().date() < 24,
      name: 'CC & Cell Phone',
      scheduled: 1,
      categories: ['Weeklys']
    }

  ]
})();
