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

document.querySelector(".back-to-top")?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})

document.querySelector(".home-button")?.addEventListener("click", () => {
  window.location.href = "index.html"
})

let linksData = []
let tasks = []
let sortByRating = true

fetch("JSON Files/tasks.json")
  .then(response => {
    if (!response.ok) {
      console.error("Failed to load tasks.json. Make sure it exists at JSON Files/tasks.json.")
      return []
    }
    return response.json()
  })
  .then(data => {
    linksData = data
    initializePage()
  })
  .catch(() => {
    console.error("Error fetching tasks.json.")
    initializePage()
  });

function initializePage() {
  const mostPopularContainer = document.getElementById("most-popular-container")
  if (mostPopularContainer && linksData.length > 0) {
    const sortedByRank = [...linksData].sort((a, b) => b.currentRating - a.currentRating)
    const top4 = sortedByRank.slice(0, 4)
    top4.forEach(link => {
      const card = CreateCard(link)
      mostPopularContainer.append(card)
    })
  }

  const allLinksContainer = document.getElementById("all-links-container")
  if (allLinksContainer && linksData.length > 0) {
    const sortedByRank = [...linksData].sort((a, b) => b.currentRating - a.currentRating)
    const top10 = sortedByRank.slice(0, 10)
    const next30 = sortedByRank.slice(10, 40)

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
    let sortType = "rank"
    let searchTerm = ""

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('q')) {
      searchTerm = urlParams.get('q').toLowerCase()
    }

    function RenderAllLinksFull() {
      allLinksFullContainer.innerHTML = ""
      let linksToShow = [...linksData]

      if (sortType === "rank") {
        linksToShow.sort((a, b) => b.currentRating - a.currentRating)
      } else if (sortType === "alphabetical") {
        linksToShow.sort((a, b) => a.title.localeCompare(b.title))
      }

      if (searchTerm.trim() !== "") {
        linksToShow = linksToShow.filter(link =>
          link.title.toLowerCase().includes(searchTerm) ||
          link.applicationName.toLowerCase().includes(searchTerm)
        )
      }

      if (linksToShow.length === 0) {
        const noResults = document.createElement('p')
        noResults.textContent = "No results found."
        allLinksFullContainer.appendChild(noResults)
      } else {
        linksToShow.forEach(link => {
          const card = CreateCard(link)
          allLinksFullContainer.append(card)
        })
      }
    }

    RenderAllLinksFull()

    const toggle = document.getElementById("toggle")
    if (toggle) {
      toggle.addEventListener("change", () => {
        if (toggle.checked) {
          sortType = "alphabetical"
        } else {
          sortType = "rank"
        }
        RenderAllLinksFull()
      })
    }

    const fullSearchInput = document.getElementById("fullSearchInput")
    if (fullSearchInput) {
      fullSearchInput.value = searchTerm
      fullSearchInput.addEventListener("input", () => {
        searchTerm = fullSearchInput.value.toLowerCase()
        RenderAllLinksFull()
      })
    }
  }

  // Setup suggestion handling for index page search bars if present
  const headerInput = document.getElementById("headerSearchInput")
  const headerSuggestions = document.getElementById("headerSearchSuggestions")
  const heroInput = document.getElementById("heroSearchInput")
  const heroSuggestions = document.getElementById("heroSearchSuggestions")

  if (headerInput && headerSuggestions) {
    SetupSearchSuggestions(headerInput, headerSuggestions)
  }
  if (heroInput && heroSuggestions) {
    SetupSearchSuggestions(heroInput, heroSuggestions)
  }

  const showMoreButton = document.getElementById("show-more")
  const showLessButton = document.getElementById("show-less")
  const showAllButton = document.getElementById("show-all")

  showMoreButton?.addEventListener("click", () => {
    const additionalCards = document.querySelectorAll(".additional-cards")
    additionalCards.forEach(card => {
      card.classList.remove("hidden")
    })
    showMoreButton.classList.add("hidden")
    showLessButton.classList.remove("hidden")
    showAllButton.classList.remove("hidden")
  })

  showLessButton?.addEventListener("click", () => {
    const additionalCards = document.querySelectorAll(".additional-cards")
    additionalCards.forEach(card => {
      card.classList.add("hidden")
    })
    showMoreButton.classList.remove("hidden")
    showLessButton.classList.add("hidden")
    showAllButton.classList.add("hidden")
  })
}

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

function LoadTasks() {
  fetch('tasks.json')
    .then(response => response.json())
    .then(data => {
      tasks = data;
      RenderTasks();
    }).catch(() => console.error("Failed to load tasks.json for tasks"));
}

