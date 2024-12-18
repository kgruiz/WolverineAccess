window.addEventListener("scroll", () => {

  const backToTopButton = document.querySelector(".back-to-top")
  const homeButton = document.querySelector(".home-button")


  if (window.scrollY > 200) {
    backToTopButton.style.display = "block"
    homeButton.style.display = "block"

  }


  else {
    backToTopButton.style.display = "none"
    homeButton.style.display = "none"
  }

})


document.querySelector(".back-to-top").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})


document.querySelector(".home-button").addEventListener("click", () => {
  window.location.href = "index.html"
})



const showMoreButton = document.getElementById("show-more")

const showLessButton = document.getElementById("show-less")

const showAllButton = document.getElementById("show-all")

let linksData = []
let initialLoaded = false


fetch("JSON Files/tasks.json")
  .then(response => response.json())
  .then(data => {
    linksData = data

    const mostPopularContainer = document.getElementById("most-popular-container")


    if (mostPopularContainer) {
      const sortedByRank = [...linksData].sort((a, b) => a.currentRating - b.currentRating)
      const top4 = sortedByRank.slice(0,4)


      top4.forEach(link => {
        const card = CreateCard(link)
        mostPopularContainer.append(card)
      })
    }

    const allLinksContainer = document.getElementById("all-links-container")


    if (allLinksContainer) {
      const sortedByRank = [...linksData].sort((a, b) => a.currentRating - b.currentRating)
      const top10 = sortedByRank.slice(0,10)
      const next30 = sortedByRank.slice(10,40)


      top10.forEach(link => {
        const card = CreateCard(link)
        card.classList.add("initial-cards")
        allLinksContainer.append(card)
      })


      next30.forEach(link => {
        const card = CreateCard(link)
        card.classList.add("additional-cards", "hidden")
        allLinksContainer.append(card)
      })
    }

    const allLinksFullContainer = document.getElementById("all-links-full-container")


    if (allLinksFullContainer) {

      function RenderAllLinksFull(sortType) {

        allLinksFullContainer.innerHTML = ""
        let linksToShow = [...linksData]


        if (sortType === "rank") {
          linksToShow.sort((a, b) => a.currentRating - b.currentRating)
        }

        else if (sortType === "alphabetical") {
          linksToShow.sort((a, b) => a.title.localeCompare(b.title))
        }


        linksToShow.forEach(link => {
          const card = CreateCard(link)
          allLinksFullContainer.append(card)
        })
      }


      // Initially show by rank
      RenderAllLinksFull("rank")


      const toggle = document.getElementById("toggle")
      toggle.addEventListener("change", () => {

        if (toggle.checked) {
          RenderAllLinksFull("alphabetical")
        }

        else {
          RenderAllLinksFull("rank")
        }
      })
    }

  })


showMoreButton.addEventListener("click", () => {
  const additionalCards = document.querySelectorAll(".additional-cards")


  additionalCards.forEach(card => {
    card.classList.remove("hidden")
  })


  showMoreButton.classList.add("hidden")
  showLessButton.classList.remove("hidden")
  showAllButton.classList.remove("hidden")
})


showLessButton.addEventListener("click", () => {
  const additionalCards = document.querySelectorAll(".additional-cards")


  additionalCards.forEach(card => {
    card.classList.add("hidden")
  })


  showMoreButton.classList.remove("hidden")
  showLessButton.classList.add("hidden")
  showAllButton.classList.add("hidden")
})


function CreateCard(link) {

  const card = document.createElement('a');
  card.className = 'card';
  card.href = link.href;

  if (link.openInNewWindow) {
    card.target = "_blank"
    card.rel = "noopener"
  }

  const header = document.createElement('h3');
  header.textContent = link.title;
  card.appendChild(header);


  const subHeader = document.createElement('p');
  subHeader.className = 'sub-header';
  subHeader.textContent = link.applicationName;
  card.appendChild(subHeader);


  const img = document.createElement("img")
  img.src = link.image
  img.alt = link.alt
  card.appendChild(img)


  return card;
}


let tasks = [];
let sortByRating = true;


function LoadTasks() {

  fetch('tasks.json')
    .then(response => response.json())
    .then(data => {
      tasks = data;
      RenderTasks();
    });

}


function RenderTasks() {

  const container = document.getElementById('all-links-full-container');
  if(!container) return;


  container.innerHTML = '';


  if (sortByRating) {
    tasks.sort((a, b) => b.rating - a.rating);
  }

  else {
    tasks.sort((a, b) => a.title.localeCompare(b.title));
  }


  tasks.forEach(task => {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = task.href;
    if (task.openInNewWindow) {
      card.target = "_blank";
      card.rel = "noopener";
    }

    card.innerHTML = `
      <h2>${task.title}</h2>
      <p>${task.description}</p>
      <p>Rating: ${task.rating}</p>
    `;
    container.appendChild(card);
  });

}


const sortTypeSelector = document.getElementById('toggle');

sortTypeSelector.addEventListener('change', function() {

  sortByRating = !sortByRating;
  RenderTasks();

});


document.addEventListener('DOMContentLoaded', function() {

  LoadTasks();
});
