const moment = require('moment');
const rooms = ['Kitchen', 'Bedroom', 'Bathroom']

module.exports = (() => {
  return [
    {
      disabled: moment().date() < 15 || moment().date() >= 22,
      name: `Full View - ${moment().subtract(1, 'month').format('MMM')}`,
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
      name: 'Journal',
      scheduled: 5,
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
      disabled: moment().date() < 24 || moment().date() > 30,
      name: 'CC & Cell Phone',
      scheduled: 1,
      categories: ['Weeklys']
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
