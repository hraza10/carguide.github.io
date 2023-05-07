  function initChart(chart, object) {
    
    
    const labels = Object.keys(object);
    const info = Object.values(object);
    

    return new Chart(chart, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Countries With Most Car Manufacturers',
          data: info,
          borderWidth: 1,
          backgroundColor: 'rgb(90, 90, 120)'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  function destroyChart(chart) {
    chart.destroy();
  }


  function countCountry(data) {

    let dict = {};

    for (let i = 0, j = data.length; i < j; i++) {
      if (dict[data[i].Country]) {
        dict[data[i].Country]++;
      }
      else {
        dict[data[i].Country] = 1;
      } 
    }

    return dict;
  }


  async function mainEvent() { 
    const chartTarget = document.querySelector('#myChart');
    const refreshButton = document.querySelector('#generate');
    const dropdown = document.querySelector("#filter");


  
    const loadAnimation = document.querySelector('#data_load_animation');
    
    loadAnimation.style.display = "none";    

    
  

    console.log('Loading Data');
    loadAnimation.style.display = 'inline-block';

    const results = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json');

    const storedList = await results.json();
    const dataList = storedList.Results;

    localStorage.setItem('storedData', JSON.stringify(dataList));

    let storedData = localStorage.getItem("storedData");
  
    let parsedData = JSON.parse(storedData);


    let countryCount = countCountry(parsedData);
    
    let myChart = initChart(chartTarget, countryCount);

    loadAnimation.style.display = 'none';

      
      
    dropdown.addEventListener("change", (event) => {
      
      const selectedOption = event.target.value;
      
      for (let i = 0, j = Object.keys(countryCount).length; i < j; i++) {

        if (selectedOption === 'ALL') {
          myChart.destroy();
          myChart = initChart(chartTarget, countryCount);
        }

        if (Object.keys(countryCount)[i] === selectedOption) {
          const arr = {};
          arr[Object.keys(countryCount)[i]] = Object.values(countryCount)[i];

          myChart.destroy();
          myChart = initChart(chartTarget, arr);
        };  
      }
    });
    
    
    refreshButton.addEventListener('click', (event) => {
      loadAnimation.style.display = 'inline-block'
      localStorage.clear();

      localStorage.setItem('storedData', JSON.stringify(dataList));

      storedData = localStorage.getItem("storedData");
    
      parsedData = JSON.parse(storedData);
      
      countryCount = countCountry(parsedData);
      myChart.destroy();
      myChart = initChart(chartTarget, countryCount);
      dropdown.value = 'ALL';

      loadAnimation.style.display = 'none';

    });

      
  }
  
  document.addEventListener('DOMContentLoaded', async () => mainEvent());

