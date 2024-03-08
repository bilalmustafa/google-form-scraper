const util = require("util");
const scraper = require("../dist").GoogleFormsScraper();

const input = {
  url:
    "https://docs.google.com/forms/d/e/1FAIpQLSdMQCw_BzKaN8DjRVh-Xxn11zDT424SHX_HTmoFyMJQZepTJA/viewform"
};
//Act
scraper
  .getFormTemplate(input)
  //Assert
  .then(response => {
    console.log(
      util.inspect(response, { showHidden: false, depth: null, colors: true })
    );
  })
  .then(() => {
    console.log("Hello");
  });

//Full Form: https://docs.google.com/forms/d/e/1FAIpQLSeG7cGqUZ4FhohjWkv3Ei_AYWEiAR9A4qk-ZV1qOUWUs8FNLw/viewform
