import axios from 'axios';
const API_KEY = 'd67ed79ccb6c30d58329576495e31a23';
const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?APPID=${API_KEY}`;
//?q=London,us&APPID=d67ed79ccb6c30d58329576495e31a23
export const FETCH_WEATHER = 'FETCH_WEATHER';

export function fetchWeather(city){
    //1819730
    const url = `${ROOT_URL}&q=${city}`;
    const request = axios.get(url);

    console.log('request : ', request);

    return {
        type : FETCH_WEATHER,
        payload: request
    };
}
