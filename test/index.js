
// const t = require("tap")

// const scraper = require("../dist").GoogleFormsScraper();

// t.test('this is a child test', t => {
//     //Arrange
//     const input = { url: "https://docs.google.com/forms/d/e/1FAIpQLSe-WZhPGbnn_7oYig2iWHacflIDz8OBIhMHU3cmed3PaGCC9w/viewform" }
//     //Act
//     scraper.getFormTemplate(input)
//         //Assert
//         .then(response => {
//             return t.match(response.title, "Prueba Guesthub")
//         }).then(() => {
//             t.end()
//         })
// })

const util = require('util');
const scraper = require("../dist").GoogleFormsScraper();

const input = { url: "https://docs.google.com/forms/d/e/1FAIpQLScKWVyi2PGa6mAVWpVRgmafDSUgNhLeZq44u5P-TDm4A_yEqw/viewform" }
    //Act
    scraper.getFormTemplate(input)
        //Assert
        .then(response => {
            console.log(util.inspect(response, { showHidden: false, depth: null, colors: true }));
        }).then(() => {
           console.log("Hello")
        })

