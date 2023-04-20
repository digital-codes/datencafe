/** 
 * check if we can access the url without or with regular CORS settings
 * return false on cors error or other error
 */
import { UserStore } from "@/services/UserStore";
const userStore = UserStore()

export default async (url: string, type="csv", proxy = false, geoCheck = false) => {
    console.log("test fetch:",proxy,geoCheck)
    const hdrs = new Headers();
    /*
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', '1234abcd');
    */
    if (proxy) {
        if (userStore.exists()) {
            hdrs.append('Authorization', "Bearer " + userStore.getToken());
            if (window.location.hostname.includes("localhost"))
                url = "http://localhost:9000/php/corsProxyExec.php?url=" + url + "&type=" + type
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
        // we have a type already set int he reques
        // let type = "json"
        // separate type handling
        const mime = await r.headers.get('Content-Type')
        console.log("hdrs:",mime)
        let data
        switch (type) {
            case "json":
                if (geoCheck) {
                    console.log("Geocheck")
                    // check geojson content
                    const content = await r.json()
                    data = content
                    if ((Object.keys(content).includes("type")) && (content.type.toLowerCase() == "FeatureCollection".toLowerCase() )) {
                        type = "geojson"
                        console.log("Geojson")
                    }
                }
                break
            case "xls":
                // https://stackoverflow.com/questions/56151816/how-to-load-and-parse-xlsx-file-using-fetch-api-and-xlsx-library
                data = await r.arrayBuffer()
                break
            case "csv":
                data = r.json()
                break

        }
        // check if we had had a proxy access
        const result: any = {success:true,status:type,data:data,mime:mime}
        if (proxy) {
            result.url = url
        } 
        return result
    } catch (e) {
        console.log("Failed:", e)
        return {success:false,status:String(e)}
    }
}

