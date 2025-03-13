// Element selectors
const gallery = document.getElementById('gallery');

// Fetch 12 users data from the Random User Generator API
fetch('https://randomuser.me/api/?results=12')
  .then(response => response.json())
  .then(data => displayUsers(data.results))
  .catch(error => console.error('Looks like there was an error:\n', error))

// Function to display the 12 users
function displayUsers(users) {
  gallery.innerHTML = '';

  users.forEach(user => {
    // HTML for each user
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

    // Add event listener to create modal when the card is clicked
    const card = gallery.lastElementChild;
    card.addEventListener('click', () => {
      createModal(user);
    });
  });
}

// Function to create and display a modal window with user details
function createModal(user) {
  // Format birthday to MM/DD/YYYY
  const birthday = new Date(user.dob.date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  // Modal template
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

  // Selectors for event listeners to close the modal
  const modalContainer = document.querySelector('.modal-container');
  const closeBtn = document.getElementById('modal-close-btn');

  // Close modal on close button click
  closeBtn.addEventListener('click', () => modalContainer.remove());

  // Close modal if clicked outside of modal content
  modalContainer.addEventListener('click', e => {
    if (e.target === modalContainer) modalContainer.remove();
  });
}