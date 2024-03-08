const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const nodeHtmlParser = require("node-html-parser");

const workingUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSeG7cGqUZ4FhohjWkv3Ei_AYWEiAR9A4qk-ZV1qOUWUs8FNLw/viewform";
const filename = "response.txt";
const url =
  "https://docs.google.com/forms/d/e/1FAIpQLSdMQCw_BzKaN8DjRVh-Xxn11zDT424SHX_HTmoFyMJQZepTJA/viewform";

var result = fetch(workingUrl)
  .then(response => (response.ok ? response.text() : Promise.reject()))
  .then(text => nodeHtmlParser.parse(text))
  .then(text => {
    const desktopPath = path.join("/Users/bilal/Desktop", filename);

    try {
      fs.writeFileSync(desktopPath, String(text));
      console.log("File was saved successfully.");
    } catch (error) {
      console.log(error);
    }

    var _a, _b;
    return {
      title:
        ((_a = text.querySelector(`div[role="heading"]:first-child`)) ===
          null || _a === void 0
          ? void 0
          : _a.innerText) || "",
      description:
        ((_b = text.querySelector(`div[dir="auto"]:nth-child(2)`)) === null ||
        _b === void 0
          ? void 0
          : _b.innerText) || "",
      fields: text
        .querySelectorAll("div[role='listitem']:not([jsaction])")
        .map((item, index) => {
          var _a, _b, _c, _d, _e, _f, _g;
          return Object.assign(
            {
              name: "block-" + index,
              text:
                ((_a = item.querySelector(`div[role="heading"]`)) === null ||
                _a === void 0
                  ? void 0
                  : _a.innerText.replace(" *", "")) ||
                ((_b = item.querySelector(
                  'div[dir="auto"]:not([role]) span'
                )) === null || _b === void 0
                  ? void 0
                  : _b.innerText),
              required:
                ((_c = item.querySelector(`div[role="heading"]`)) === null ||
                _c === void 0
                  ? void 0
                  : _c.innerText.includes("*")) || true,
              type: item.querySelector(
                `div[role="radiogroup"]:not(span[dir='auto'])[data-field-index]`
              )
                ? "radiogrid"
                : item.querySelector(
                    `div[role="radiogroup"]:not(span[dir='auto'])`
                  )
                  ? "radio"
                  : item.querySelector(
                      `div[role="radiogroup"] span[dir='auto']`
                    )
                    ? "radiogroup"
                    : item.querySelector('div[role="group"]')
                      ? "checkboxgrid"
                      : item.querySelector('div[role="checkbox"]')
                        ? "checkbox"
                        : item.querySelector(`div[role="list"]`)
                          ? "list"
                          : item.querySelector(`iframe`)
                            ? "Video"
                            : item.querySelector(`textarea`)
                              ? "textarea"
                              : item.querySelector(
                                  `input[type='text'][role='combobox'][aria-label='Hour'], input[type='text'][role='combobox'][aria-label='Minute']`
                                )
                                ? "time"
                                : item.querySelector(
                                    `input[type='text'][role='combobox']`
                                  )
                                  ? "date"
                                  : item.querySelector(`input[type='email']`)
                                    ? "email"
                                    : item.querySelector(`input[type='text']`)
                                      ? "text"
                                      : item.querySelector('div[role="option"]')
                                        ? "dropdown"
                                        : item.querySelector(`img`)
                                          ? "image"
                                          : item.querySelector(
                                              `div[role="heading"]`
                                            )
                                            ? "block"
                                            : "Unknown"
            },
            item.querySelectorAll('div[role="option"]').length > 0
              ? {
                  options: item
                    .querySelectorAll("div[role=option]")
                    .slice(1)
                    .map(item => {
                      var _a;
                      return {
                        text:
                          (_a = item.querySelector("span")) === null ||
                          _a === void 0
                            ? void 0
                            : _a.innerText
                      };
                    })
                }
              : {},
            item.querySelectorAll(`div[role="list"]`).length > 0
              ? {
                  options: item
                    .querySelectorAll(`div[role="list"]`)
                    .map(item => {
                      var _a;
                      return {
                        text:
                          (_a = item.querySelector("span[dir='auto']")) ===
                            null || _a === void 0
                            ? void 0
                            : _a.innerText
                      };
                    })
                }
              : {},
            item.querySelectorAll(`div[role="radiogroup"] span[dir='auto']`)
              .length > 0
              ? {
                  options: item
                    .querySelectorAll(`div[role="radiogroup"] span[dir='auto']`)
                    .map(item => ({ text: item.innerText }))
                }
              : {},
            item.querySelectorAll(`div[role="radiogroup"] label`).length > 0
              ? {
                  options: item
                    .querySelectorAll(`div[role="radiogroup"] label`)
                    .map((_item, index) => {
                      var _a;
                      return {
                        text:
                          (_a = _item.parentNode.firstChild) === null ||
                          _a === void 0
                            ? void 0
                            : _a.innerText,
                        index: index
                      };
                    }),
                  min: {
                    text:
                      item.querySelectorAll(`div[role="radiogroup"] label`)
                        .length > 0 &&
                      ((_d = item.querySelectorAll(
                        `div[role="radiogroup"] label`
                      )[0].parentNode.firstChild) === null || _d === void 0
                        ? void 0
                        : _d.innerText)
                  },
                  max: {
                    text:
                      item.querySelectorAll(`div[role="radiogroup"] label`)
                        .length > 0 &&
                      ((_e = item.querySelectorAll(
                        `div[role="radiogroup"] label`
                      )[0].parentNode.lastChild) === null || _e === void 0
                        ? void 0
                        : _e.innerText)
                  }
                }
              : {},
            item.querySelectorAll(
              'div[role="checkbox"]:not([data-field-index])'
            ).length > 0
              ? {
                  options: item
                    .querySelectorAll(
                      'div[role="checkbox"]:not([data-field-index])'
                    )
                    .map(item => {
                      var _a;
                      return {
                        text:
                          (_a = item.parentNode.querySelector("span")) ===
                            null || _a === void 0
                            ? void 0
                            : _a.innerText
                      };
                    })
                }
              : {},
            item.querySelectorAll("iframe").length > 0
              ? {
                  videoUrl: item
                    .querySelectorAll("iframe")[0]
                    .getAttribute("src")
                }
              : {},
            item.querySelectorAll("img").length > 0
              ? {
                  imageUrl: item.querySelectorAll("img")[0].getAttribute("src")
                }
              : {},
            item.querySelectorAll(
              `div[role="radiogroup"]:not(span[dir='auto'])[data-field-index]`
            ).length > 0
              ? {
                  rows: item
                    .querySelectorAll(
                      `div[role="radiogroup"]:not(span[dir='auto'])[data-field-index]`
                    )
                    .map(item => ({
                      text: item.getAttribute("aria-label"),
                      index: item.getAttribute("data-field-index")
                    })),
                  columns:
                    (_f = item.querySelectorAll(
                      `div[role="radiogroup"]:not(span[dir='auto'])[data-field-index]`
                    )[0].parentNode.firstChild) === null || _f === void 0
                      ? void 0
                      : _f.childNodes
                          .slice(1)
                          .map(childItem => ({ text: childItem.innerText }))
                }
              : {},
            item.querySelectorAll('div[role="group"]').length > 0
              ? {
                  rows: item
                    .querySelectorAll('div[role="group"]')
                    .map(item => ({ text: item.childNodes[0].innerText })),
                  columns:
                    (_g = item.querySelectorAll('div[role="group"]')[0]
                      .parentNode.firstChild) === null || _g === void 0
                      ? void 0
                      : _g.childNodes
                          .slice(1)
                          .map(childItem => ({ text: childItem.innerText })),
                  options: ""
                }
              : {}
          );
        })
    };
  });

async function expandUrl(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow"
    });
    const finalUrl = response.url;
    return finalUrl;
  } catch (error) {
    console.error("Error checking URL:", error);
    // In case of an error, return the original URL as a fallback
    return url;
  }
}

result
  .then(result => {
    expandUrl("https://forms.gle/muFqpEZS6s7LYode9")
      .then(finalUrl => {
        console.log("Final URL:", finalUrl);
      })
      .catch(error => {
        console.log(error);
      });
  })
  .catch(error => {
    console.error(error); // Handle failure
  })
  .finally(() => {
    console.log("Operation completed"); // Always executed
  });
