// DOM elements
var modal = document.getElementById('modal');
var trigger = document.getElementById('user-search');
var closeButton = document.getElementById('close-button');
var search = document.getElementById('search');
var modalContent = document.getElementById('modal-content');

// New DOM elements
var listsElement = document.createElement('ul');

// Functions for modal
function toggleModal() {
  if(modal.classList.contains('show-modal')) {
    modal.classList.remove('show-modal');
  } else {
    modal.classList.add('show-modal');
  }
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

// Function for search
var handleSearch = (value) => {
  console.log('-->', value)

  if (value.length > 3) {
    const url = 'https://en.wikipedia.org/w/api.php';

    fetch(`http://localhost:3000/api/search/${value}`)
      .then(response => response.json())
      .then(data => {
        const searchResults = data.query.search;
        //const { snippet } = searchResults;
        console.log('results-->', searchResults);

        searchResults.forEach((result) => {
          let list = document.createElement('li');
          let aElement = document.createElement('a');
          let title = document.createElement('p');

          listsElement.className = 'results';
          listsElement.id= 'results';

          list.setAttribute('id', result.pageid);

          aElement.setAttribute('href', '#');
          aElement.innerHTML = result.snippet;
          title.innerHTML = result.title;

          listsElement.appendChild(list);
          list.appendChild(title);
          list.appendChild(aElement);

          modalContent.appendChild(listsElement);
        });
      });
  }
}

// Event listeners
// Modal Event listeners
trigger.addEventListener('click', toggleModal, false);
closeButton.addEventListener('click', toggleModal, false);
//window.addEventListener('click', windowOnClick, false);



/*

You’ll have 24hrs to complete this coding challenge. It's important to note that there are many ways to complete this challenge. We are ultimately trying to get a sense of how you code and solve problems.

Leveraging the Wikipedia API, we’d like you to use HTML, CSS and Javascript to read the API and display it in an organized way. The UI should contain a search field that allows the end user to enter queries and return the results. In addition, you should add in some sort of sorting/filtering to the front-end. You can add in additional touches as you see fit to enhance the user experience. Please do not make use of any frameworks for this exercise (Only use vanilla js/css) AND be sure to make it responsive.

API Main page:
https://www.mediawiki.org/wiki/API:Main_page

You can send the result back to me via github OR by way of a code pen.




*/
