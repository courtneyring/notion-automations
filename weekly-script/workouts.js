const moment = require("moment");

module.exports = (() => {
  const icons = {
    pace: "https://www.notion.so/icons/circle-alternate_blue.svg",
    strength: "https://www.notion.so/icons/gym_gray.svg",
    hiit: "https://www.notion.so/icons/watch-analog_gray.svg",
    tempo: "https://www.notion.so/icons/circle-alternate_yellow.svg",
    cross: "https://www.notion.so/icons/shuffle_gray.svg",
    wildcard: "https://www.notion.so/icons/circle-alternate_purple.svg",
    long: "https://www.notion.so/icons/circle-alternate_red.svg",
    easy: "https://www.notion.so/icons/circle-alternate_green.svg",
  };

  return {
    b: [
      //   {
      //     name: "Pace Run - 5mi @ 9:40",
      //     day: [1],
      //     icon: icons["pace"],
      //     id: "pace",
      //   },
      {
        name: "Barre",
        day: [1],
        icon: icons["strength"],
      },
      {
        name: "AMD'd",
        day: [2],
        icon: icons["hiit"],
      },
      //   {
      //     name: "Tempo - 30min",
      //     day: [2],
      //     icon: icons["tempo"],
      //     id: "tempo",
      //   },

      {
        name: "Cycle",
        day: [3],
        icon: icons["cross"],
      },
      {
        name: "Strength - Lower",
        day: [3],
        icon: icons["strength"],
      },
      {
        name: "Strength - Upper",
        day: [4],
        icon: icons["strength"],
      },
      //   {
      //     name: "6x400",
      //     day: [4],
      //     icon: icons["wildcard"],
      //     id: "wildcard",
      //   },
      //   {
      //     name: "Long - 10mi",
      //     day: [5],
      //     icon: icons["long"],
      //     id: "long",
      //   },
      //   {
      //     name: "Easy",
      //     day: [7],
      //     icon: icons["easy"],
      //     id: "easy",
      //   },
    ],
    a: [
      //   {
      //     name: "Tempo - 30min",
      //     day: [1],
      //     icon: icons["tempo"],
      //     id: "tempo",
      //   },
      {
        name: "AMD'd",
        day: [1],
        icon: icons["hiit"],
      },
      {
        name: "Swim",
        day: [2],
        icon: icons["cross"],
      },
      {
        name: "Strength - Lower",
        day: [2],
        icon: icons["strength"],
      },
      {
        name: "Barre",
        day: [3],
        icon: icons["strength"],
      },
      //   {
      //     name: "Pace Run - 5mi @ 9:40",
      //     day: [3],
      //     icon: icons["pace"],
      //     id: "pace",
      //   },
      {
        name: "Cycle",
        day: [4],
        icon: icons["cross"],
      },
      {
        name: "Strength - Upper",
        day: [4],
        icon: icons["strength"],
      },
      //   {
      //     name: "Long - 10mi",
      //     day: [5],
      //     icon: icons["long"],
      //     id: "long",
      //   },

      //   {
      //     name: "Easy",
      //     day: [6],
      //     icon: icons["easy"],
      //     id: "easy",
      //   },
      //   {
      //     name: "Intervals",
      //     day: [7],
      //     icon: icons["wildcard"],
      //     id: "wildcard",
      //   },
    ],
  };
})();
