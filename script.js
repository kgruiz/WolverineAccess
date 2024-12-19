// ===========================================================
// Global Variables
// ===========================================================
let linksData = []
let tasks = []
let sortByRating = true

// ===========================================================
// Event Listeners for Scroll
// ===========================================================
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

// ===========================================================
// Event Listeners for Buttons
// ===========================================================

// Back to Top Button Click Event
document.querySelector(".back-to-top")?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})

// Home Button Click Event
document.querySelector(".home-button")?.addEventListener("click", () => {
  window.location.href = "index.html"
})

// ===========================================================
// Fetch and Initialize Data
// ===========================================================

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
  })

// ===========================================================
// Initialize Page with Data
// ===========================================================
function initializePage() {
  // Populate Most Popular Container
  const mostPopularContainer = document.getElementById("most-popular-container")
  if (mostPopularContainer && linksData.length > 0) {
    const sortedByRank = [...linksData].sort((a, b) => b.currentRating - a.currentRating)
    const top4 = sortedByRank.slice(0, 4)

    top4.forEach(link => {
      const card = CreateCard(link)
      mostPopularContainer.append(card)
    })
  }

  // Populate All Links Container with initial and additional cards
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

  // Populate All Links Full Container with sorting and search
  const allLinksFullContainer = document.getElementById("all-links-full-container")
  if (allLinksFullContainer) {
    let sortType = "rank"
    let searchTerm = ""

    // Get search term from URL parameters if present
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("q")) {
      searchTerm = urlParams.get("q").toLowerCase()
    }

    // Function to Render All Links Full based on sort and search
    function RenderAllLinksFull() {
      allLinksFullContainer.innerHTML = ""

      let linksToShow = [...linksData]

      // Sort links based on sort type
      if (sortType === "rank") {
        linksToShow.sort((a, b) => b.currentRating - a.currentRating)
      } else if (sortType === "alphabetical") {
        linksToShow.sort((a, b) => a.title.localeCompare(b.title))
      }

      // Filter links based on search term
      if (searchTerm.trim() !== "") {
        linksToShow = linksToShow.filter(link =>
        ((link.title && link.title.toLowerCase().includes(searchTerm)) ||
          (link.applicationName && link.applicationName.toLowerCase().includes(searchTerm)))
        )
      }

      // Display message if no results found
      if (linksToShow.length === 0) {
        const noResults = document.createElement("p")
        noResults.textContent = "No results found."
        allLinksFullContainer.appendChild(noResults)
      } else {
        // Create and append cards for each link
        linksToShow.forEach(link => {
          const card = CreateCard(link)
          allLinksFullContainer.append(card)
        })
      }
    }

    // Get full search input element
    const fullSearchInput = document.getElementById("fullSearchInput")

    if (fullSearchInput) {
      fullSearchInput.value = searchTerm
      fullSearchInput.addEventListener("input", () => {
        searchTerm = fullSearchInput.value.toLowerCase()
        RenderAllLinksFull()
      })
    }

    // Initial Render
    RenderAllLinksFull()

    // Event Listener for Sort Toggle
    const toggle = document.getElementById("toggle")
    if (toggle) {
      toggle.addEventListener("change", () => {
        sortType = toggle.checked ? "alphabetical" : "rank"
        RenderAllLinksFull()
      })
    }
  }

  // Setup Search Suggestions for Header and Hero Search Inputs
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

  // Setup Show More and Show Less Buttons
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

// ===========================================================
// Function to Create a Card Element
// ===========================================================
function CreateCard(link) {
  const card = document.createElement("a")
  card.className = "card"
  card.href = link.href

  // Open link in new window if specified
  if (link.openInNewWindow) {
    card.target = "_blank"
    card.rel = "noopener"
  }

  // Create and append title
  const header = document.createElement("h3")
  header.textContent = link.title
  card.appendChild(header)

  // Create and append sub-header
  const subHeader = document.createElement("p")
  subHeader.className = "sub-header"
  subHeader.textContent = link.applicationName
  card.appendChild(subHeader)

  // Create and append image
  const img = document.createElement("img")
  img.src = link.image
  img.alt = link.alt
  card.appendChild(img)

  return card
}

// ===========================================================
// Load and Render Tasks for All Links Full Page
// ===========================================================
function LoadTasks() {
  fetch("tasks.json")
    .then(response => response.json())
    .then(data => {
      tasks = data
      RenderTasks()
    })
    .catch(() => console.error("Failed to load tasks.json for tasks"))
}

function RenderTasks() {
  const container = document.getElementById("all-links-full-container")
  if (!container || tasks.length === 0) return

  container.innerHTML = ""

  // Sort tasks based on rating or title
  if (sortByRating) {
    tasks.sort((a, b) => b.rating - a.rating)
  } else {
    tasks.sort((a, b) => a.title.localeCompare(b.title))
  }

  // Create and append task cards
  tasks.forEach(task => {
    const card = document.createElement("a")
    card.className = "card"
    card.href = task.href
    if (task.openInNewWindow) {
      card.target = "_blank"
      card.rel = "noopener"
    }

    card.innerHTML = `
      <h2>${task.title}</h2>
      <p>${task.description}</p>
      <p>Rating: ${task.rating}</p>
    `

    container.appendChild(card)
  })
}

