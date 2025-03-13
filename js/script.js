// Element selectors
const gallery = document.getElementById('gallery');

// Fetch 12 users data from the Random User Generator API
fetch('https://randomuser.me/api/?results=12')
  .then(response => response.json())
  .then(data => displayUsers(data.results))
  .catch(error => console.error('Looks like there was an error:\n', error))

// Function to display the 12 users
function displayUsers(users) {
  users.forEach(user => {
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

    gallery.insertAdjacentHTML('beforeend', html);
  });
}