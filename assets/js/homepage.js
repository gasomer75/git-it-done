// DOM variables
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    // default is to go to URL so prevent default 
    // lets us decide what to do with the input
    event.preventDefault();
    // trim will remove accidental spaces before or after user input
    // so that it will read only characters
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username.");
    }
};

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos for valid user
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // clear old content from elements
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    
    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        // append to the container
        repoEl.appendChild(titleEl);
        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        //check each repo for open issues
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        // append to the container
        repoEl.appendChild(statusEl);
        // append container to the DOM
        repoContainerEl.appendChild(repoEl);
    }
};

var getUserRepos = function(user) {
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl)
        .then(function(response) {
            // response was successful
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function(error) {
            // Notice this '.catch()' getting chained to the end of the '.then()' method
            alert("Unable to connect to GitHub");
        });
};

userFormEl.addEventListener("submit", formSubmitHandler);