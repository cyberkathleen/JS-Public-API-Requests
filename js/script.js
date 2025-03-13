// Element selectors
const gallery = document.getElementById('gallery');

/**
 * Fetches 12 random users from the Random User Generator API
 * and displays them on the page.
 */
fetch('https://randomuser.me/api/?results=12')
  .then(response => response.json())
  .then(data => displayUsers(data.results))
  .catch(error => console.error('Looks like there was an error:\n', error))

/**
 * Displays 12 user profiles in the gallery section.
 * Each user profile includes an img, name, email, and location.
 * Clicking on a user profile will open a modal with more details.
 * 
 * @param {Array} users - An array of user objects retrieved from the API.
 */
function displayUsers(users) {
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
    card.addEventListener('click', () => {
      createModal(user);
    });
  });
}

// Function to create and display a modal window with user details
/**
 * Creates and displays a modal window containing detailed user information.
 * Includes image, name, email, location, phone number, full address, and birthday.
 * Also adds functionality to close the modal by clicking the close button
 * or clicking outside the modal content.
 * 
 * @param {Object} user - The user object containing profile details.
 */
function createModal(user) {
  // Format user's birthday to MM/DD/YYYY
  const birthday = new Date(user.dob.date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

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
      </div>
    </div>
  `;
  
  // Append modal to the body
  gallery.insertAdjacentHTML('afterend', html);

  // Select the newly created modal elements
  const modalContainer = document.querySelector('.modal-container');
  const closeBtn = document.getElementById('modal-close-btn');

  // Close modal on close button click
  closeBtn.addEventListener('click', () => modalContainer.remove());

  // Close modal if clicked outside of modal content
  modalContainer.addEventListener('click', e => {
    if (e.target === modalContainer) modalContainer.remove();
  });
}