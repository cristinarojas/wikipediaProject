/*

You’ll have 24hrs to complete this coding challenge. It's important to note that there are many ways to complete this challenge. We are ultimately trying to get a sense of how you code and solve problems.

Leveraging the Wikipedia API, we’d like you to use HTML, CSS and Javascript to read the API and display it in an organized way. The UI should contain a search field that allows the end user to enter queries and return the results. In addition, you should add in some sort of sorting/filtering to the front-end. You can add in additional touches as you see fit to enhance the user experience. Please do not make use of any frameworks for this exercise (Only use vanilla js/css) AND be sure to make it responsive.

API Main page:
https://www.mediawiki.org/wiki/API:Main_page

You can send the result back to me via github OR by way of a code pen.

*/

// DOM elements
var modal = document.getElementById('modal');
var trigger = document.getElementById('user-search');
var closeButton = document.getElementById('close-button');
var search = document.getElementById('search');
var modalContent = document.getElementById('modal-content');
var content = document.getElementById('content');
var resultsContainer = document.getElementById('results-container');

// New DOM elements
var listsElement = document.createElement('ul');

// Functions for modal
function toggleModal() {
  if(modal.classList.contains('show-modal')) {
    modal.classList.remove('show-modal');
  } else {
    modal.classList.add('show-modal');
  }

  search.focus();
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

// Function for search
function handleSearch(value) {
  if (value.length === 0) {
    listsElement.innerHTML = '';
  } else if (value.length >= 3) {
    const url = 'https://en.wikipedia.org/w/api.php';

    fetch(`http://localhost:3000/api/search/${value}`)
      .then(response => response.json())
      .then(data => {
        // If the server returns some data
        if (data.query) {
          // If there are no results from the search we show an error
          if (data.query.search.length === 0) {
            listsElement.innerHTML = `<li>No results with this search</li>`;
          } else {
            // If there are results from the search we show the data
            const searchResults = data.query.search;

            // Clean up the list every time a search is performed
            listsElement.innerHTML = '';

            searchResults.forEach(result => {
              let list = document.createElement('li');
              let aElement = document.createElement('a');
              let title = document.createElement('p');

              listsElement.className = 'results';
              resultsContainer.className = 'results-container';
              listsElement.id = 'results';

              list.setAttribute('id', result.pageid);

              aElement.setAttribute('href', '#');
              list.setAttribute('onclick', `showPage(${result.pageid})`)
              aElement.innerHTML = result.snippet;
              title.innerHTML = result.title;

              listsElement.appendChild(list);
              list.appendChild(title);
              list.appendChild(aElement);

              resultsContainer.appendChild(listsElement);
            });
          }
        } else if (data.error) {
          // If the server is too busy or down we show an error
          listsElement.innerHTML = `<li>${data.error.info}</li>`;
        }
      });
  }
}

// Debounce function, to add a delay on each function call
function debounce(func, time) {
  return (args) => {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();

    if (previousCall && ((this.lastCall - previousCall) <= time)) {
      clearTimeout(this.lastCallTimer);
    }

    this.lastCallTimer = setTimeout(() => func(args), time);
  }
}

// Debouncing function to avoid too much API calls
var debouncedHandleSearch = debounce(handleSearch, 250);

// Function to show individual selected result
function showPage(pageId) {
  fetch(`http://localhost:3000/api/page/${pageId}`)
    .then(response => response.json())
    .then(data => {
      const html = data.parse.text['*'];

      toggleModal();

      content.innerHTML = html;
    });
}

// Event listeners
// Modal Event listeners
trigger.addEventListener('click', toggleModal, false);
closeButton.addEventListener('click', toggleModal, false);
window.addEventListener('click', windowOnClick, false);
