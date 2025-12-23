import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

/* Register chart components */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function App() {
  /* ---------- STATES ---------- */
  const [username, setUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");

  /* ---------- MULTIPLE USERS (Add here) ---------- */
  const users = ["facebook", "google", "microsoft", "vercel"]; // predefined usernames

  /* ---------- FETCH GITHUB REPOS ---------- */
  useEffect(() => {
    if (!searchedUser) return;

    fetch(`https://api.github.com/users/${searchedUser}/repos`)
      .then((res) => res.json())
      .then((data) => setRepos(data))
      .catch((err) => console.error(err));
  }, [searchedUser]);

  /* ---------- SEARCH BUTTON ---------- */
  const handleSearch = () => {
    setSearchedUser(username);
  };

  /* ---------- STEP 4: FILTER REPOSITORIES ---------- */
  const filteredRepos = repos.filter((repo) => {
    const matchesSearch = repo.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLanguage =
      language === "All" || repo.language === language;

    return matchesSearch && matchesLanguage;
  });

  /* ---------- STEP 5.2: TOP 5 REPOS BY STARS ---------- */
  const topRepos = [...filteredRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  /* ---------- CHART DATA ---------- */
  const chartData = {
    labels: topRepos.map((repo) => repo.name),
    datasets: [
      {
        label: "Stars",
        data: topRepos.map((repo) => repo.stargazers_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  /* ---------- UI ---------- */
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 Open Source GitHub Project Explorer</h1>
      <h2>Dashboard Page</h2>

      {/* Repository Search & Filter */}
      <input
        type="text"
        placeholder="Search repository..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "6px", marginRight: "10px" }}
      />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ padding: "6px" }}
      >
        <option value="All">All Languages</option>
        <option value="JavaScript">JavaScript</option>
        <option value="Python">Python</option>
        <option value="Java">Java</option>
      </select>

      {/* Chart */}
      <h3 style={{ marginTop: "20px" }}>
        📊 Stars Chart (Top Repositories)
      </h3>

      <div style={{ width: "600px", marginBottom: "20px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Repository List */}
      <ul>
        {filteredRepos.map((repo) => (
          <li key={repo.id}>
            {repo.name} ⭐ {repo.stargazers_count}
          </li>
        ))}
      </ul>

      {/* GitHub Username Search */}
      <select
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "6px", marginRight: "10px" }}
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </select>

      <button onClick={handleSearch}>Search</button>

      {searchedUser && (
        <p>
          Searching repositories for: <b>{searchedUser}</b>
        </p>
      )}
    </div>
  );
}

export default App;
