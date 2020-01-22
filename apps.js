// API eSxLFExOoksLvnNT5fG
// please test ward jubilee and henlow when evaluating
// other streets are not stable. hard to debug because of location i guess thanks

const infoBox = document.querySelector(".info-box");
const containerBtn = document.querySelectorAll(".search-btn");
document.querySelector(".container-btn").addEventListener("click", startSearch);

function startSearch(e) {
  if (e.target.classList.contains("search-btn")) {
    for (const btn of containerBtn) {
      btn.classList.remove("highlight");
    }

    const streetName = e.target.dataset.streetName;
    const type = e.target.dataset.streetType;

    e.target.classList.add("highlight");
    getTransitData(streetName, type);
  }
}

async function getTransitData(streetName, type) {
  infoBox.innerHTML = "";

  const responseStreets = await fetch(
    `https://api.winnipegtransit.com/v3/streets.json?api-key=eSxLFExOoksLvnNT5fG&name=${streetName}&type=${type}`
  );
  const dataKey = await responseStreets.json();

  let streetKey = parseInt(dataKey.streets[0].key);

  const responseStop = await fetch(
    `https://api.winnipegtransit.com/v3/stops.json?api-key=eSxLFExOoksLvnNT5fG&street=${streetKey}`
  );
  const dataStops = await responseStop.json();

  dataStops.stops.forEach(data => {
    getRoute(data.key);
  });
}

async function getRoute(routeKey) {
  let output = "";
  const responseRoute = await fetch(
    `https://api.winnipegtransit.com/v3/stops/${routeKey}/schedule.json?max-results-per-route=2&api-key=eSxLFExOoksLvnNT5fG`
  );

  const dataRoute = await responseRoute.json();
  const test = dataRoute["stop-schedule"]["route-schedules"];
  console.log(dataRoute);

  output += ` 
      <p><span class="keys">Name:</span> ${dataRoute["stop-schedule"].stop.name}</p>
      <p><span class="keys">Direction:</span> ${dataRoute["stop-schedule"].stop.direction}</p>
      <p><span class="keys">Cross Street Name:</span> ${dataRoute["stop-schedule"].stop["cross-street"].name}</p>
    `;

  if (test && test.length > 0) {
    for (let i = 0; i < test.length; i++) {
      if (i === 0 || i === 1) {
        output += `
      <p><span class="keys">Next Bus Name:</span> ${dataRoute["stop-schedule"]["route-schedules"][i].route.name}</p>
      <p><span class="keys">Route Bus Number:</span> ${dataRoute["stop-schedule"]["route-schedules"][i].route.number}</p>
      <p><span class="keys">Arrival Time:</span> ${dataRoute["stop-schedule"]["route-schedules"][i]["scheduled-stops"][i].times.arrival.scheduled}</p>
      `;
      }

      if (test.length === 1) {
        output += `<p>NEXT BUS IS NOT AVAILABLE</p>`;
      }
    }
  } else {
    output += `<p>NO BUS AVAILABLE</p>`;
  }

  infoBox.insertAdjacentHTML("beforeend", `<div class="data-container">${output}</div>`);
}
