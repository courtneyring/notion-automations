const {
  createPage,
  getPageById,
  queryDatabase,
  updatePage,
  buildProperties,
  buildIcon,
} = require("../notion");
const moment = require("moment");
const tasks = require("./tasks");
const workouts = require("./workouts");
const { listEvents } = require("../google");
const readline = require("readline");

// Create an interface for input and output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

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
    type: "database_id",
    database_id: "fdae95c80f954bc595d659e8accbe15e",
  },
};
const workoutConfig = {
  ignoreExisting: true,
  parent: {
    type: "database_id",
    database_id: "1a3de2a9118180d19be0f7540c5b8926",
  },
};

let config = null;

function weekOfMonth(m) {
  return m.week() - moment(m).startOf("month").week();
}

const _mapCategories = (category) => {
  return { name: category };
};

const existingCheck = async ({ name, category, sort }) => {
  // console.log(name, category)
  const sorts = [
    {
      property: sort,
      direction: "descending",
    },
  ];
  let filter = {
    and: [
      {
        or: [
          ...(name
            ? [
                {
                  property: "Name",
                  title: {
                    contains: name,
                  },
                },
              ]
            : []),
          ...(category
            ? [
                {
                  property: "Category",
                  multi_select: {
                    contains: category,
                  },
                },
              ]
            : []),
        ],
      },

      {
        or: [
          {
            property: "Scheduled",
            date: {
              on_or_before: moment().startOf("week").format("YYYY-MM-DD"),
            },
          },
          {
            property: "Scheduled",
            date: {
              is_empty: true,
            },
          },
        ],
      },
      {
        property: "Status",
        status: {
          does_not_equal: "Done",
        },
      },
    ],
  };
  let resp = await queryDatabase({
    database_id: config.parent.database_id,
    filter,
    sorts,
  });
  // console.log(resp)
  return resp.results;
};

const _createUpdateTask = async (props, day) => {
  let filter = props.filter ?? { name: props.name };
  filter["sort"] = props.sort || "Name";
  let existingTasks = !config.ignoreExisting ? await existingCheck(filter) : [];
  if (props.keepName) delete props.name;
  props.scheduled = day;
  const properties = buildProperties(props);
  const icon = props.icon ? buildIcon(props.icon) : null;
  if (existingTasks.length) {
    await updatePage({ page_id: existingTasks[0].id, properties });
  } else {
    await createPage({ parent: config.parent, properties, icon });
  }
};

const _genericTaskHandler = async ({ props, exclude }) => {
  if (props.disabled) return;
  const days = props.day.filter((d) => !exclude.includes(d));

  for (let day of days) {
    let perDay = props.perDay || 1;
    for (let i = 0; i < perDay; i++) {
      await _createUpdateTask(props, day);
    }
  }
};

_syncCalendarEvents = async () => {
  let events = await listEvents();
  if (!events || !events.length) return;
  for (let event of events) {
    let props = {
      name: event.summary,
      scheduled: parseInt(
        moment(event.start.dateTime || event.start.date).format("d")
      ),
      categories: ["Google Calendar"],
      gid: event.id,
    };
    const properties = buildProperties(props);
    await createPage(config.parent, properties);
  }
};

const getRunningVars = async () => {
  const week = await askQuestion("Week A or B? ");
  const long = await askQuestion("Long ");
  const threshold = await askQuestion("Tempo ");
  const pace = await askQuestion("Pace ");
  const easy = await askQuestion("Easy ");
  const wildcard = await askQuestion("Wildcard ");
  return { week, long, threshold, pace, easy, wildcard };
};

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const formatWorkouts = ({ runningVars, workouts }) => {
  const week = workouts[runningVars["week"]];
  for (let [key, value] of Object.entries(runningVars)) {
    let curr = week.find((w) => w.id === key);
    if (curr) {
      curr.name = `${capitalizeFirstLetter(curr.id)} - ${value}${
        curr.id === "tempo" ? "min" : curr.id === "wildcard" ? "" : "mi"
      }`;
    }
  }
  return week;
};

(async function start() {
  const week = await askQuestion("Week A or B? ");
  const excludeArr = await askQuestion("Skip Days? (ie 3, 4, 5) ");
  const exclude = excludeArr.split(", ").map((i) => parseInt(i)) || null;
  // const runningVars = await getRunningVars();

  config = taskConfig;
  for (let task of tasks) {
    await _genericTaskHandler({ props: task, exclude });
  }

  config = workoutConfig;
  // const workoutsModified = formatWorkouts({ runningVars, workouts });
  for (let workout of workouts[week]) {
    await _genericTaskHandler({ props: workout, exclude });
  }
  // await _syncCalendarEvents();
})();
