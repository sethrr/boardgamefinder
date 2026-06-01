const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE = process.env.REACT_APP_AIRTABLE_TABLE;
const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`;

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  "Content-Type": "application/json"
};

export function getBggId(record) {
  const bggId = record.fields["BGG ID"];
  if (bggId != null) {
    return Number(bggId);
  }

  const link = record.fields["BGG Link"];
  if (typeof link === "string") {
    const match = link.match(/boardgame\/(\d+)/);
    if (match) {
      return Number(match[1]);
    }
  }

  return null;
}

export function isRecordVisible(record) {
  return record.fields["Visible"] !== false;
}

export function toQuizGame(record) {
  return {
    game_id: getBggId(record),
    title: record.fields["Game Name"],
    players: record.fields["Player Count"],
    playtime: record.fields["Avg Play Time"],
    complexity: record.fields["Weight"],
    category: record.fields["Category"]
  };
}

export async function fetchAllAirtableRecords() {
  const records = [];
  let offset = null;

  do {
    const url = offset
      ? `${AIRTABLE_API_URL}?offset=${offset}`
      : AIRTABLE_API_URL;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Airtable error: ${response.status}`);
    }

    const data = await response.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

export async function fetchVisibleQuizGames() {
  const records = await fetchAllAirtableRecords();

  return records
    .filter(isRecordVisible)
    .map(toQuizGame)
    .filter((game) => game.game_id != null);
}

export async function updateRecordVisibility(recordId, isVisible) {
  const response = await fetch(AIRTABLE_API_URL, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      records: [{ id: recordId, fields: { Visible: isVisible } }]
    })
  });

  if (!response.ok) {
    throw new Error(`Airtable update failed: ${response.status}`);
  }

  return response.json();
}

export async function batchUpdateVisibility(updates) {
  const batchSize = 10;

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const response = await fetch(AIRTABLE_API_URL, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        records: batch.map(({ recordId, isVisible }) => ({
          id: recordId,
          fields: { Visible: isVisible }
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`Airtable batch update failed: ${response.status}`);
    }
  }
}
