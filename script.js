// export async function loadVehicleData(req, res, next) {
//   try {
//     const url = 'https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json';
//     const data = await fetch(url);
//     const json = await data.json();

//     const reply = json.filter((item) => Boolean(item.geocoded_column_1)).filter((item) => Boolean(item.name));

//     console.log('Results in vehicleData middleware', json.length);
//     req.vehicleData = reply;
//     next();
//   } catch (err) {
//     console.log('Data request failed', err);
//     res.json({ message: 'Data request failed', error: err});
//   }
// }
  
  
  
  
  // async function mainEvent() {
  //   const mainForm = document.querySelector('.main_form');
  //   const loadDataButton = document.querySelector('#data_load');
  //   const ctx = document.getElementById('myChart');
  //   const textFieldMake = document.querySelector('#make');
  //   const textFieldCountry = document.querySelector('#country');

  //   let currentList = [];

  //   loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
  //         // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form
          
  //         //loadAnimation.style.display = 'inline-block'
      
  //         // Basic GET request - this replaces the form Action.
  //         const results = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json');
      
  //         // This changes the response from the GET into data we can use - an "object"
  //         currentList = await results.json();
  //         console.table(currentList);
  //   });
  // };

  // document.addEventListener('DOMContentLoaded', async () => mainEvent());

/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
    console.log('fired injectHTML');
    const target = document.querySelector('#restaurant_list');
    target.innerHTML = '';
    list.forEach((item) => {
        const str = `<li>${item.name}</li>`;
        target.innerHTML += str;
    });
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {

    return list.filter((item) => {
      
      const lowerCaseName = item.name.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    });
    /*
      Using the .filter array method, 
      return a list that is filtered by comparing the item name in lower case
      to the query in lower case
      Ask the TAs if you need help with this
    */
}
  
  function cutRestaurantList(list) {
    console.log('fired cut list');
    const range = [...Array(15).keys()];
    console.log("range", range);
    return(newArray = range.map((item) => {
      const index = getRandomIntInclusive(0, list.length - 1);
      return list[index]
      
    }));
  }

  // function initMap(){
  //   const carto = L.map('map').setView([38.98, -76.93], 13);
  //   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  //   }).addTo(carto);
  //   return carto;
  // }
    
  // function markerPlace(array, map) {
  //   console.log('array for markers', array);

  //   map.eachLayer((layer) => {
  //     if (layer instanceof L.Marker) {
  //       layer.remove();
  //     }
  //   });

  //   array.forEach((item) => {
  //     console.log('markerPlace', item);
  //     const {coordinates} = item.geocoded_column_1;
  //     L.marker([coordinates[1], coordinates[0]]).addTo(map);
  //   })
  // }

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
  function shapeDataForChart(array) {
    
    return array.reduce((collection, item) => {
      if(!collection[item.category]) {
        collection[item.category] = [item];
      } else {
        collection[item.category].push(item);
      }
      return collection;
    }, {});
  }

  async function mainEvent() { // the async keyword means we can make API requests
    const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    const filterButton = document.querySelector('#filter');
    const clearDataButton = document.querySelector('#data_clear');
    const generateListButton = document.querySelector('#generate');
    const textField = document.querySelector('#resto');
    const chartTarget = document.querySelector('#myChart');


    // Add a querySelector that targets your filter button here
  
    const loadAnimation = document.querySelector('#data_load_animation');
    loadAnimation.style.display = "none";
    generateListButton.classList.add("hidden");
    
    // const carto = initMap();
    
    
    const storedData = localStorage.getItem("storedData");
    let parsedData = JSON.parse(storedData);
    if (parsedData?.length > 0 ) {
      generateListButton.classList.remove("hidden");
    }



    let currentList = []; // this is "scoped" to the main event function

    console.log('Loading Data');
      loadAnimation.style.display = 'inline-block'
  
      // Basic GET request - this replaces the form Action.
      const results = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json');
  
      // This changes the response from the GET into data we can use - an "object"
      const storedList = await results.json();
      // change storedList object ot results array
      const dataList = storedList.Results;
      localStorage.setItem('storedData', JSON.stringify(dataList));
      
      parsedData = dataList;


      if (parsedData?.length > 0 ) {
        generateListButton.classList.remove("hidden");
      }

      

      let obj = {};

      for (let i = 0, j = parsedData.length; i < j; i++) {
        if (obj[parsedData[i].Country]) {
          obj[parsedData[i].Country]++;
        }
        else {
          obj[parsedData[i].Country] = 1;
        } 
      }

     
      const shapedData = shapeDataForChart(parsedData);

      let myChart = initChart(chartTarget, obj);

      loadAnimation.style.display = 'none';

      const dropdown = document.getElementById("filter");
      
      dropdown.addEventListener("change", (event) => {
        const selectedOption = event.target.value;
        
        
        console.log(Object.keys(obj));
        console.log(selectedOption);
        
        for (let i = 0, j = Object.keys(obj).length; i < j; i++) {

          if (String(selectedOption) === 'ALL') {
            
            myChart.destroy();
            myChart = initChart(chartTarget, obj);
          }

          if (Object.keys(obj)[i] === String(selectedOption)) {
            console.log("hello", Object.keys(obj)[i]);
            const hello = Object.keys(obj)[i];
            const arr = {};
            arr[Object.keys(obj)[i]] = Object.values(obj)[i];

            myChart.destroy();
            myChart = initChart(chartTarget, arr);
              
          };
            
            
        }
        

      });
    
    
    /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
    loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
      // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form
      
      
    });
  
  

    generateListButton.addEventListener('click', (event) => {
      console.log('generate new list');

      currentList = cutRestaurantList(parsedData);
      console.log(currentList);
      injectHTML(currentList);
      // markerPlace(currentList, carto);
    });

    textField.addEventListener('input', (event) => {
      console.log('input', event.target.value);
      const newList = filterList(currentList, event.target.value);
      console.log(newList);
      injectHTML(newList);
      // markerPlace(newList, carto);
    });

    clearDataButton.addEventListener("click", (event) => {
      console.log("clear browser data");
      localStorage.clear();
      console.log("localStorage Check", localStorage.getItem("storedData"));
    })
  }
  
  function filterCountry() {
    const charts = document.querySelectorAll(".chart");

 
  }

  function destroyChart(chart) {
    chart.destroy();
  }
  document.addEventListener('DOMContentLoaded', async () => mainEvent());

