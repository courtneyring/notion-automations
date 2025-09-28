const fs = require("fs");
const { buildProperties, createPage } = require("../notion");
const dataPath = "/Users/courtneyring/Documents/health-export/export.json";
const moment = require("moment");

const parent = {
  type: "database_id",
  database_id: "22ade2a911818044956fcba12789589a",
};
// https://www.notion.so/a93d2d2e68d841148d9f6e4b5f6ece81?v=e0134d7876284927a62592c68340322b&pvs=4
const requiredProps = [
  { prop: "duration", field: "Duration", type: "number" },
  { prop: "id", field: "id", type: "string" },
  { prop: "type", field: "Type", type: "string" },
  { prop: "start", field: "start", type: "string" },
  { prop: "end", field: "end", type: "string" },
  { prop: "location", field: "Location", type: "string" },
  { prop: "distance", field: "Distance (mi)", type: "numWithUnits" },
  {
    prop: "activeEnergyBurned",
    field: "Active Energy (kcal)",
    type: "numWithUnits",
  },
  { prop: "temperature", field: "Temperature (F)", type: "numWithUnits" },
  { prop: "humidity", field: "Humidity (%)", type: "numWithUnits" },
  { prop: "intensity", field: "Intensity (kcal/hr*kg)", type: "numWithUnits" },
];

const formatDate = (dateString) => {
  let arr = dateString.split(" ");
  arr.pop();
  return moment(arr.join(" ")).toISOString();
};

const formatFields = (runs) => {
  let formatted = runs.map((run) => {
    let obj = {};
    for (let [key, value] of Object.entries(run)) {
      let guide = requiredProps.find((p) => p.prop == key);
      if (!guide) continue;

      if (guide.type == "string" || guide.type == "number") {
        obj[guide.field] = { value, type: guide.type };
      } else if (guide.type == "numWithUnits") {
        obj[guide.field] = { value: value.qty, type: "number" };
      }
    }
    formatDate(obj.start.value);
    obj["Date"] = {
      value: {
        start: formatDate(obj.start.value),
        end: formatDate(obj.end.value),
      },
      type: "date",
    };
    obj["id"].type = "title";
    delete obj.start;
    delete obj.end;
    return obj;
  });

  return formatted;
};

const start = () => {
  //   let json = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  //   let runs = json.data.workouts.filter((d) => d.name.includes("Run"));
  //   let runsMapped = formatFields(runs);
  //   console.log(runsMapped);

  //   for (let run of runsMapped) {
  //     let props = buildProperties2(run);
  //     // console.log(props)
  //     // createPage(parent, props)
  //   }

  const runTypes = ["Long", "Easy", "Pace", "Tempo", "Wildcard"];
  for (let i = 0; i < 17; i++) {
    for (let runType of runTypes) {
      let obj = { name: `Week ${i + 1} - ${runType}` };
      let properties = buildProperties(obj);
      console.log(parent);
      createPage({ parent, properties });
    }
  }
};

start();
