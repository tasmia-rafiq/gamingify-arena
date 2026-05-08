import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 15000,
});

const getCookie = (name) => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const clearStaleCSRFHeader = (config) => {
  if (config.headers) {
    delete config.headers["x-csrf-token"];
    delete config.headers["X-CSRF-Token"];
  }
};

// ─────── Queue Management ───────
class RequestQueue {
  #queue = [];
  #isRefreshing = false;

  get isRefreshing() {
    return this.#isRefreshing;
  }

  enqueue() {
    return new Promise((resolve, reject) => {
      this.#queue.push({ resolve, reject });
    });
  }

  flush(error = null) {
    this.#queue.forEach(({ resolve, reject }) =>
      error ? reject(error) : resolve(),
    );
    this.#queue = [];
  }

  start() {
    this.#isRefreshing = true;
  }

  stop() {
    this.#isRefreshing = false;
  }
}

const tokenQueue = new RequestQueue();
const csrfQueue = new RequestQueue();

// ─────── Request Interceptor ───────
api.interceptors.request.use(
  (config) => {
    const mutatingMethods = ["post", "put", "patch", "delete"];
    if (mutatingMethods.includes(config.method?.toLowerCase())) {
      const csrfToken = getCookie("csrfToken");
      if (csrfToken) {
        config.headers["x-csrf-token"] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─────── Response Interceptor ───────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 403 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const errorCode = error.response?.data?.code;

    /* -------- CSRF Refresh -------- */
    if (errorCode?.startsWith("CSRF_")) {
      if (csrfQueue.isRefreshing) {
        // Queue request until CSRF refresh completes
        return csrfQueue.enqueue().then(() => {
          clearStaleCSRFHeader(originalRequest);
          return api(originalRequest);
        });
      }

      csrfQueue.start();
      originalRequest._retry = true;

      try {
        await api.post("/api/v1/auth/refresh-csrf");
        clearStaleCSRFHeader(originalRequest);
        csrfQueue.flush();
        return api(originalRequest);
      } catch (err) {
        csrfQueue.flush(err);
        return Promise.reject(err);
      } finally {
        csrfQueue.stop();
      }
    }

    /* -------- Access Token Refresh -------- */
    if (tokenQueue.isRefreshing) {
      return tokenQueue.enqueue().then(() => api(originalRequest));
    }

    tokenQueue.start();
    originalRequest._retry = true;

    try {
      await api.post("/api/v1/auth/refresh-token");
      tokenQueue.flush();
      return api(originalRequest);
    } catch (err) {
      tokenQueue.flush(err);
      return Promise.reject(err);
    } finally {
      tokenQueue.stop();
    }
  },
);

export default api;
