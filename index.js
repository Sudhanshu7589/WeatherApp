const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weater-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const cityNotFound=document.querySelector(".data-not-found");

//initiallt variable need??

let currentTab=userTab;
const API_KEY="8b45db78db55896f8ca5dbf3af5b2574";
currentTab.classList.add("current-tab");

getfromSessionStorage();
//ek kaam orPending hai ??

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pahle search wale tab pr tha, ab your weather tab visible krna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab maine your weather tab me aaya hu, toh weather bhi display krna padega, so let's check local storage first
            //for coordinates, if we have saved them there
            getfromSessionStorage();
        }
    }

}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active")
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}



async function fetchUserWeatherInfo(coordinates){
    const {lat, lon}=coordinates;
    //make granContainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //API CALL
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=matric`);
        
        const data=await response.json();
        cityNotFound.classList.remove("active");
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // cityNotFound.classList.remove("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        alert("found Error:1234 ",err);
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly , we have to fetch the elements



    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspped=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");


   
    //fetch values from weather object and put it UI elements
    console.log(weatherInfo);

    cityName.innerText=weatherInfo?.name;




    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${(weatherInfo?.main?.temp-274).toFixed(2)} °C`;
    windspped.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;


}

function getLocation(){
        if(navigator.geolocation){
           
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else{
            //HW - show an alert for no geolocation support available
            alert(" no geolocation support available");
        }
        
    }
    function showPosition(position){
        const userCoordinets={
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
        // cnsole.log(longi);o
        sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinets));
        fetchUserWeatherInfo(userCoordinets);
    }

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    cityNotFound.classList.remove("active");
    let cityName=searchInput.value;
    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{

        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=matric`);
        // const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=matric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        if(!data?.name){
            cityNotFound.classList.add("active");
        }
        else{
            userInfoContainer.classList.add("active");
            cityNotFound.classList.remove("active");
            renderWeatherInfo(data);
        }
       
    }
    catch(err){
        // userInfoContainer.classList.add("active");

        alert("NOT FOUND 12345666");
    }
}





















// console.log("Hello Jee");

// const API_KEY="8b45db78db55896f8ca5dbf3af5b2574";

// function renderWeatherInfo(data){
//     let newPara=document.createElement('p');
//     newPara.textContent=`${Math.floor((data?.main?.temp.toFixed(0))-273)} °C`;

//     document.body.appendChild(newPara);
// }

// async function showWeather(){
//     // let latitude=29.8667;
//     // let longitued=77.8833;
//     try{
//     let city="jhajha";
//     const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=matric`);

//     const data =await response.json();
//     console.log("Weather Data:-> ",data);
//     renderWeatherInfo(data);
//     }
//     catch(err){
//         //handle the error here
//         console.log("Found Error",err);
//     }
// }

// async function getCustomWeatherDetails(){
//     try{
//         let latitude=29.8667;
//         let longitued=77.8833;
//         let result=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitued}&appid=${API_KEY}&units=matric`);
//         let data=await result.json();
//         console.log(data);
//     }
//     catch(err){
//         console.log("Error Found:",err);
//     }

// }


// function switchTab(clickedTab){
//     apiErrorContainer.classList.remove("active");
//     if(clickedTab!==currentTab){
//         currentTab.classList.remove("current-tab");
//         currentTab=clickedTab;
//         currentTab.classList.add("current-tab");


//         if(!searchFrom.classList.contains("active")){
//             userInfoContainer.classList.remove("active");
//             grantAccessContainer.classList.remove("active");
//             searchFrom.classList.add("active");
//         }
//         else{
//             searchFrom.classList.remove("active");
//             userInfoContainer.classList.remove("active");
//             getFromSessionStorage();
//         }
//         //console.log("Current Tab",currentTab);

//     }
// }

// function getLocation(){
//     if(navigator.geolocation){
       
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No geolocation Support");
//     }
    
// }
// function showPosition(position){
//     let lat=position.coords.latitude;
//     let longi=position.coords.longitude;
//     console.log(lat);
//     console.log(longi);

// }