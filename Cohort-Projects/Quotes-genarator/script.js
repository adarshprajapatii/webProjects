let btn = document.querySelector('button')
let main = document.querySelector('main')

let arr = [
    "Stay hungry.",
    "Stay foolish.",
    "Dream big.",
    "Never give up.",
    "Think different.",
    "Trust the process."
];

//push genarated  quetes in  empty array 
let generatedQuetes = []

setInterval(() => {
    if (generatedQuetes.length > 0) {
        let oldest = generatedQuetes[0];

        oldest.classList.add('fadeOut')

        setTimeout(() => {
            oldest.remove();
            generatedQuetes.shift()
        }, 800)
    }
}, 1000);

btn.addEventListener('click', () => {
    let h1 = document.createElement('h1')
    let a = Math.floor(Math.random() * arr.length)
    let x = Math.random() * 80
    let y = Math.floor(Math.random() * 80)
    let rotate = Math.random() * 360
    let scale = Math.random() * 1 + .5

    h1.innerHTML = arr[a]
    h1.style.color = 'white'
    h1.style.whiteSpace = 'nowrap'
    h1.style.position = 'absolute'
    h1.style.left = x + '%'
    h1.style.top = y + '%'
    h1.style.scale = scale
    h1.style.rotate = rotate + 'deg'

    main.appendChild(h1)
    generatedQuetes.push(h1)
    console.log(generatedQuetes)

})
