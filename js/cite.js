var clipboard = new ClipboardJS('.clippy');
var lastTimeout = null;
var authorCount = 1;


clipboard.on('success', function(e) {
    id('copy-tooltip').classList.remove('hidden');

    if (lastTimeout !== null){
      clearTimeout(lastTimeout)
    }

    lastTimeout = setTimeout(() => {
      id('copy-tooltip').classList.add('hidden');
      lastTimeout = null;
    }, 2000);

    e.clearSelection();
});

id('clear-btn').addEventListener('click', resetForm);

id('submit-btn').addEventListener('click', (event) => {
  var citation = createCitation(createArticleInfo());
  id('citation').innerHTML = citation;
  id('citation-section').classList.remove('hidden');
});

id('add-author').addEventListener('click', (event) => {
  authorCount++;

  var div = document.createElement('div');
  div.classList.add('author-form');
  div.innerHTML =  `
    <label>
      <p>First name</p>
      <input type="text" id="author${authorCount}-first-name">
    </label>
    <label>
      <p>Last name (or organization)</p>
      <input type="text" id="author${authorCount}-last-name">
    </label>
  `;

  id('extra-authors').appendChild(div);

})

function resetForm(){
  id('extra-authors').innerHTML = "";
  id('citation-section').classList.add('hidden');
  authorCount = 1;
  let inputs = document.getElementsByTagName('input');
  for(var i = 0; i < inputs.length; i++){
    inputs[i].value = "";
  }

  id('month').value = "";
}

function createArticleInfo(){
  var authors = [];

  for(var i = 1; i <= authorCount; i++){
    var first = id(`author${i}-first-name`).value;
    var last = id(`author${i}-last-name`).value;

    if (first || last){
      authors.push({ first: first, last: last });
    }
  }

  return {
    title: id('article-title-input').value,
    authors: authors,
    date: {
      year: id('year').value,
      month: id('month').value,
      day: id('day').value
    },
    url: id('url').value
  }

}


function createCitation(info){

  var authors = '';
  if(info.authors){
    var numAuthors = info.authors.length;
    info.authors.forEach((author, index) => {
      if (author.first){
        authors += `${author.last}, ${author.first.charAt(0)}`;
        if (index !== numAuthors - 1){
          authors += '.';
        }
      } else {
        authors += author.last;
      }

      if (index === numAuthors - 2){
        authors += " & ";
      } else if (index !== numAuthors - 1){
        authors += ", ";
      } else {
        authors += ".";
      }

    });

  }


  var formattedDate = formatDate(info.date);
  var date = `${formattedDate ? formattedDate : 'n.d.'}`
  var fullUrl = `${info.url ? " Retrieved from " + info.url: ""}`
  var title = info.title ? " " + info.title + "." : "";

  if (authors){
    return `${authors} (${date}).${title}${fullUrl}`;
  } else {
    return `${title} (${date}).${fullUrl}`;

  }

}

function formatDate(date){
  var day = date.day;
  var month = date.month;
  var year = date.year;

  if (typeof date === 'undefined' || !year){
    return null;
  }

  if (day){
    day = " " + day;
  }

  if (month === ''){
    return `${year}`;
  } else {
    return `${year}, ${month}${day}`;
  }


}


function id(id){
  return document.getElementById(id);
}
