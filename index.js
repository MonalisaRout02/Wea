import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import axios from "axios";
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));




    app.get("/", async (req, res) => {
        const { lat, lon } = req.query;
    
        if (!lat || !lon) {
            // If no coordinates are provided, render the HTML page
            return res.render("index.ejs");
        }
    
        try {
            // Fetch the current region name using reverse geocoding
            const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse`, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: "2ae9095f14576969c0cbd422a991fb8e"
                }
            });
            const currentRegion = geoResponse.data[0].name;
    
            // Fetch the weather data
            const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    lat,
                    lon,
                    units: 'metric',
                    appid: "2ae9095f14576969c0cbd422a991fb8e",
                }
            });
            const weatherData = weatherResponse.data;
    
            // Return JSON data
            return res.json({
                region: currentRegion,
                temp: weatherData.main.temp,
                minTemp: weatherData.main.temp_min,
                maxTemp: weatherData.main.temp_max,
                windSpeed: weatherData.wind.speed,
                windAngle: weatherData.wind.deg,
                pressure: weatherData.main.pressure,
                humidity: weatherData.main.humidity,
                icon: weatherData.weather[0].icon,
            });
            
        } catch (error) {
            console.error("Failed to fetch weather data", error.message);
            return res.status(500).json({ error: "Failed to fetch weather data. Please try again later." });
        }
    });
    


app.post("/GetLL",async(req,res)=>{
    // console.log(req.body);
    const q= req.body.name.trim();
    // console.log(q);
     try {
        const response1 = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${q}`,{
            params:{
                apiKey:"2ae9095f14576969c0cbd422a991fb8e",
            }
        });
        const result1 = response1.data;
        // console.log(result1);
        const latt=result1[0].lat;
        const long=result1[0].lon;
       
        // console.log(latt);
        // console.log(long);
        const response2 = await axios.get('https://api.openweathermap.org/data/2.5/weather?units=metric',{
            params:{
                lat:latt,
                lon:long,
                apiKey:"2ae9095f14576969c0cbd422a991fb8e",
            }
        });
        const result2 = response2.data;
        // console.log(result2);
        res.render("index.ejs", { 
          region:result1[0].name,
          temp:result2.main.temp,
          minTemp:result2.main.temp_min,
          maxTemp:result2.main.temp_max,
          windSpeed:result2.wind.speed,
          windAngle:result2.wind.deg,
          pressure:result2.main.pressure,
          humidity:result2.main.humidity,
          icon:result2.weather[0].icon,
        });
       
    //    console.log(result2.main.temp);

      }catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
      }
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});

