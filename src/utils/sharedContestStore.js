const COOKIE_NAME = "skillspire-contests";
const LOCAL_STORAGE_KEY = "skillspire-local-contests";

function readCookie(name) {
  if (typeof document === "undefined") return "";

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!match) return "";
  return match.split("=").slice(1).join("=");
}

function writeCookie(name, value) {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 30}`;
}

export function readSharedContests() {
  try {
    const cookieValue = readCookie(COOKIE_NAME);
    if (cookieValue) {
      return JSON.parse(decodeURIComponent(cookieValue));
    }
  } catch {
    // ignore cookie parse errors and fall back to localStorage
  }

  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeSharedContests(contests) {
  const serialized = encodeURIComponent(JSON.stringify(contests));
  writeCookie(COOKIE_NAME, serialized);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contests));
}

export function mergeContestLists(primary = [], secondary = []) {
  return [...primary, ...secondary].reduce((acc, contest) => {
    if (!acc.some((item) => item._id === contest._id)) {
      acc.push(contest);
    }
    return acc;
  }, []);
}

export function removeSharedContest(id) {
  const contests = readSharedContests().filter((contest) => contest._id !== id);
  writeSharedContests(contests);
}
