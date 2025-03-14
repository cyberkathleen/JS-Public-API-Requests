// Element selectors
const gallery = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');

let usersData = []; // Fetched users

/**
 * Insert the search input field into the DOM
 */
function addSearchBar() {
  // Search input template
  const html = `
    <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
  `;

  // Insert search input
  searchContainer.insertAdjacentHTML('beforeend', html);

  // Real-time search
  document.getElementById('search-input').addEventListener('input', filterUsers);
}

/**
 * Fetches 12 random users with English-readable nationalities
 * from the Random User Generator API and displays them on the page.
 */
fetch('https://randomuser.me/api/?results=12&nat=au,ca,gb,us')
  .then(response => response.json())
  .then(data => {
    usersData = data.results;
    displayUsers(data.results);
  })
  .catch(error => console.error('Looks like there was an error:\n', error))

/**
 * Displays 12 user profiles in the gallery section.
 * Each user profile includes an img, name, email, and location.
 * Clicking on a user profile will open a modal with more details.
 * 
 * @param {Array} users - An array of user objects retrieved from the API.
 */
function displayUsers(users) {
  // Clear previous results
  gallery.innerHTML = '';

  users.forEach(user => {
    // Create HTML for each user card
    const html = `
      <div class="card">
        <div class="card-img-container">
          <img class="card-img" src="${user.picture.large}" alt="profile picture of ${user.name.first} ${user.name.last}">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="card-text">${user.email}</p>
          <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
      </div>
    `;

    // Add user card to the gallery
    gallery.insertAdjacentHTML('beforeend', html);

    // Add click event listener to open the modal for the clicked user
    const card = gallery.lastElementChild;
    card.addEventListener('click', () => createModal(user));
  });
}

/**
 * Filters users based on the search input and updates the displayed results.
 */
function filterUsers() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();

  // Filter users based on name match
  const filteredUsers = usersData.filter(user => {
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
    return fullName.includes(searchInput);
  });

  // Update gallery with filtered users
  displayUsers(filteredUsers);
}

/**
 * Creates and displays a modal window containing detailed user information.
 * Adds functionality to close the modal by clicking the close button
 * or clicking outside the modal content.
 * Adds functionality to navigate between employees using "Prev" and "Next" buttons.
 * 
 * @param {Object} user - The user object containing profile details.
 */
function createModal(user) {
  // Track current user index
  let userIndex = usersData.indexOf(user);

  // Format user's birthday
  const birthday = formatBirthday(user.dob.date);

  // Create modal structure
  const html = `
    <div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
          <img class="modal-img" src="${user.picture.large}" alt="profile picture of ${user.name.first} ${user.name.last}">
          <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="modal-text">${user.email}</p>
          <p class="modal-text cap">${user.location.city}</p>
          <hr>
          <p class="modal-text">${user.cell}</p>
          <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.country}, ${user.location.postcode}</p>
          <p class="modal-text">Birthday: ${birthday}</p>
        </div>
        <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
      </div>
    </div>
  `;
  
  // Append modal to the body
  gallery.insertAdjacentHTML('afterend', html);

  // Modal elements selectors
  const modalContainer = document.querySelector('.modal-container');
  const closeBtn = document.getElementById('modal-close-btn');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');

  // Close modal on close button click
  closeBtn.addEventListener('click', () => modalContainer.remove());

  // Close modal if clicked outside of modal content
  modalContainer.addEventListener('click', e => {
    if (e.target === modalContainer) modalContainer.remove();
  });

  // Update navigation button states depending on user index
  updateBtnState();

  // Show modal for previous user
  prevBtn.addEventListener('click', () => {
    if (userIndex > 0) {
      userIndex--;
      updateModal();
    }
  });

  // Show modal for next user
  nextBtn.addEventListener('click', () => {
    if (userIndex < usersData.length - 1) {
      userIndex++;
      updateModal();
    }
  });

  /**
   * Updates the modal content to show a different user's details.
   */
  function updateModal() {
    // Get new user data
    const newUser = usersData[userIndex];

    // Format user birthday
    const newBirthday = formatBirthday(newUser.dob.date);

    // Update modal content
    document.querySelector('.modal-img').src = newUser.picture.large;
    document.querySelector('.modal-name').textContent = `${newUser.name.first} ${newUser.name.last}`;
    document.querySelectorAll('.modal-text')[0].textContent = newUser.email;
    document.querySelectorAll('.modal-text')[1].textContent = newUser.location.city;
    document.querySelectorAll('.modal-text')[2].textContent = newUser.cell;
    document.querySelectorAll('.modal-text')[3].textContent = 
      `${newUser.location.street.number} ${newUser.location.street.name}, ${newUser.location.country}, ${newUser.location.postcode}`;
    document.querySelectorAll('.modal-text')[4].textContent = `Birthday: ${newBirthday}`;

    // Update nav button states
    updateBtnState();
  }

  /**
   * Enables or disables the "Previous" and "Next" buttons based on the current user index.
   */
  function updateBtnState() {
    // Hide "Prev" if at first user
    prevBtn.style.display = userIndex === 0 ? 'none' : 'block';
    // Hide "Next" if at last user
    nextBtn.style.display = userIndex === usersData.length - 1 ? 'none' : 'block';
  }
}

/**
 * Formats a user's birthday into MM/DD/YYYY format.
 * @param {string} dateString - The user's date of birth in ISO format.
 * @returns {string} - The formatted date string.
 */
function formatBirthday(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

// Initialize the search bar
addSearchBar();