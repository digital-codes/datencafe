/** 
 * check if we can access the url without or with regular CORS settings
 * return false on cors error or other error
 */

export default async (url: string) => {
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
        return r.status == 200 ? true : false
    } catch (e) {
        console.log("Failed:", e)
        return false
    }
}

