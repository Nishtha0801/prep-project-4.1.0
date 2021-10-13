import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
function Index(props) {
  const { place } = props;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
  const API_KEY = process.env.REACT_APP_APIKEY;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [wind, setWind] = useState('');
  const [humidity, setHumidity] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weekly, setWeekly] = useState([]);
  const [minTemp, setminTemp] = useState([]);
  const [maxTemp, setmaxTemp] = useState([]);
  useEffect(() => {
    async function getDetails() {
      const { data } = await axios.get(
        `${BASE_URL}weather?q=${place}&units=metric&appid=${API_KEY}`
      );
      const { coord } = data; //long lat
      const { lat, lon } = coord;

      let oneApiData = await axios.get(
        `${BASE_URL}onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      oneApiData = oneApiData.data;
      const { current } = oneApiData;

      setWind(current.wind_speed);
      setHumidity(current.humidity);
      setIcon(current.weather[0].icon);
      setDescription(current.weather[0].description);

      let temp = current.temp;
      temp = (5 / 9) * temp - 32;

      setTemperature(temp);

      const requiredDays = [];
      const date = new Date().getDay();
      for (let i = date; i < date + 5; i++) requiredDays.push((i + 1) % 7);

      setWeekly(
        requiredDays.map((idx) => {
          return days[idx];
        })
      );
      const daily = oneApiData.daily;
      const filteredDailyData = daily.filter((ele, idx) => {
        return idx < 5;
      });
      setminTemp(
        filteredDailyData.map((dailyObject, idx) => {
          return dailyObject.temp.min;
        })
      );

      setmaxTemp(
        filteredDailyData.map((dailyObject, idx) => {
          return dailyObject.temp.max;
        })
      );
    }
    getDetails();
  }, []);

  return (
    <div class='card-fav'>
      <h2>Brussels</h2>
      <h3 class='head-fav'>
        Cloudy
        <span>
          Wind 10km/h <span class='dot'>•</span> Precip 0%
        </span>
      </h3>
      <h1>23°</h1>
      <div class='sky'>
        <div class='sun'></div>
        <div class='cloud'>
          <div class='circle-small'></div>
          <div class='circle-tall'></div>
          <div class='circle-medium'></div>
        </div>
      </div>
      <table>
        <tr>
          <td>TUE</td>
          <td>WED</td>
          <td>THU</td>
          <td>FRI</td>
          <td>SAT</td>
        </tr>
        <tr>
          <td>30°</td>
          <td>34°</td>
          <td>36°</td>
          <td>34°</td>
          <td>37°</td>
        </tr>
        <tr>
          <td>17°</td>
          <td>22°</td>
          <td>19°</td>
          <td>23°</td>
          <td>19°</td>
        </tr>
      </table>
    </div>
  );
}

export default Index;