const moment = require('moment');
const rooms = ['Kitchen', 'Bedroom', 'Bathroom']

module.exports = (() => {
  return [
    {
      disabled: moment().date() < 15 || moment().date() >= 22,
      name: `Full View - ${moment().subtract(1, 'month').format('MMM')}`,
      day: [3],
      categories: ['Weeklys']
    },
    {
      name: 'Attendance',
      day: [1, 2],
      categories: ['Work']
    },
    {
      name: 'Timesheets',
      day: [1],
      categories: ['Work']
    },
    {
      name: 'Journal',
      day: [5],
      categories: ['Weeklys']
    },
    {
      name: 'Emails',
      day: [1],
      categories: ['Weeklys']
    },
    {
      disabled: moment().date() > 7,
      day: [3],
      name: `Photos - ${moment().subtract(1, 'month').format('YYYY-MM')
        }`,
      categories: ['Photos', 'Weeklys'],
    },
    {
      name: 'Photos',
      disabled: moment().date() <= 7,
      day: [3],
      categories: ['Photos', 'Weeklys'],
      keepName: true
    },
    {
      name: `Clean - ${rooms[moment().week() % 3]}`,
      day: [4],
      categories: ['Weeklys'],
    }, 
    {
      disabled: moment().date() < 24 || moment().date() > 30,
      name: 'CC & Cell Phone',
      day: [1],
      categories: ['Weeklys']
    }, 
    {
      name: 'Broadway, Job Search',
      day: [1, 2, 3, 4, 5],
      categories: ['Dailys']
    }, 
    // {
    //   name: 'Water Prayer Plant, Corn Plant, and Rubber Tree',
    //   scheduled: 1,
    //   categories: ['Weeklys'],
    //   disabled: !(moment().week() % 2)
    // },
    // {
    //   name: 'Water Ponytail Palm',
    //   scheduled: 1,
    //   categories: ['Weeklys'],
    //   disabled: moment().week() % 4
    // }

  ]
})();
