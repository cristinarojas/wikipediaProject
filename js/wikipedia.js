(function() {
  console.log('enter');
  var searchElement = document.getElementById('user-search');

  searchElement.addEventListener('change', function(e) {
    console.log('change-->', this.value);
})();

/*

You’ll have 24hrs to complete this coding challenge. It's important to note that there are many ways to complete this challenge. We are ultimately trying to get a sense of how you code and solve problems.

Leveraging the Wikipedia API, we’d like you to use HTML, CSS and Javascript to read the API and display it in an organized way. The UI should contain a search field that allows the end user to enter queries and return the results. In addition, you should add in some sort of sorting/filtering to the front-end. You can add in additional touches as you see fit to enhance the user experience. Please do not make use of any frameworks for this exercise (Only use vanilla js/css) AND be sure to make it responsive.

API Main page:
https://www.mediawiki.org/wiki/API:Main_page

You can send the result back to me via github OR by way of a code pen.




*/
