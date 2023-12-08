import { readdir, readFile } from "fs/promises";
import { NODE_ID_BY_NAME } from "./nodes_ids.js";
import { padEnd, toPairs } from "lodash-es";
import { writeFileSync } from "fs";

async function example() {
  try {
    let res = {};

    for (const file of files) {
      const data = await readFile(`./${streamer}/${file}`, {
        encoding: "utf8",
      });
      const lines = data.split("\n");
      res = reduce(
        lines,
        (sum, line) => {
          const match = line.match(
            /(\[\d\d:\d\d:\d\d\]) (?:\[Announcement\] )*<(?:[~!@%+^]*)(.+?)>/
          );
          if (match) {
            const [, , nickname] = match;
            sum[nickname] = sum[nickname] ? sum[nickname] + 1 : 1;
          }
          return sum;
        },
        res
      );
    }

    const pairs = toPairs(res);
    const sorted = orderBy(pairs, "[1]", "desc");
    console.log("Total chatters:", sorted.length);
    console.log(sorted);
    const totalMessages = sorted.reduce((acc, [, count]) => acc + count, 0);
    console.log("Messages count", totalMessages);
    // const f = find(sorted, ([nick]) => nick === "Elgon67");
    // console.log(f);
  } catch (err) {
    console.log(err);
  }
}

function computeLocation(x, y) {
  const xstr = padEnd(x.replace(".", ""), 4, "0");
  const ystr = padEnd(y.replace(".", ""), 4, "0");
  return `${xstr}${ystr}00`; // XXXX YYYY 00
}

function logCountPerMap(res) {
  for (const [mapId, nodes] of toPairs(res)) {
    console.log(mapId, nodes.length);
  }
}

function extractAndPrepareNodes(data) {
  const nodesPerMap = {};

  const lines = data.split("\n");
  for (const line of lines) {
    const match = line.match(/(?:\/way #)([\d]+) ([\d|.]+) ([\d|.]+) (.+)/);
    if (match) {
      const [, mapId, x, y, nodeName] = match;
      const location = computeLocation(x, y);
      const nodeId = NODE_ID_BY_NAME[nodeName];
      nodesPerMap[mapId] = nodesPerMap[mapId] || [];
      nodesPerMap[mapId].push([location, nodeId]);
    }
  }

  // console.log(res);
  // logCountPerMap(res);
  return nodesPerMap;
}

function generateContent(nodesPerMap) {
  let res = "";

  for (const [mapId, nodes] of toPairs(nodesPerMap)) {
    res += `[${mapId}] = {\n`;
    for (const [location, nodeId] of nodes) {
      res += `[${location}] = ${nodeId},\n`;
    }
    res += `},\n`;
  }

  return res;
}

async function main() {
  const srcDir = "./raw_files";
  const destDir = "./generated_files";

  try {
    const files = await readdir(srcDir);
    for (const file of files) {
      const data = await readFile(`${srcDir}/${file}`, {
        encoding: "utf8",
      });
      const nodesPerMap = extractAndPrepareNodes(data);
      const content = generateContent(nodesPerMap);
      // console.log(content);
      writeFileSync(`${destDir}/${file}`, content, {
        encoding: "utf8",
        flag: "w",
      });
    }
  } catch (err) {
    console.error(err);
  }
}

main();
