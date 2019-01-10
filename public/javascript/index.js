"use strict";

// Manage application state

var applicationState = (function() {
  var phrase = "";

  function setStateForSearchTerm(e) {
    var value = e.target.value;

    var spaceRemoved = value.replace(/\s/g, "");
    phrase = spaceRemoved;
  }

  function showSearchPhraseState() {
    if (phrase.length === 0) {
      return false;
    } else {
      return phrase;
    }
  }

  return {
    setStateForSearchTerm: setStateForSearchTerm,
    showSearchPhraseState: showSearchPhraseState
  };
})();
// =================================================

// Set up event handlers when dom has loaded

document.addEventListener(
  "DOMContentLoaded",
  function() {
    // Get DOM NODES
    var submitButton = document.getElementsByClassName("submit")[0];
    var favButton = document.getElementsByClassName("Favorite-button")[0];
    var infoButton = document.getElementsByClassName("btn-info")[0];
    var viewfavButton = document.getElementsByClassName("View-favorites")[0];
    var searchTermInputBox = document.getElementsByClassName(
      "moive-term-input"
    )[0];

    // ADD event handlers
    infoButton.addEventListener("click", getListOfFavortesFromBackEnd, false);
    favButton.addEventListener("click", sendLikeToBackEnd, false);
    submitButton.addEventListener("click", fetchTerm, false);
    viewfavButton.addEventListener("click", removeSuccussBanner, false);
    searchTermInputBox.addEventListener("focus", removeErrorBanner);
    searchTermInputBox.addEventListener("focus", removeSuccussBanner);
    searchTermInputBox.addEventListener(
      "change",
      applicationState.setStateForSearchTerm,
      false
    );
  },
  false
);

// =================================================

// API Calls
function fetchTerm() {
  var phrase = applicationState.showSearchPhraseState();
  if (!phrase) {
    renderError("There was an error. Please try again");
  } else {
    var url = "https://www.omdbapi.com/?t=" + phrase + "&apikey=b40bc90f";
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        var Title = response.Title,
          Actors = response.Actors,
          Plot = response.Plot,
          Released = response.Released;

        clearFormInput();
        if (Title === undefined) {
          renderError("There was an error");
        } else {
          clearPreviousSearch();
          renderOutout(Title, Actors, Plot, Released);
        }
      })
      .catch(function(response) {
        renderError("There was an error");
      });

    return true;
  }
}

function getListOfFavortesFromBackEnd(e) {
  e.preventDefault();

  fetch("/favorites", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function(res) {
      return res.json();
    })
    .then(function(response) {
      renderFavorites(response);
    })
    .catch(function(error) {
      return console.error("Error:", error);
    });
}

function sendLikeToBackEnd() {
  var titleNode = document.getElementById("title-of-movie");
  var actorNode = document.getElementById("actors-of-movie");
  var releaseNode = document.getElementById("release-of-movie");
  var plotNode = document.getElementById("plot-of-movie");

  var titleContent = titleNode.textContent;
  var actorContent = actorNode.textContent;
  var releaseContent = releaseNode.textContent;
  var plotContent = plotNode.textContent;

  var data = {
    title: titleContent,
    actor: actorContent,
    release: releaseContent,
    plot: plotContent
  };

  fetch("/favorites", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function(response) {
      var status = response.status;
      if (status === 404) {
        renderError("You already favorited that moive");
      } else {
        renderSuccuss();
      }
    })
    .catch(function(error) {
      return console.error("Error:", error);
    });
}
// =================================================

// Render functions. Functions that interact with the DOM
function clearPreviousSearch() {
  var myNode = document.getElementsByClassName("card")[0];
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
    document.getElementsByClassName("alert-danger")[0].style.display = "none";
  }
}

function clearPreviousFavorites() {
  var myNode = document.getElementsByClassName("modal-body")[0];
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}

function renderFavorites(response) {
  clearPreviousFavorites();
  var movies = response.movies;
  movies.map(function(el, i) {
    var title = el.title,
      actor = el.actor,
      release = el.release,
      plot = el.plot;
    var cardContainer = document.createElement("div");
    cardContainer.className = "card";
    var titleDiv = document.createElement("h5");
    var actorsDiv = document.createElement("h6");
    var releaseDiv = document.createElement("p");
    var plotDiv = document.createElement("p");

    // Set inner content
    titleDiv.innerHTML = title;
    actorsDiv.innerHTML = actor;
    releaseDiv.innerHTML = release;
    plotDiv.innerHTML = plot;

    titleDiv.id = "title-of-movie";
    actorsDiv.id = "actors-of-movie";
    releaseDiv.id = "release-of-movie";
    plotDiv.id = "plot-of-movie";

    cardContainer.append(titleDiv);
    cardContainer.append(actorsDiv);
    cardContainer.append(releaseDiv);
    cardContainer.append(plotDiv);

    document.getElementsByClassName("modal-body")[0].append(cardContainer);
  });
}

function removeErrorBanner() {
  document.getElementsByClassName("alert-danger")[0].style.display = "none";
}

function removeSuccussBanner() {
  document.getElementsByClassName("alert-success")[0].style.display = "none";
}

function clearFormInput() {
  document.getElementById("mySearchForm").reset();
}

function renderError(Error) {
  document.getElementsByClassName("alert-danger")[0].style.display = "block";
  document.getElementsByClassName("alert-danger")[0].innerText = Error;
}

function renderSuccuss() {
  document.getElementsByClassName("alert-success")[0].style.display = "block";
  document.getElementsByClassName("alert-success")[0].innerText = "Success";
}

function renderOutout(Title, Actors, Plot, Released) {
  document.getElementsByClassName("list-of-moives-retrived")[0].style.display =
    "block";

  var titleDiv = document.createElement("h5");
  var actorsDiv = document.createElement("h6");
  var releaseDiv = document.createElement("p");
  var plotDiv = document.createElement("p");

  titleDiv.innerHTML = Title;
  actorsDiv.innerHTML = Actors;
  releaseDiv.innerHTML = Released;
  plotDiv.innerHTML = Plot;

  titleDiv.id = "title-of-movie";
  actorsDiv.id = "actors-of-movie";
  releaseDiv.id = "release-of-movie";
  plotDiv.id = "plot-of-movie";

  document.getElementsByClassName("card")[0].appendChild(titleDiv);
  document.getElementsByClassName("card")[0].appendChild(actorsDiv);
  document.getElementsByClassName("card")[0].appendChild(releaseDiv);
  document.getElementsByClassName("card")[0].appendChild(plotDiv);
}

//  =================================================
