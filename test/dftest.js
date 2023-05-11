// test grouping and filtering

const dfd = require("danfojs")

const data = {"a": [1,2,3,7],"b":[1,1,0,3],"c":["x","y","y","t"]}

const apl = (x) => { 
	console.log(typeof(x))
	return typeof(x) == "number" ?  x.toFixed(2) : x
}


const df = new dfd.DataFrame(data)

df.print()

const df_ = df["a"]
df_.print()

df_.apply(apl).print()


const gp = df.groupby(["b"])
console.log("Group by b:",Object.keys(gp.groups))
//gp.print()

console.log("Filter by b == 1")
const df1 =  df.query(df["b"].eq(1))
df1.print()

const groupBy = "b"
const groups = []
for (const g of Object.keys(gp.groups)) groups.push([g])
console.log(groups)
const newDf = new dfd.DataFrame(groups,{columns:[groupBy]})
newDf.print()
console.log(newDf[groupBy].values)
console.log(newDf[newDf.columns[0]].values)

