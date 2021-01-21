export async function getMountPrice(city) {
    let temp = null;
    
    const key = ''; // key OpenWeather


    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

    if(sessionStorage.getItem('temp')) {
        return sessionStorage.getItem('temp')
    }
    
    await fetch(url)
        .then(response => response.json())
        .then(result => {
            return temp = (result.main.temp - 273.15).toFixed()
        })
        .then(temp => sessionStorage.setItem('temp', temp)) 
        
    return temp
}
