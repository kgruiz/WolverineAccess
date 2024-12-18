window.addEventListener("scroll", () => {
  const backToTopButton = document.querySelector(".back-to-top")
  const homeButton = document.querySelector(".home-button")

  if (window.scrollY > 200) {
    backToTopButton.style.display = "block"
    homeButton.style.display = "block"
  } else {
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
        const card = createCard(link)
        mostPopularContainer.append(card)
      })
    }

    const allLinksContainer = document.getElementById("all-links-container")
    if (allLinksContainer) {

      const sortedByRank = [...linksData].sort((a, b) => a.currentRating - b.currentRating)
      const top10 = sortedByRank.slice(0,10)
      const next30 = sortedByRank.slice(10,40)

      top10.forEach(link => {
        const card = createCard(link)
        card.classList.add("initial-cards")
        allLinksContainer.append(card)
      })

      next30.forEach(link => {
        const card = createCard(link)
        card.classList.add("additional-cards", "hidden")
        allLinksContainer.append(card)
      })
    }

    const allLinksFullContainer = document.getElementById("all-links-full-container")
    if (allLinksFullContainer) {

      // Add references to the radio buttons
      const sortOptions = document.getElementsByName("sort")

      const renderAllLinksFull = (sortType) => {
        allLinksFullContainer.innerHTML = ""
        let linksToShow = [...linksData]

        if (sortType === "rank") {
          linksToShow.sort((a, b) => a.currentRating - b.currentRating)
        } else if (sortType === "alphabetical") {
          linksToShow.sort((a, b) => a.header.localeCompare(b.header))
        }

        linksToShow.forEach(link => {
          const card = createCard(link)
          allLinksFullContainer.append(card)
        })
      }

      // Initially render links sorted by rank
      renderAllLinksFull("rank")

      // Add event listeners to radio buttons
      sortOptions.forEach(option => {
        option.addEventListener("change", () => {
          if (option.checked) {
            renderAllLinksFull(option.value)
          }
        })
      })
    }

  })

// Replace sortSlider and sortLabel with toggleSwitch and label elements
const toggleSwitch = document.getElementById("toggleSwitch")
const labelRank = document.getElementById("labelRank")
const labelAlphabetical = document.getElementById("labelAlphabetical")

// Remove previous sortSlider event listeners
// ...existing code related to sortSlider...

const RenderAllLinksFull = (sortType) => {
  allLinksFullContainer.innerHTML = ""
  let linksToShow = [...linksData]

  if (sortType === "rank") {
    linksToShow.sort((a, b) => a.currentRating - b.currentRating)
  } else if (sortType === "alphabetical") {
    linksToShow.sort((a, b) => a.header.localeCompare(b.header))
  }

  linksToShow.forEach(link => {
    const card = createCard(link)
    allLinksFullContainer.append(card)
  })
}

// Initially render links sorted by rank
RenderAllLinksFull("rank")

// Update sort based on toggle switch state
toggleSwitch.addEventListener("change", () => {
  if (toggleSwitch.checked) {
    RenderAllLinksFull("alphabetical")
    labelRank.classList.remove("active")
    labelAlphabetical.classList.add("active")
  } else {
    RenderAllLinksFull("rank")
    labelRank.classList.add("active")
    labelAlphabetical.classList.remove("active")
  }
})

// Animate the slider thumb if necessary
// ...existing code...

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
// Ensure the slider thumb moves correctly with the slider input

  showMoreButton.classList.remove("hidden")
  showLessButton.classList.add("hidden")
  showAllButton.classList.add("hidden")
})

function createCard(link) {
  const card = document.createElement('div');
  card.className = 'card';

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
