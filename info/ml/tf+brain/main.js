import './style.css'
import { setupCounter } from './counter.js'
import { braintest } from './braintest.js'

var bt = 1

const btest = async function () {
  await braintest(bt++,document.querySelector('#brain'))
}

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <div class="card">
    <p>Braintest</p>
    <button id="bt" type="button">BT</button>
    <p id="brain"></p>
    </div>
  </div>
`

//document.querySelector('#bt').addEventListener('click', () => btest)
setupCounter(document.querySelector('#counter'))

const setupBrain = () => {
  console.log("BS")
  document.querySelector("#bt").addEventListener('click', btest)
}
setupBrain()
//setTimeout(setupBrain,1000)

