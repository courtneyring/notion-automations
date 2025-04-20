const fs = require('fs');



const getYelpBiz = async (restaurant) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer 2k0g61aL7OBlw72ubr2w7P1AUqfkSN_piMDGZEqyTSBtz1cklnXvZH-H7DJ1NUx0wSAQDO_Rt3qse23aekT8ckEHSz5NI8FfwspbQoBoYtP3KHc52UTrsciZraTlZnYx'
        }
    };

    let resp = await fetch(`https://api.yelp.com/v3/businesses/${restaurant.alias}`, options);
    let data = await resp.json();
    console.log(data);
    return data
}

const getNeighborhood = async (restaurant) => {

    let resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}&key=AIzaSyAFBFusgZHpLL5j6M4z2J9rDuvfIgtHZrY&result_type=neighborhood`);
    let data = await resp.json();
    let neighborhood = data.results && data.results.length ? data.results[0].address_components[0].long_name : '';
    console.log(neighborhood)
    return neighborhood;
}

(async function start() {


    let restaurants = JSON.parse(fs.readFileSync('restaurants-s2.json'));
    let arr = []
    // for (let restaurant of restaurants) {
    //     let data = await getYelpBiz(restaurant);
    //     arr.push(data)
    // }
    // fs.writeFileSync('restaurants-s2.json', JSON.stringify(arr));

    for (let restaurant of restaurants) {
        if (restaurant.error || !restaurant.coordinates) continue;
        let neighborhood = await getNeighborhood(restaurant);
        // let data = await getYelpBiz(restaurant);
        restaurant.location['neighborhood'] = neighborhood;
        restaurant['visited'] = true
        arr.push(restaurant);
    }

    fs.writeFileSync('restaurants-s3.json', JSON.stringify(arr));




})();