function RenderTasks() {
  const container = document.getElementById('all-links-full-container');
  if (!container || tasks.length === 0) return;

  container.innerHTML = '';

  if (sortByRating) {
    tasks.sort((a, b) => b.rating - a.rating);
  } else {
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
if (sortTypeSelector) {
  sortTypeSelector.addEventListener('change', function () {
    sortByRating = !sortByRating;
    RenderTasks();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  LoadTasks();
});

/* Dropdown Logic */
const groupSelector = document.getElementById('group-selector')
const groupSelectorToggle = document.getElementById('group-selector-toggle')
const groupSelectorMenu = document.getElementById('group-selector-menu')
const currentGroupDisplay = document.getElementById('current-group')

let clickedOpen = false

groupSelector?.addEventListener('mouseover', () => {
  if (!clickedOpen) {
    groupSelectorMenu.style.display = 'flex'
  }
})

groupSelector?.addEventListener('mouseout', () => {
  if (!clickedOpen) {
    groupSelectorMenu.style.display = 'none'
  }
})

groupSelectorToggle?.addEventListener('click', (e) => {
  e.preventDefault()
  clickedOpen = !clickedOpen
  groupSelectorMenu.style.display = clickedOpen ? 'flex' : 'none'
})

document.addEventListener('click', (event) => {
  if (clickedOpen && !groupSelector.contains(event.target)) {
    clickedOpen = false
    groupSelectorMenu.style.display = 'none'
  }
})

const groupSelectorMenuLinks = groupSelectorMenu?.querySelectorAll('a')
groupSelectorMenuLinks?.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const selectedGroup = link.getAttribute('data-group')
    currentGroupDisplay.textContent = selectedGroup
    clickedOpen = false
    groupSelectorMenu.style.display = 'none'
  })
})


/* Search Suggestions Functionality */
function SetupSearchSuggestions(inputElement, suggestionsContainer) {
  let currentIndex = -1
  let suggestionItems = []

  inputElement.addEventListener("input", onInput)
  inputElement.addEventListener("keydown", onKeyDown)
  document.addEventListener("click", onDocumentClick)

  function onInput() {
    const query = inputElement.value.trim().toLowerCase()
    if (!query) {
      hideSuggestions()
      return
    }

    // If linksData is empty or not loaded, we still show top suggestion
    const filtered = linksData.filter(link =>
      link.title?.toLowerCase().includes(query) ||
      link.applicationName?.toLowerCase().includes(query)
    )

    buildSuggestions(query, filtered.slice(0, 5))
  }

  function buildSuggestions(query, results) {
    suggestionsContainer.innerHTML = ""
    currentIndex = -1
    suggestionItems = []

    // Top item: Search for "query"
    const topItem = document.createElement("div")
    topItem.className = "search-suggestion-item"
    topItem.textContent = `Search for "${inputElement.value.trim()}"`

    topItem.addEventListener("click", () => {
      goToSearchPage(inputElement.value.trim())
    })
    suggestionsContainer.appendChild(topItem)
    suggestionItems.push({ element: topItem, isSearchOption: true, link: null })

    // Results
    results.forEach(link => {
      const item = document.createElement("div")
      item.className = "search-suggestion-item"
      item.textContent = link.title
      item.addEventListener("click", () => {
        window.location.href = link.href
      })
      suggestionsContainer.appendChild(item)
      suggestionItems.push({ element: item, isSearchOption: false, link: link.href })
    })

    suggestionsContainer.classList.add("active")
  }

  function hideSuggestions() {
    suggestionsContainer.innerHTML = ""
    suggestionsContainer.classList.remove("active")
    currentIndex = -1
    suggestionItems = []
  }

  function onKeyDown(e) {
    if (!suggestionsContainer.classList.contains("active")) return
    const maxIndex = suggestionItems.length - 1

    if (e.key === "ArrowDown") {
      e.preventDefault()
      currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1
      highlightCurrentItem()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      currentIndex = (currentIndex - 1) < 0 ? maxIndex : currentIndex - 1
      highlightCurrentItem()
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (currentIndex === -1 || suggestionItems[currentIndex].isSearchOption) {
        goToSearchPage(inputElement.value.trim())
      } else {
        window.location.href = suggestionItems[currentIndex].link
      }
    } else if (e.key === "Escape") {
      hideSuggestions()
    }
  }

  function highlightCurrentItem() {
    suggestionItems.forEach((item, index) => {
      if (index === currentIndex) {
        item.element.classList.add("highlighted")
      } else {
        item.element.classList.remove("highlighted")
      }
    })
  }

  function onDocumentClick(e) {
    if (!suggestionsContainer.contains(e.target) && e.target !== inputElement) {
      hideSuggestions()
    }
  }

  function goToSearchPage(query) {
    if (!query) return
    window.location.href = `all-links-full.html?q=${encodeURIComponent(query)}`
  }
}
