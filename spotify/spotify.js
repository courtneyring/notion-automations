const { createPage } = require('./notion')
const albums = require('./spotify.json');


const parent = {
    type: 'database_id',
    database_id: 'fdae95c80f954bc595d659e8accbe15e'
}
const makePage = async (album) => {


    let fields = {
        Name: { type: 'title', title: [{ text: { content: album.name } }] },
        // Description: { type: 'title', title: [{ text: { content: album.id } }] },
        URL: { type: 'url', url: album.url },
        Category: { type: 'multi_select', multi_select: [{name: 'Spotify'}] }
    }



    await createPage(parent, fields)
}

const start = async () => {
    console.log(albums.length);
    for (let album of albums) {
        console.log(album.name)
        await makePage(album)
    }
}

start();