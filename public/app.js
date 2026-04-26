
async function searchData() {
    const payload = {
        keyword: document.getElementById("keyword").value,
        artist: document.getElementById("artist").value,
        title: document.getElementById("title").value,
        location: document.getElementById("location").value,
        date_created: document.getElementById("date").value,
        annotations: document.getElementById("annotations").value
    };

    const res = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    displayResults(data);
}
function displayResults(data) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = "<p>No results found</p>";
        return;
    }

    data.forEach(item => {
        item.DATE_CREATED = item.DATE_CREATED.split("T")[0];
        container.innerHTML += `
<div class="music-card">
    
    <!-- LEFT CD ICON -->
    <div class="cd-icon">
        <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="white" stroke-width="4" fill="none"/>
            <circle cx="50" cy="50" r="10" fill="white"/>
            <circle cx="50" cy="50" r="25" stroke="white" stroke-width="2" fill="none"/>
        </svg>
    </div>

    <!-- RIGHT CONTENT -->
    <div class="music-info">
        <h3>${item.TITLE}</h3>
        <p><b>Artist:</b> ${item.ARTIST}</p>
        <p><b>Location:</b> ${item.LOCATION || "N/A"}</p>
        <p><b>Date:</b> ${item.DATE_CREATED || ""}</p>
        <p class="notes">${item.ANNOTATIONS || "—"}</p>
    </div>

</div>
`;
        
    });
}