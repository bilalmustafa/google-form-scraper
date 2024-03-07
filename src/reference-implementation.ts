import type { GoogleFormInput, GoogleFormsScraper, getFormTemplate } from './definitions';
import { parse } from 'node-html-parser';

function getForm(dependencies: { fetch: typeof fetch; htmlParser: typeof parse; }): getFormTemplate {
  return (input: GoogleFormInput) => {
    return dependencies.fetch(input.url)
      .then(response => response.ok ? response.text() : Promise.reject())
      .then(text => parse(text))
      .then(text => {
        return ({
          title: text.querySelector(`div[role="heading"]:first-child`)?.innerText || "",
          description: text.querySelector(`div[dir="auto"]:nth-child(2)`)?.innerText || "",
          fields: text.querySelectorAll("div[role='listitem']:not([jsaction])")
            .map((item, index) => Object.assign({
              name: "block-" + index,
              text: item.querySelector(`div[role="heading"]`)?.innerText.replace(" *", "") || item.querySelector('div[dir="auto"]:not([role]) span')?.innerText,
              required: item.querySelector(`div[role="heading"]`)?.innerText.includes("*") || true,
              type: item.querySelector(`div[role="radiogroup"]:not(span[dir='auto'])`) ? "radio" :
                item.querySelector(`div[role="radiogroup"] span[dir='auto']`) ? "radiogroup" :
                item.querySelector('div[role="checkbox"]') ? "checkbox" :
                  item.querySelector(`div[role="list"]`) ? "list" :
                  item.querySelector(`iframe`) ? "Video" :
                    item.querySelector(`textarea`) ? "textarea" :
                    item.querySelector(`input[type='text'][role='combobox'][aria-label='Hour'], input[type='text'][role='combobox'][aria-label='Minute']`) ? "time" :
                    item.querySelector(`input[type='text'][role='combobox']`) ? "date" :
                      item.querySelector(`input[type='email']`) ? "email" :
                        item.querySelector(`input[type='text']`) ? "text" :
                        item.querySelector('div[role="option"]') ? "dropdown" :
                        item.querySelector(`img`) ? "image" :
                         item.querySelector(`div[role="heading"]`) ? "block" :
                          "Unknown",
            },

             item.querySelectorAll('div[role="option"]').length > 0 ? {
              options: item.querySelectorAll('div[role=option]').slice(1).map(item => ({ text: item.querySelector("span")?.innerText }))
             }: {},

              item.querySelectorAll(`div[role="list"]`).length > 0 ? {
                options: item.querySelectorAll(`div[role="list"]`).map(item => ({ text: item.querySelector("span[dir='auto']")?.innerText }))
              } : {},
              item.querySelectorAll(`div[role="radiogroup"] span[dir='auto']`).length > 0 ? {
                options: item.querySelectorAll(`div[role="radiogroup"] span[dir='auto']`).map(item => ({ text: item.innerText }))
              } : {},

              item.querySelectorAll(`div[role="radiogroup"] label`).length > 0 ? {
                options: item.querySelectorAll(`div[role="radiogroup"] label`).map((_item, index) => ({ text: _item.parentNode.firstChild?.innerText, index: index })),
                min: { text: item.querySelectorAll(`div[role="radiogroup"] label`).length > 0 && item.querySelectorAll(`div[role="radiogroup"] label`)[0].parentNode.firstChild?.innerText },
                max: { text: item.querySelectorAll(`div[role="radiogroup"] label`).length > 0 && item.querySelectorAll(`div[role="radiogroup"] label`)[0].parentNode.lastChild?.innerText },
              } : {},

              item.querySelectorAll('div[role="checkbox"]').length > 0 ? { 
              options: item.querySelectorAll('div[role=checkbox]').map(item => ({ text: item.parentNode.querySelector("span")?.innerText }))
             }: {},

             item.querySelectorAll('iframe').length > 0 ? { 
              videoUrl: item.querySelectorAll('iframe')[0].getAttribute('src')
             }: {},

             item.querySelectorAll('img').length > 0 ? { 
              imageUrl: item.querySelectorAll('img')[0].getAttribute('src')
             }: {}

            ))
        });
      });
  };
}

export const GoogleFormsScraperReference: GoogleFormsScraper = (dependencies: { fetch: typeof fetch, htmlParser: typeof parse } = {
  fetch, htmlParser: parse
}) => {
  const getFormTemplateReference: getFormTemplate = getForm(dependencies)
  return {
    getFormTemplate: getFormTemplateReference
  }
}