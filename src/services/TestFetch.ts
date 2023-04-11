/** 
 * check if we can access the url without or with regular CORS settings
 * return false on cors error or other error
 */

export default async (url: string, geoCheck = false) => {
    console.log("test fetch")
    const options = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors" as RequestMode, // no-cors, *cors, same-origin
        cache: "no-cache" as RequestCache, // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: "same-origin", // include, *same-origin, omit
        /*
        headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        */
        redirect: "follow" as RequestRedirect, // manual, *follow, error
    }
    try {
        const r = await fetch(url, options)
        console.log("Status:", r.status)
        if (r.status != 200) return {success:false,status:r.text()}
        let type = "json"
        if (geoCheck) {
            console.log("Geocheck")
            // check geojson content
            const content = await r.json()
            if ((Object.keys(content).includes("type")) && (content.type.toLowerCase() == "FeatureCollection".toLowerCase() )) {
                type = "geojson"
                console.log("Geojson")
            }
        }
        return {success:true,status:type}
    } catch (e) {
        console.log("Failed:", e)
        return {success:false,status:String(e)}
    }
}

