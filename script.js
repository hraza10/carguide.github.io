  /* FUNCTION TO CREATE CHART */

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

  /* FUNCTION TO DESTROY CHART */

  function destroyChart(chart) {
    chart.destroy();
  }

  /* FUNCTION TO COUNT COUNTRIES */

  function countCountry(data, dict) {
    for (let i = 0, j = data.length; i < j; i++) {
      if (dict[data[i].Country]) {
        dict[data[i].Country]++;
      }
      else {
        dict[data[i].Country] = 1;
      } 
    }
  }

  // function shapeDataForChart(array) {
    
  //   return array.reduce((collection, item) => {
  //     if(!collection[item.category]) {
  //       collection[item.category] = [item];
  //     } else {
  //       collection[item.category].push(item);
  //     }
  //     return collection;
  //   }, {});
  // }

  async function mainEvent() { // the async keyword means we can make API requests
    // const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    // const filterButton = document.querySelector('#filter');
    // const clearDataButton = document.querySelector('#data_clear');
    // const generateListButton = document.querySelector('#generate');
    // const textField = document.querySelector('#resto');
    const chartTarget = document.querySelector('#myChart');
    const refreshButton = document.querySelector('#generate');
    const dropdown = document.querySelector("#filter");


    // Add a querySelector that targets your filter button here
  
    const loadAnimation = document.querySelector('#data_load_animation');
    loadAnimation.style.display = "none";
    // generateListButton.classList.add("hidden");
    
    
    
    // const storedData = localStorage.getItem("storedData");
    // let parsedData = JSON.parse(storedData);
    // if (parsedData?.length > 0 ) {
    //   generateListButton.classList.remove("hidden");
    // }


    
    console.log("beginning", localStorage);

    console.log('Loading Data');
      loadAnimation.style.display = 'inline-block'
  
      // Basic GET request - this replaces the form Action.
      const results = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json');
  
      // This changes the response from the GET into data we can use - an "object"
      const storedList = await results.json();
      const dataList = storedList.Results;

      console.log("after API call", localStorage);

      
      


      // if (parsedData?.length > 0 ) {
      //   generateListButton.classList.remove("hidden");
      // }

      

      let obj = {};

      countCountry(dataList, obj);

      localStorage.setItem('storedData', JSON.stringify(obj));
      console.log("storedData is set", localStorage);

      let storedData = localStorage.getItem("storedData");
    
      let parsedData = JSON.parse(storedData);
      

      let myChart = initChart(chartTarget, parsedData);

      loadAnimation.style.display = 'none';

      
      
      dropdown.addEventListener("change", (event) => {
        console.log(localStorage);
        const selectedOption = event.target.value;
        
        for (let i = 0, j = Object.keys(parsedData).length; i < j; i++) {

          if (String(selectedOption) === 'ALL') {
            myChart.destroy();
            myChart = initChart(chartTarget, parsedData);
          }

          if (Object.keys(parsedData)[i] === String(selectedOption)) {
            const arr = {};
            arr[Object.keys(parsedData)[i]] = Object.values(parsedData)[i];

            myChart.destroy();
            myChart = initChart(chartTarget, arr);
          };  
        }
      });
    
    
      refreshButton.addEventListener('click', (event) => {
        loadAnimation.style.display = 'inline-block'
        localStorage.clear();
        console.log(localStorage);

        localStorage.setItem('storedData', JSON.stringify(obj));
        console.log("storedData is set", localStorage);
  
        storedData = localStorage.getItem("storedData");
      
        parsedData = JSON.parse(storedData);
        
        myChart.destroy();
        myChart = initChart(chartTarget, parsedData);

        loadAnimation.style.display = 'none';

      });

      
       
  //   generateListButton.addEventListener('click', (event) => {
  //     console.log('generate new list');

  //     currentList = cutRestaurantList(parsedData);
  //     console.log(currentList);
  //     injectHTML(currentList);
  //     // markerPlace(currentList, carto);
  //   });

  //   textField.addEventListener('input', (event) => {
  //     console.log('input', event.target.value);
  //     const newList = filterList(currentList, event.target.value);
  //     console.log(newList);
  //     injectHTML(newList);
  //     // markerPlace(newList, carto);
  //   });

  //   clearDataButton.addEventListener("click", (event) => {
  //     console.log("clear browser data");
  //     localStorage.clear();
  //     console.log("localStorage Check", localStorage.getItem("storedData"));
  //   })
  }
  
  document.addEventListener('DOMContentLoaded', async () => mainEvent());

