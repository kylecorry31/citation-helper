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
      <p>Last name</p>
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
    journal: id('journal').value,
    volume: id('volume').value,
    num: id('issue-num').value,
    date: id('issue-date').value,
    pages: id('pages').value,
    doi: id('doi').value
  };

}


function createCitation(info){

  var authors = '';
  if(info.authors){
    var numAuthors = info.authors.length;
    info.authors.forEach((author, index) => {
      if (author.first && index == 0){
        authors += `${author.last}, ${author.first}`;
      } else if (author.first){
        authors += `${author.first} ${author.last}`;
      } else {
        authors += author.last;
      }

      if (index === numAuthors - 2){
        if (numAuthors > 2){
          authors += ",";
        }
        authors += " and ";
      } else if (index !== numAuthors - 1){
        authors += ", ";
      } else {
        authors += ".";
      }

    });

  }


  var doi = info.doi ? `doi:${info.doi}.` : "";
  var volume = info.volume ? ` ${info.volume}` : "";
  var num = info.num ? `, no. ${info.num}` : "";
  var date = info.date ? ` (${info.date})` : "";
  var pages = info.pages ? `: ${info.pages}` : "";

  return `${authors} "${info.title}". <em>${info.journal}</em>${volume}${num}${date}${pages}. ${doi}`;
}

function id(id){
  return document.getElementById(id);
}
