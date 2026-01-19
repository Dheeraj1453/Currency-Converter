const BASE_URL = "https://api.frankfurter.dev/v1/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".swap-icon");

// Curated list of currencies supported by Frankfurter API + Country Code for Flags
const countryList = {
    AUD: "AU", BGN: "BG", BRL: "BR", CAD: "CA", CHF: "CH",
    CNY: "CN", CZK: "CZ", DKK: "DK", EUR: "FR", GBP: "GB",
    HKD: "HK", HUF: "HU", IDR: "ID", ILS: "IL", INR: "IN",
    ISK: "IS", JPY: "JP", KRW: "KR", MXN: "MX", MYR: "MY",
    NOK: "NO", NZD: "NZ", PHP: "PH", PLN: "PL", RON: "RO",
    SEK: "SE", SGD: "SG", THB: "TH", TRY: "TR", USD: "US",
    ZAR: "ZA"
};

// Populate dropdowns
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  
  msg.innerText = "Getting exchange rate...";

  try {
      // Frankfurter API URL
      const URL = `${BASE_URL}?amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;
      let response = await fetch(URL);
      
      if(!response.ok) throw new Error("API Request Failed");

      let data = await response.json();
      let rate = data.rates[toCurr.value];

      msg.innerText = `${amtVal} ${fromCurr.value} = ${rate} ${toCurr.value}`;
  } catch (error) {
      msg.innerText = "Error fetching rates. Try again.";
      console.error(error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Swap functionality
swapIcon.addEventListener("click", () => {
    let tempCode = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempCode;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
});

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});