const apiKey = 'e5a616ca975b41c1925ecd39d73f931d'
const apiHost = 'n35u9ur35v.re.qweatherapi.com'
const token = ''


const locButton = document.querySelector('.loc-button')
const todayInfo = document.querySelector('.today-info')
const todayWeatherIcon = document.querySelector('.today-weather i')
const todayTemp = document.querySelector('.weather-temp')
const daysList = document.querySelector('.days-list')


//页面主题程序，查询天气信息
function fetchWeatherData(location) {
  const encodedLocation = encodeURIComponent(location);
  const locationUrl = `https://${apiHost}/geo/v2/city/lookup?location=${encodedLocation}&key=${apiKey}`;

  fetch(locationUrl).then(response => {
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json()
  }).then(
    data => {
      const locationId = data.location[0].id
      //拿到未来七天的天气信息
      const furtherWeatherUrl = `https://${apiHost}/v7/weather/7d?key=${apiKey}&location=${locationId}`
      fetch(furtherWeatherUrl).then(response => response.json()).then(data => {
        const today = new Date()
        const nextDaysData = data.daily.slice(0)

        const uniqueDays = new Set()
        let count = 0
        daysList.innerHTML = ''
        for (const dayData of nextDaysData) {
          const forecastDate = new Date(dayData.fxDate)
          const dayAbbreviation = forecastDate.toLocaleDateString('zh', { weekday: 'short' })
          const dayTemp = `${dayData.tempMax}°C`
          const iconCode = dayData.iconDay
          if (!uniqueDays.has(forecastDate) && today.getDate() !== forecastDate.getDate()) {
            uniqueDays.add(forecastDate)
            daysList.innerHTML += `
            <li>
            <i class="weather-icon qi-${iconCode}"></i>
            <span>${dayAbbreviation}</span>
            <span class="day-temp">${dayTemp}</span>
            </li>
          


            `
            count++

          }
          if (count === 4) break
        }

      })

      //渲染左边的天气信息
      const locationElement = document.querySelector('.today-info>div>span')
      locationElement.textContent = `${data.location[0].adm1},${data.location[0].name}`
      const apiUrl = `https://${apiHost}/v7/weather/now?key=${apiKey}&location=${locationId}`
      return fetch(apiUrl);
    }
  ).then(response => response.json()).then(data => {
    const todayWeather = data.now.text
    const todayTemperature = `${data.now.temp}°C`
    const todayWeatherIconCode = data.now.icon

    todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('zh', { weekday: 'short' })
    todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('zh', { day: 'numeric', month: 'long', year: 'numeric' })
    todayWeatherIcon.className = `weather-icon qi-${todayWeatherIconCode}`
    todayTemp.textContent = todayTemperature
    const weatherDescriptionElement = document.querySelector('.today-weather>h3')
    weatherDescriptionElement.textContent = todayWeather

    const todayPrecipitation = `${data.now.vis}公里`
    const todayHumidity = `${data.now.humidity}%`
    const todayWindSpeed = `${data.now.windSpeed}km/h`

    const dayInfoContainer = document.querySelector('.day-info')
    dayInfoContainer.innerHTML = `
      <div>
        <span class="title">能见度</span>
        <span class="value">${todayPrecipitation}</span>
      </div>
      <div>
        <span class="title">湿度</span>
        <span class="value">${todayHumidity}</span>
      </div>
      <div>
        <span class="title">风速</span>
        <span class="value">${todayWindSpeed}</span>
      </div>

`




  })

}
//页面加载完成，就进行主题程序查询
document.addEventListener('DOMContentLoaded', () => {
  const defaultLocation = 'beijing'
  fetchWeatherData(defaultLocation)
})



locButton.addEventListener('click', () => {
  const location = prompt('请输入查询的城市名')
  if (!location)
    return
  fetchWeatherData(location)
})