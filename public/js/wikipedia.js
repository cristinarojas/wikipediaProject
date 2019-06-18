/*
Leveraging the Wikipedia API, we’d like you to use HTML, CSS and Javascript to read the API and display it in an organized way.
The UI should contain a search field that allows the end user to enter queries and return the results.
In addition, you should add in some sort of sorting/filtering to the front-end.
You can add in additional touches as you see fit to enhance the user experience.
Please do not make use of any frameworks for this exercise (Only use vanilla js/css) AND be sure to make it responsive.

API Main page:
https://www.mediawiki.org/wiki/API:Main_page
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
// Element for sort
var sortAsc = document.createElement('i');
sortAsc.classList.add('fa', 'fa-sort-alpha-asc', 'sortAsc');
sortAsc.setAttribute('id', 'sortAsc');
sortAsc.setAttribute('onclick', `sortList('asc')`);
modalContent.appendChild(sortAsc);

var sortDesc = document.createElement('i');
sortDesc.classList.add('fa', 'fa-sort-alpha-desc', 'sortDesc');
sortDesc.setAttribute('id', 'sortDesc');
sortDesc.setAttribute('onclick', `sortList('desc')`);
modalContent.appendChild(sortDesc);

sortAsc.style.visibility= 'hidden';
sortDesc.style.visibility= 'hidden';

function sortList(dir) {
  var list, i, switching, b, shouldSwitch, switchcount = 0;
  list = document.getElementById('results');
  switching = true;

  while (switching) {
    switching = false;
    b = list.getElementsByTagName('LI');
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (dir == 'asc') {
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == 'desc') {
        if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        switching = true;
      }
    }
  }
}

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
    sortAsc.style.visibility= 'hidden';
    sortDesc.style.visibility= 'hidden';
  } else if (value.length >= 3) {
    fetch(`http://localhost:3000/api/search/${value}`)
      .then(response => response.json())
      .then(data => {
        // If the server returns some data
        if (data.query) {
          // If there are no results from the search we show an error
          if (data.query.search.length === 0) {
            listsElement.innerHTML = '<li>No results for this search</li>';
          } else {
            // If there are results from the search we show the data
            const searchResults = data.query.search;

            sortAsc.style.visibility= 'visible';
            sortDesc.style.visibility= 'visible';

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
