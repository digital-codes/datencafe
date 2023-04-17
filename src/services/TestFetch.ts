/** 
 * check if we can access the url without or with regular CORS settings
 * return false on cors error or other error
 */
import { UserStore } from "@/services/UserStore";
const userStore = UserStore()

export default async (url: string, proxy = false, geoCheck = false) => {
    console.log("test fetch:",proxy,geoCheck)
    const hdrs = new Headers();
    /*
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', '1234abcd');
    */
    if (proxy) {
        if (userStore.exists()) {
            hdrs.append('Authorization', "Bearer " + userStore.getToken());
            if (location.hostname.includes("localhost"))
                url = "http://localhost:9000/php/corsProxyExec.php?url=" + url
            else
                url = "/php/corsProxyExec.php?url=" + url

        } else {
            return {success:false,status:"No token"}
        }
    }
    const options = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors" as RequestMode, // no-cors, *cors, same-origin
        cache: "no-cache" as RequestCache, // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: "same-origin", // include, *same-origin, omit
        headers: hdrs,
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
        // check if we had had a proxy access
        const result: any = {success:true,status:type}
        if (proxy) {
            result.url = url
        } 
        return result
    } catch (e) {
        console.log("Failed:", e)
        return {success:false,status:String(e)}
    }
}

