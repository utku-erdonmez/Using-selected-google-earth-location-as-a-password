const singinForm=document.getElementById("signinForm");
const singupForm=document.getElementById("signupForm");
const inputFields=document.getElementsByTagName("input")
const buttonSignup=document.getElementById("button-Signup")
const signupSubmit=document.getElementById("signupSubmit")
const singinContainer=document.getElementById("singinContainer")
const signupContainer=document.getElementById("signupContainer")
const mapContainer=document.getElementById("map");
//
items=localToArray()
markerAdded=false
markerPosition={a:null,b:null};
markers=[];

//events
singinForm.addEventListener("submit",(e)=>{

    e.preventDefault()
    checkUser()

})

buttonSignup.addEventListener("click",(e)=>{e.preventDefault();showSignup()});
signupSubmit.addEventListener("click",(e)=>{
    let INPUT_username=document.getElementById("signupUsername").value;
    let INPUT_lat=markerPosition.a;
    let INPUT_lng=markerPosition.b;
    
    alert("Congratulations! Your account has been successfully created")
    e.preventDefault();
    addItem(INPUT_username,INPUT_lat,INPUT_lng);
    showSignin()});

    

//view
for (let inputField of inputFields){
    inputField.addEventListener("input",(e)=>{
        if(e.target.value && e.target.value.length>4){
            inputField.classList.remove("empty")
            inputField.classList.add("ok")
        }
        else{
            inputField.classList.remove("ok")
            inputField.classList.add("empty")
        }
                  
    })
}
function showSignup(){
    let signupUsername=document.getElementById("signupUsername")
    signupUsername.value=""
    singinContainer.style.display="none"
    signupContainer.style.display="flex"
    const signupMapContainer = document.getElementById("signup-mapContainer");
    signupMapContainer.appendChild(mapContainer);

    markerPosition.a=null;
    markerPosition.b=null;
    removeMarkers();
    


}
function showSignin(){
    let loginUsername=document.getElementById("loginUsername")
    loginUsername.value=""
    singinContainer.style.display="block"
    signupContainer.style.display="none"

    const singinMapContainer = document.getElementById("singin-mapContainer");
    singinMapContainer.appendChild(mapContainer);

    markerPosition.a=null;
    markerPosition.b=null;
    removeMarkers();
    map.setZoom(16);
    
}
function showPassFound(msg){
    const passFoundContainer=document.getElementById("passFoundContainer")

    let passFound=document.createElement("h2")
    passFound.id="passFound"


    passFound.textContent=msg
    
    
    passFoundContainer.innerHTML=""

    passFoundContainer.appendChild(passFound)
    
    setTimeout(()=>{
        passFound.remove();
    },3000);
}
//functions 

function localToArray(){
    const value=localStorage.getItem("users") || "[]";
    return JSON.parse(value)
}
function arrayToLocal(items){
    localStorage.setItem("users",JSON.stringify(items))

}
function addItem(INPUT_username,INPUT_lat,INPUT_lng){
    items.unshift({
        username:INPUT_username,
        lat:INPUT_lat,
        lng:INPUT_lng,    
    })
    arrayToLocal(items);
}
function checkUser(){
    let INPUT_loginUsername=document.getElementById("loginUsername").value;
    let INPUT_lat=markerPosition.a;
    let INPUT_lng=markerPosition.b;
    //Checking marker
    if (INPUT_lat===null || INPUT_lng===null){
        console.log("null",INPUT_lng,INPUT_lat)
        alert("Please click on the map to select a location.")
        return false
    }
    //Checking username
    if(items.every(item=>(item["username"]!==INPUT_loginUsername))){
        alert("Oops! It seems the username you entered does not exists.")
        return false
    }
    else console.log("user  found");

    //checking password username combinbation
    for (item of items){
        if(item["lat"]===INPUT_lat&&item["lng"]===INPUT_lng&&item["username"]===INPUT_loginUsername){
            alert("Welcome Back!")
            return true
        }

    }
    alert("The selected location has a password, but it's not the correct one for this user.")
    return false

}


function isThereAnyPassword(){
    let INPUT_lat=markerPosition.a;
    let INPUT_lng=markerPosition.b;
    for (item of items){
        if(item["lat"]===INPUT_lat&&item["lng"]===INPUT_lng){
            console.log("A PASSWORD FOUND!!!")
            showPassFound("A PASSWORD FOUND!!!")
            
            return true
        }

    }
    console.log("pass notfound")
    showPassFound("EMPTY LOCATION");
    return false


}
//map



function initMap() {
  map = new google.maps.Map(mapContainer, {
    center: { lat: 39.87142943626986, lng: 32.736619497106346},
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    streetViewControl: false,
    mapTypeControl: false,
    scrollwheel:true
  });
  google.maps.event.addListener(map, 'click', (e)=> {
    placeMarker(e.latLng);
    markerAdded=true
    isThereAnyPassword()
  });
  
}


function placeMarker(location) {
    console.log(markers)
  if (markerAdded===true){
    markerAdded=false;
    removeMarkers();
  }
    let marker = new google.maps.Marker({
       position: location, 
       map: map
   });  
   markers.push(marker)

   markerPosition.a=marker.getPosition().lat().toFixed(4);
   markerPosition.b=marker.getPosition().lng().toFixed(4);
   console.log(markerPosition)
   //remove by click
   google.maps.event.addListener(marker,'click',(e)=>{
    marker.setVisible(false);
    
   });
}
function removeMarkers(){
    markers.forEach(marker => {
        marker.setMap(null);
      });
}


window.initMap = initMap;