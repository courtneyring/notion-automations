const moment = require('moment');
const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Office']

module.exports = (() => {
  return [
    {
      name: 'Attendance',
      day: [1, 2],
      categories: ['Work']
    },
    // {
    //   name: 'PRs',
    //   day: [1, 2, 3, 4, 5],
    //   categories: ['Work']
    // },
    {
      name: 'Timesheets',
      day: [5],
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
    // {
    //   disabled: moment().date() > 7,
    //   day: [3],
    //   name: `Photos - ${moment().subtract(1, 'month').format('YYYY-MM')
    //     }`,
    //   categories: ['Photos', 'Weeklys'],
    // },
    // {
    //   name: 'Photos',
    //   disabled: moment().date() <= 7,
    //   day: [3],
    //   categories: ['Photos', 'Weeklys'],
    //   keepName: true
    // },
    {
      name: 'Spotify',
      day: [1, 2, 3, 4, 5],
      categories: ['Spotify'],
      keepName: true, 
      perDay: 15,
      filter: {category: 'Spotify'}, 
      sort: 'Name Trimmed'
    },
    // {
    //   name: `Clean - Bathroom`,
    //   day: [5],
    //   categories: ['Matt'],
    //   disabled: moment().week() % 4 != 0
    // }, 
    // {
    //   name: `Sheets`,
    //   day: [5],
    //   categories: ['Matt'],
    //   disabled: (moment().week() +2) % 4 != 0
    // }, 
    {
      name: `Clean - ${rooms[moment().week() % rooms.length]}`,
      day: [5],
      categories: ['Weeklys'],
    }, 
    // {
    //   disabled: moment().date() < 24 || moment().date() > 30,
    //   name: 'CC & Cell Phone',
    //   day: [1],
    //   categories: ['Weeklys']
    // }, 
    {
      name: 'Broadway',
      day: [1, 2, 3, 4, 5],
      categories: ['Dailys']
    },
    // {
    //   name: 'Job Search',
    //   day: [1, 2, 3, 4, 5],
    //   categories: ['Dailys']
    // },
  ]
})();
