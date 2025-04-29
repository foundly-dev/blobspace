import { BlobData } from "@/api";
import fs from "fs";

const dir = "./src/api/blobs/data";

const get = async ({ limit, offset }: { limit: number; offset: number }) => {
  console.log(`Fetching ${limit} items at offset ${offset}`);
  const response = await fetch(
    `https://api.dune.com/api/v1/query/5042034/results?limit=${limit}&offset=${offset}`,
    {
      headers: {
        "X-Dune-API-Key": process.env.DUNE_API_KEY!,
      },
    }
  );
  const data = await response.json();
  console.log(`Fetched ${data.result.rows.length} items`);
  return data.result.rows;
};

const getAll = async () => {
  let offset = 0;
  const data: BlobData[] = [];

  while (offset < 16000) {
    const result = await get({ limit: 1000, offset });
    data.push(...result);
    offset += 1000;
    if (result.length < 1000) break; // Stop if we got fewer results than requested
  }

  return data;
};

const groupByDate = (data: BlobData[]) => {
  const grouped: Record<string, BlobData[]> = {};

  data.forEach((item) => {
    // Extract date part only from timestamp
    const date = item.time.split(" ")[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });

  return grouped;
};

const writeFiles = (groupedData: Record<string, BlobData[]>) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  Object.entries(groupedData)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .slice(1)
    .forEach(([date, items]) => {
      const filename = `${dir}/${date}.json`;
      fs.writeFileSync(filename, JSON.stringify(items, null, 2));
      console.log(`Written ${items.length} items to ${filename}`);
    });
};

const main = async () => {
  const data = await getAll();
  const groupedData = groupByDate(data);
  writeFiles(groupedData);
};

main()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
