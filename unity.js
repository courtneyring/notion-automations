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


  let resp = await fetch('https://learn.unity.com/api/learn/project/612f9602edbc2a1b588a3af3/extends?edit=false&missionId=5f77cc6bedbc2a4a1dbddc46&pathwayId=5f7bcab4edbc2a0023e9c38f&contentId=65451ee5edbc2a24e6ec5e3a&uv=2021.3');
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