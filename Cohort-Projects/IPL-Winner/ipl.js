let box = document.querySelector(".box")
let h1 = document.querySelector("h1");
let btn = document.querySelector(".btn")


let images = [
  "url('img/1.jpg')",
  "url('img/2.jpg')",
  "url('img/3.jpg')",
  "url('img/4.jpg')",
  "url('img/5.jpg')",
  "url('img/6.jpg')",
  "url('img/7.jpg')",
  "url('img/8.jpg')",
  "url('img/9.jpg')",
  "url('img/10.jpg')"
];


btn.addEventListener('click', () => {
  let random = Math.floor(Math.random() * images.length);
  document.body.style.backgroundImage = images[random];
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  

  console.log(random)


switch (random) {

  case 0: // CSK
    h1.innerText = `CSK are the Winners!
                      Chennai Super Kings
                      Trophies: 5
                      Captain: Ruturaj Gaikwad`;

    box.style.backgroundColor = '#feda00'; // CSK Yellow
    h1.style.color = '#003087';            // CSK Blue
    break;

  case 1: // DC
    h1.innerText = `DC are the Winners!
                      Delhi Capitals
                      Trophies: 0
                      Captain: Travis Head`;

    box.style.backgroundColor = '#004C97'; // DC Blue
    h1.style.color = '#D71920';            // DC Red
    break;

  case 2: // GT
    h1.innerText = `GT are the Winners!
                      Gujarat Titans
                      Trophies: 1
                      Captain: Shubman Gill`;

    box.style.backgroundColor = '#0A1C2E'; // GT Navy
    h1.style.color = '#E8C547';            // GT Gold
    break;

  case 3: // KKR
    h1.innerText = `KKR are the Winners!
                      Kolkata Knight Riders
                      Trophies: 3
                      Captain: Ajinkya Rahane`;

    box.style.backgroundColor = '#3A225D'; // KKR Purple
    h1.style.color = '#D4AF37';            // KKR Gold
    break;

  case 4: // LSG
    h1.innerText = `LSG are the Winners!
                      Lucknow Super Giants
                      Trophies: 0
                      Captain: KL Rahul`;

    box.style.backgroundColor = '#0047AB'; // Blue
    h1.style.color = '#F56600';            // Orange
    break;

  case 5: // MI
    h1.innerText = `MI are the Winners!
                      Mumbai Indians
                      Trophies: 5
                      Captain: Hardik Pandya`;

    box.style.backgroundColor = '#004BA0'; // MI Blue
    h1.style.color = '#D1AB3E';            // MI Gold
    break;

  case 6: // PBKS
    h1.innerText = `PBKS are the Winners!
                      Punjab Kings
                      Trophies: 0
                      Captain: Sam Curran`;

    box.style.backgroundColor = '#C91F26'; // PBKS Red
    h1.style.color = '#FFFFFF';            // White
    break;

  case 7: // RCB
    h1.innerText = `RCB are the Winners!
                      Royal Challengers Bengaluru
                      Trophies: 0
                      Captain: Faf du Plessis`;

    box.style.backgroundColor = '#000000'; // RCB Black
    h1.style.color = '#D4AF37';            // RCB Gold
    break;

  case 8: // RR
    h1.innerText = `RR are the Winners!
                      Rajasthan Royals
                      Trophies: 1
                      Captain: Sanju Samson`;

    box.style.backgroundColor = '#EA1A8B'; // RR Pink
    h1.style.color = '#0A1C6B';            // RR Blue
    break;

  case 9: // SRH
    h1.innerText = `SRH are the Winners!
                      Sunrisers Hyderabad
                      Trophies: 1
                      Captain: Pat Cummins`;

    box.style.backgroundColor = '#F26522'; // SRH Orange
    h1.style.color = '#000000';            // Black
    break;
}

});