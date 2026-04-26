const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/search", async (req, res) => {
    const {
        keyword,
        artist,
        title,
        location,
        date_created,
        annotations
    } = req.body;

    try {
        const sql = `
        SELECT DISTINCT  
            m.artist,
            m.title,
            TO_CHAR(m.annotations) AS annotations,
            TO_CHAR(m.date_created, 'YYYY-MM-DD') AS date_created,
            m.location
        FROM ethiopian_music m
        LEFT JOIN music_keywords mk ON m.id = mk.music_id
        LEFT JOIN keywords k ON mk.keyword_id = k.mid
        WHERE 1=1
        
        -- GLOBAL SEARCH (OR logic)
        AND (
            :keyword IS NULL OR (
                LOWER(k.keyword) LIKE :keyword
                OR LOWER(m.artist) LIKE :keyword
                OR LOWER(m.title) LIKE :keyword
                OR LOWER(DBMS_LOB.SUBSTR(m.annotations,4000,1)) LIKE :keyword
            )
        )
        
        -- FILTERS (AND logic)
        AND (:artist IS NULL OR LOWER(m.artist) LIKE :artist)
        AND (:title IS NULL OR LOWER(m.title) LIKE :title)
        AND (:location IS NULL OR LOWER(m.location) LIKE :location)
        AND (
            :date_created IS NULL OR
            TO_CHAR(m.date_created, 'YYYY-MM-DD') = :date_created
          )
        `;
        
const binds = {
    keyword: keyword ? `%${keyword.toLowerCase()}%` : null,
    artist: artist ? `%${artist.toLowerCase()}%` : null,
    title: title ? `%${title.toLowerCase()}%` : null,
    location: location ? `%${location.toLowerCase()}%` : null,
    date_created: date_created || null
};

        const result = await db.execute(sql, binds);

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});