// ===========================================================
// Event Listener for Sort Type Selector
// ===========================================================
const sortTypeSelector = document.getElementById("toggle")
if (sortTypeSelector) {
  sortTypeSelector.addEventListener("change", function () {
    sortByRating = !sortByRating
    RenderTasks()
  })
}

// ===========================================================
// DOM Content Loaded Event to Load Tasks
// ===========================================================
document.addEventListener("DOMContentLoaded", function () {
  LoadTasks()
})

// ===========================================================
// Group Selector Dropdown Functionality
// ===========================================================

const groupSelector = document.getElementById("group-selector")
const groupSelectorToggle = document.getElementById("group-selector-toggle")
const groupSelectorMenu = document.getElementById("group-selector-menu")
const currentGroupDisplay = document.getElementById("current-group")

let clickedOpen = false

// Show group selector menu on mouse over if not clicked open
groupSelector?.addEventListener("mouseover", () => {
  if (!clickedOpen) {
    groupSelectorMenu.style.display = "flex"
  }
})

// Hide group selector menu on mouse out if not clicked open
groupSelector?.addEventListener("mouseout", () => {
  if (!clickedOpen) {
    groupSelectorMenu.style.display = "none"
  }
})

// Toggle group selector menu on click
groupSelectorToggle?.addEventListener("click", (e) => {
  e.preventDefault()
  clickedOpen = !clickedOpen
  groupSelectorMenu.style.display = clickedOpen ? "flex" : "none"
})

// Close group selector menu when clicking outside
document.addEventListener("click", (event) => {
  if (clickedOpen && !groupSelector.contains(event.target)) {
    clickedOpen = false
    groupSelectorMenu.style.display = "none"
  }
})

// Update current group display when a group is selected
const groupSelectorMenuLinks = groupSelectorMenu?.querySelectorAll("a")
groupSelectorMenuLinks?.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const selectedGroup = link.getAttribute("data-group")
    currentGroupDisplay.textContent = selectedGroup
    clickedOpen = false
    groupSelectorMenu.style.display = "none"
  })
})

// ===========================================================
// Setup Search Suggestions Functionality
// ===========================================================
function SetupSearchSuggestions(inputElement, suggestionsContainer) {
  let currentIndex = -1
  let suggestionItems = []

  // Event listener for input changes
  inputElement.addEventListener("input", onInput)

  // Event listener for keyboard navigation
  inputElement.addEventListener("keydown", onKeyDown)

  // Event listener for clicks outside the suggestions
  document.addEventListener("click", onDocumentClick)

  // Get the search form and button
  const formElement = inputElement.closest("form")
  const searchButton = formElement?.querySelector("button")

  // Event listener for search button clicks
  searchButton?.addEventListener("click", onSearchButtonClick)

  // Handle input event to display suggestions
  function onInput() {
    const query = inputElement.value.trim().toLowerCase()
    if (!query) {
      hideSuggestions()
      return
    }

    const filtered = linksData.filter(link =>
      (link.title && link.title.toLowerCase().includes(query)) ||
      (link.applicationName && link.applicationName.toLowerCase().includes(query))
    )

    buildSuggestions(query, filtered.slice(0, 5))
  }

  // Build and display suggestion items
  function buildSuggestions(query, results) {
    suggestionsContainer.innerHTML = ""
    currentIndex = -1
    suggestionItems = []

    // Top item to search for the query
    const topItem = document.createElement("div")
    topItem.className = "search-suggestion-item"
    topItem.textContent = `Search for "${inputElement.value.trim()}"`
    topItem.addEventListener("click", () => {
      goToSearchPage(inputElement.value.trim())
    })
    suggestionsContainer.appendChild(topItem)
    suggestionItems.push({ element: topItem, isSearchOption: true, link: null })

    // Suggested links based on the query
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

    // Highlight the first suggestion by default
    if (suggestionItems.length > 0) {
      currentIndex = 0
      highlightCurrentItem()
    }
  }

  // Hide the suggestions dropdown
  function hideSuggestions() {
    suggestionsContainer.innerHTML = ""
    suggestionsContainer.classList.remove("active")
    currentIndex = -1
    suggestionItems = []
  }

  // Handle keyboard navigation within suggestions
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

  // Highlight the currently selected suggestion
  function highlightCurrentItem() {
    suggestionItems.forEach((item, index) => {
      if (index === currentIndex) {
        item.element.classList.add("highlighted")
      } else {
        item.element.classList.remove("highlighted")
      }
    })
  }

  // Hide suggestions when clicking outside
  function onDocumentClick(e) {
    if (!suggestionsContainer.contains(e.target) && e.target !== inputElement) {
      hideSuggestions()
    }
  }

  // Navigate to the search results page
  function goToSearchPage(query) {
    if (!query) return
    window.location.href = `all-links-full.html?q=${encodeURIComponent(query)}`
  }

  // Handle search button click based on current selection
  function onSearchButtonClick() {
    if (currentIndex === -1 || suggestionItems[currentIndex]?.isSearchOption === true) {
      goToSearchPage(inputElement.value.trim())
    } else {
      window.location.href = suggestionItems[currentIndex].link
    }
  }
}
