const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "vellum_token_v1";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}



const request = async (path, { method = "GET", body, auth = true } = {}) => {
  
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 401 -> token expired or invalid; clear it
  if (res.status === 401 && auth) {
    clearToken();
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    throw new ApiError(
      data?.message || `Request failed with status ${res.status}`,
      res.status,
      data
    );
  }


  return data;
};

export const api = {
  // --- Auth ---
  signup: (payload) =>
    request("/auth/signup", { method: "POST", body: payload, auth: false }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me"),

  googleLogin: (credential) =>
  request("/auth/google", { method: "POST", body: { credential }, auth: false }),

  // --- Boards ---
  listBoards: () => request("/boards"),
  getBoard: (id) => request(`/boards/${id}`),
  createBoard: (payload) =>
    request("/boards", { method: "POST", body: payload }),
  updateBoard: (id, payload) =>
    request(`/boards/${id}`, { method: "PATCH", body: payload }),
  deleteBoard: (id) => request(`/boards/${id}`, { method: "DELETE" }),

    // --- Board sharing ---
  getBoardMembers: (boardId) => request(`/boards/${boardId}/members`),
  addBoardMember: (boardId, userId) =>
    request(`/boards/${boardId}/members`, { method: "POST", body: { userId } }),
  removeBoardMember: (boardId, userId) =>
    request(`/boards/${boardId}/members/${userId}`, { method: "DELETE" }),

  // --- Lists ---
  createList: (boardId, payload) =>
    request(`/boards/${boardId}/lists`, { method: "POST", body: payload }),
  updateList: (id, payload) =>
    request(`/lists/${id}`, { method: "PATCH", body: payload }),
  deleteList: (id) => request(`/lists/${id}`, { method: "DELETE" }),
  reorderLists: (boardId, order) =>
    request(`/boards/${boardId}/lists/reorder`, {
      method: "PATCH",
      body: { order },
    }),

  // --- Cards ---
  createCard: (listId, payload) =>
    request(`/lists/${listId}/cards`, { method: "POST", body: payload }),
  updateCard: (id, payload) =>
    request(`/cards/${id}`, { method: "PATCH", body: payload }),
  deleteCard: (id) => request(`/cards/${id}`, { method: "DELETE" }),
  moveCard: (id, payload) =>
    request(`/cards/${id}/move`, { method: "PATCH", body: payload }),

    transitionCard: (id, action, note) =>
    request(`/cards/${id}/status`, { method: "POST", body: { action, note } }),

    // --- Team ---
  searchUsers: (q) => request(`/users/search?q=${encodeURIComponent(q)}`),
  getUserProfile: (id) => request(`/users/${id}/profile`),
  getTeam: () => request("/team"),
  sendInvitation: (receiverId, message) =>
    request("/team/invitations", { method: "POST", body: { receiverId, message } }),
  acceptInvitation: (id) =>
    request(`/team/invitations/${id}/accept`, { method: "POST" }),
  declineInvitation: (id) =>
    request(`/team/invitations/${id}/decline`, { method: "POST" }),
  cancelInvitation: (id) => request(`/team/invitations/${id}`, { method: "DELETE" }),
  removeTeammate: (userId) => request(`/team/members/${userId}`, { method: "DELETE" }),

  // --- Notifications ---
  getNotifications: () => request("/notifications"),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: "POST" }),
  markAllNotificationsRead: () => request("/notifications/read-all", { method: "POST" }),

  //Profile------------------------

  updateProfile: (payload) => request("/users/me", { method: "PATCH", body: payload }),
  
  uploadBanner: async (file) => {
    const formData = new FormData();
    formData.append("banner", file);
    
    const token = getToken();
    const res = await fetch(`${BASE_URL}/users/me/banner`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // Browser sets Content-Type to multipart/form-data automatically
    });
    
    const data = await res.json();
    if (!res.ok) throw new ApiError(data.message || "Upload failed", res.status, data);
    return data;
  },

  uploadAvatar: async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const token = getToken();
  const res = await fetch(`${BASE_URL}/users/me/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new ApiError(data.message || "Upload failed", res.status, data);
  return data;
},

};

export { ApiError };