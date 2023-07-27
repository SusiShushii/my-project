import React  from 'react';
import Clock from 'react-live-clock';
import apiKeys from './apikey';


class MyComponent extends React.Component{
    
    state = {
        temperatureC: 25,
        pm: 25,
        aqi: "1",
        city: "Bangkok",
        country: "TH",
        icon: "Clouds",
        errorMsg: undefined,
    }
  
    componentDidMount() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            this.getWeather(latitude, longitude);
            this.getPM(latitude, longitude);
          },
          error => {
            this.getWeather(28.67, 77.22);
            alert(
              "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real-time weather."
            );
          }
        );
      } else {
        alert("Geolocation not available");
      }
  
      this.timerID = setInterval(() => {
        const { lat, lon } = this.state;
        this.getWeather(lat, lon);
      }, 600000);
    }

      getWeather = async (lat, lon) => {
        try {
          const response = await fetch(
            `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
          );
          const data = await response.json();
          const { name, main,weather,sys} = data;
          this.setState({
            lat,
            lon,
            city: name,
            temperatureC: Math.round(main?.temp),
            icon: weather[0].main,
            country: sys.country,
          });
          console.log(data);
        } catch (error) {
          console.error(error);
        }
       
      };

      getPM = async (lat, lon) => {
        try {
          const response = await fetch(
            `${apiKeys.base}air_pollution?lat=${lat}&lon=${lon}&appid=${apiKeys.key}`,
          );
          
          const data = await response.json();
          const { main , components } = data.list[0];
          this.setState({
            aqi: main.aqi,
            pm: components.pm10,
          });
          
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      };
     
      setIcon = (weather) => {
        switch (weather) {
          case "Haze":
            this.setState({ icon: "CLEAR_DAY" });
            break;
          case "Clouds":
            this.setState({ icon: "CLOUDY" });
            break;
          case "Rain":
            this.setState({ icon: "RAIN" });
            break;
          case "Snow":
            this.setState({ icon: "SNOW" });
            break;
          case "Dust":
            this.setState({ icon: "WIND" });
            break;
          case "Drizzle":
            this.setState({ icon: "SLEET" });
            break;
          case "Fog":
          case "Smoke":
            this.setState({ icon: "FOG" });
            break;
          case "Tornado":
            this.setState({ icon: "WIND" });
            break;
          default:
            this.setState({ icon: "CLEAR_DAY" });
        }
      };
      



render() {
const date = new Date();

function setAqi(aqi){
  if(aqi ==1){
    return "Good"
  }
  if(aqi ==2){
    return "Moderate";
  }
  if(aqi ==3){
    return "Unhealthy for Sensitive Groups";
  }
  if(aqi==4){
    return "Unhealthy"
  }
  if(aqi==5){
    return "Very Unhealthy";
  }
  if(aqi==6){
    return "Hazardous";
  }
  else {
    return "Good";
  }
}

function setPM(pm){
  if(pm<50){
    return "GOOD"
  }
  else if(pm<100){
    return "SATISFACTORY"
  }
  else if(pm<250){
    return "MODERATED POLLUTED"
  }
  else if(pm<350){
    return "POOR"
  }
  else if (pm< 430){
    return "VERY POOR"
  }
  else if (pm>430){
    return "SEVERE"
  }
}
const dateBuilder = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  return(
    <React.Fragment>  
        <div className="Topleft"> 
            <div style={{ fontSize: '50px' }}> <Clock format={'HH:mm A'} interval = {1000} ticking={true} />   </div>
            <div style={{ fontSize: '20px'}}>{date.toLocaleString('en-IN', dateBuilder)}</div>
        </div>
        <div className='Topright'>
            <ul style={{ listStyleType: 'none'}}>
                <div className="Icon_Temp">
                   <li><img src = {require(`./images/icon/${this.state.icon}-1.png`)}/></li> 
                   <li>{this.state.temperatureC} ° C</li>
                </div>
                <li style={{ fontFamily: 'Trebuchet MS, sans-serif',fontSize: '3vh' }}>     {this.state.city}, {this.state.country}  </li>
                <li style={{ fontFamily: 'Trebuchet MS, sans-serif',fontSize: '3vh' }}>   {this.state.icon}  </li>
               
                  <li style={{color:"greenyellow",placeContent:"flex-end",display:"flex",gap:"1vh",alignItems:"center"}}>
                    <img  style ={{overflow:'auto'}}src = {require(`./images/${(setAqi(this.state.aqi))}.png`)}/>
                    <div style={{display: 'flex',flexDirection:'column',alignItems:'center',borderRight:'0.2vh solid greenyellow',paddingRight:'8px',gap:'0.4vh'}}>
                      <div>{this.state.aqi}</div>  
                      <div style={{fontSize:'1.1vh',textAlign:'center'}}>US AQI</div>
                    </div>
                    <div style = {{display: 'flex',flexDirection:'column',gap:'0.4vh'}}>
                      <div>{setPM(this.state.pm)}</div>
                      <div style={{fontSize:'1.1vh',textAlign:'center'}}>PM 2.5</div>
                    </div>
                  </li>
            </ul>
        </div>
    </React.Fragment>
);}    
}

export default MyComponent;
