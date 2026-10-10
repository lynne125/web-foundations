const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const usersList = document.getElementById("users-list");
const status = document.getElementById("status");

let users = [];

function renderUsers(list) {
  usersList.innerHTML = "";

  if (list.length === 0) {
    usersList.innerHTML = "<li>No users match your filter</li>";
    return;
  }

  list.forEach(user => {
    const li = document.createElement("li");

    li.textContent =
      `${user.name} | ${user.email} | ${user.address.city} | ${user.company.name}`;

    usersList.appendChild(li);
  });
}

async function loadUsers() {
  const url = "https://jsonplaceholder.typicode.com/users";

  try {
    loadButton.disabled = true;
    status.textContent = "Loading users...";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    users = await response.json();

    renderUsers(users);

    status.textContent = "Users loaded successfully.";
  } catch (error) {
    status.textContent = `Error: ${error.message}`;
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const searchText = filterInput.value.toLowerCase();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText)
  );

  renderUsers(filteredUsers);
});