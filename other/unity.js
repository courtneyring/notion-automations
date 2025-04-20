const { createPage } = require('./notion')


const makePage = ({ pathway, mission, project, tutorial, missionIdx, projectIdx, tutorialIdx }) => {

  const parent = {
    type: 'database_id',
    database_id: 'fdae95c80f954bc595d659e8accbe15e'
  }
  let title = `${pathway.title} - 
          ${missionIdx + 1}. ${mission.title} - 
          ${projectIdx + 1}. ${project.title}
          ${tutorial ? ` - ${tutorialIdx + 1}. ${tutorial.title}` : ''}`
  console.log(title)
  let properties = {
    Name: { type: 'title', title: [{ text: { content: title } }] },
    Duration: { type: 'rich_text', rich_text: [{ text: { content: tutorial ? tutorial.duration.toString() : project.duration.toString()} }] }
  }
  createPage(parent, properties)
}

const getData = async () => {


  let resp = await fetch('https://learn.unity.com/api/learn/mission/5f71fe63edbc2a00200e9de0/extends?edit=false&missionId=5f71fe63edbc2a00200e9de0&pathwayId=5f7e17e1edbc2a5ec21a20af&contentId=5f7229b2edbc2a001f834db7');
  let data = await resp.json();

  let pathway = data.breadcrumb.root;
  // pathway.subNodes.forEach((node) => console.log(node.title))

  for (let [missionIdx, mission] of pathway.subNodes.entries()) {
    console.log(mission.title)
    for (let [projectIdx, project] of mission.subNodes.entries()) {
      console.log(mission.title, project.title)
      if (!project.subNodes) {
        makePage({ pathway, mission, project, missionIdx, projectIdx})
        continue
      }
        
      for (let [tutorialIdx, tutorial] of project.subNodes.entries()) {
        makePage({ pathway, mission, project, tutorial, missionIdx, projectIdx, tutorialIdx })
        // console.log(properties.Name.title[0].text.content)

      }
    }
  }


}

getData()