import fs from "fs";

const main = async () => {
  // read the directory and list the dates from each file name
  const dates = fs.readdirSync("./src/api/blobs/data").map((date) => {
    return date.split(".")[0];
  });

  fs.writeFileSync(
    "./src/api/blobs/dates.json",
    JSON.stringify(dates, null, 2)
  );
};

main();
