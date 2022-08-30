function apiGetUser(searchTerm) {
  return axios({
    url: "https://630a0977f8a20183f77a7c18.mockapi.io/users",
    method: "GET",
    params: { name: searchTerm },
  });
}
function apiAddUser(user) {
  return axios({
    url: "https://630a0977f8a20183f77a7c18.mockapi.io/users",
    method: "POST",
    data: user,
  });
}
function apiDeleteUser(userId) {
  return axios({
    url: `https://630a0977f8a20183f77a7c18.mockapi.io/users/${userId}`,
    method: "DELETE",
  });
}
function apiGetUserById(userId) {
  return axios({
    url: `https://630a0977f8a20183f77a7c18.mockapi.io/users/${userId}`,
    method: "GET",
  });
}
function apiUpdateUser(userId, user) {
  return axios({
    url: `https://630a0977f8a20183f77a7c18.mockapi.io/users/${userId}`,
    method: "PUT",
    data: user,
  });
}
