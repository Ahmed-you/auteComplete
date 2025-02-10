import { addWordToInputEnd } from "./Utils/addWordToInputEnd.js";

const autoCompleteForm = getElement(".c-form");
const cFormInput = autoCompleteForm.elements[0];
const suggestionsListDomElement = getElement(".suggestionsList");

suggestionsListDomElement.classList.add("hide");
let suggestionsListLength = 0;
let counter = 0;
let suggestions;
let id = null;
const suggestionWordsApi = () => {
  let xhr = new XMLHttpRequest();
  autoCompleteForm.onsubmit = (e) => {
    e.preventDefault();
  };
  // Get a list or suggested words from the API based of the user input
  cFormInput.addEventListener("input", (e) => {
    e.preventDefault();
    clearTimeout(id);

    //Reformatting user input last word for use in the API
    const data = e.target.value.split(" ").filter(Boolean).slice(-1)[0];
    if (data == undefined) {
      suggestionsListDomElement.classList.add("hide");
      suggestionsListDomElement.innerHTML = "";
      autoCompleteForm.classList.remove("RemoveBottomRadius");

      return;
    }
    let url = `/api/suggestedWord?word=${data}`;

    id = setTimeout(() => {
      xhr.open("GET", url, true);
      xhr.send();
    }, 400);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let suggestionObj = JSON.parse(xhr.responseText);
        const suggestionsList = suggestionObj.words;
        counter = 0;

        suggestionsListLength =
          suggestionsList == "Nothing Found" ? -1 : suggestionsList.length - 1;
        // handling showing/hiding the list of suggested word on various cases
        if (suggestionsList == "Nothing Found") {
          suggestionsListDomElement.classList.add("hide");
          suggestionsListDomElement.innerHTML = "";
          autoCompleteForm.classList.remove("RemoveBottomRadius");
          return;
        }
        suggestionsListDomElement.classList.remove("hide");
        autoCompleteForm.classList.add("RemoveBottomRadius");
        suggestionsListDomElement.innerHTML = "";
        suggestionsList.forEach((word) => {
          suggestionsListDomElement.insertAdjacentHTML(
            "beforeend",
            `<div class='suggestions'> ${word}</div>`
          );
        });
        suggestions = getElements(".suggestions");
        suggestions[0].classList.add("selected");
      }
    };
  });
};

// lets user select a word from the list by the Arrow Keys
const UpAndDownNavigator = () => {
  cFormInput.addEventListener("keydown", (e) => {
    if (e.key == "ArrowUp") {
      e.preventDefault();
      if (counter == 0) return;

      counter--;
      suggestions[counter + 1].classList.remove("selected");
      suggestions[counter].classList.add("selected");
    } else if (e.key == "ArrowDown") {
      if (counter == suggestionsListLength) return;
      counter++;

      suggestions[counter - 1].classList.remove("selected");

      suggestions[counter].classList.add("selected");
    }
    if (e.code === "Enter") {
      const suggestion = suggestions[counter].textContent.trim();

      // 3. Replace that last word with your chosen suggestion

      addWordToInputEnd(cFormInput, suggestion);
    }
  });
};

// lets user select a word from the list by clicking the world

const clickNavigation = () => {
  suggestionsListDomElement.addEventListener("click", (e) => {
    const selectedWord = e.target.textContent.trim();
    addWordToInputEnd(cFormInput, selectedWord);
  });
};

const init = () => {
  suggestionWordsApi();
  UpAndDownNavigator();
  clickNavigation();
};

init();
