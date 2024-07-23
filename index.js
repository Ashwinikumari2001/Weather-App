const userTab=document.querySelector("[data-usertab]");
const searchTab=document.querySelector("[data-searchtab]");
const grantLocationContainer=document.querySelector(".grantlocationcontainer");
const searchForm=document.querySelector("[data-searchform]");
const loadingScreenContainer=document.querySelector(".loadingscreencontainer");
const userInfoContainer=document.querySelector(".Weatherinfocontainer");

let currentTab=userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantLocationContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click", () => {
   switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantLocationContainer.classList.add("active");
    }else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}= coordinates;
    grantLocationContainer.classList.remove("active");
    loadingScreenContainer.classList.add("active");
    try{
       const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
       const data=await response.json();
       loadingScreenContainer.classList.remove("active");
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);
    }catch(err){

    }

}
function renderWeatherInfo(weatherInfo) {
     const cityName=document.querySelector(".cityname");
     const countryIcon=document.querySelector(".countryicon");
     const desc=document.querySelector(".weatherdescription");
     const weatherIcon=document.querySelector(".weathericon");
     const temp=document.querySelector(".temprature");
     const windspeed=document.querySelector(".windspeed");
     const humidity=document.querySelector(".humidity");
     const cloudiness=document.querySelector(".clouds");
     cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert("No geolocation support available");
    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantaccess]");
grantAccessButton.addEventListener("click",getLocation);
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName===""){
        return;
    }else{
        fetchSearchWeatherInfo(cityName);
    }
})
async function fetchSearchWeatherInfo(city){
      loadingScreenContainer.classList.add("active");
      userInfoContainer.classList.remove("active");
      grantLocationContainer.classList.remove("active");
      try{
          const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
          const data=await response.json();
          loadingScreenContainer.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);
      }catch(err){

      }
}