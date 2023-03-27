// string utils

import stringSimilarity from 'string-similarity';

export class StringUtils {
    // properties
    static _debug = true
    static print(x: string) {
        if (StringUtils.debug) {
            console.log(x)
        }
    }
    static bestMatch(a: string, b: string[]) {
        StringUtils.print("Bestmatch of " + a + " " + JSON.stringify(b))
        return stringSimilarity.findBestMatch(a,b)
    }
    static compare(a: string, b: string) {
        StringUtils.print("Compare " + a + " " + b)
        return stringSimilarity.compareTwoStrings(a,b)
    }
    // get/set
    static get debug() {return StringUtils._debug} 
    static set debug(x) {StringUtils._debug = x} 
}
