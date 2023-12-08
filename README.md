# gathermate-extractor

Simple utility to convert gathering nodes locations from wowhead tomtom commands to Gathermate2_Data format.

Made to automate https://github.com/lindseyburnett/GatherMate2_Data/tree/main instructions (copied below)

## How to use it

1. Lookup the object/node you care about on wowhead and has the map indicating where to find it.
   For example search [Serevite located in Zaralek Cavern on wowhead](https://www.wowhead.com/objects/name:serevite?filter=1;14022;0)
2. From this search open each result (like [Serevite Seam](https://www.wowhead.com/object=381106/serevite-seam)) in a separate tab
3. Select the map (here Zaralek) that you want to extract the data from
4. Click a pin on the map, and then click `Copy All -> TomTom Command`

   When you paste, you'll get something that looks like this:

   ```
   /way #2133 38.2 49.6 Serevite Seam
   /way #2133 38.4 52.4 Serevite Seam
   /way #2133 38.4 52.5 Serevite Seam
   ```

5. Save the tomtom commands in a file under `raw_files` (organize them as you want, but they **must not** be located inside subfolders)
6. Once all your data have been saved in files, open an terminal and run `node index.js`
7. Each source file will be translated to a file under `generated_files` in Lua format, that can be copy/pasted in the appropriate reference files of [Gathermate2_Data](https://www.curseforge.com/wow/addons/gathermate2_data)

## Limitations

Only supports Ore, Herb and Fish nodes of Dragonflight atm.

---

# Copied from GatherMate2_Data fork

## Anatomy of the datafile

Sample FishData.lua

```lua
GatherMateData2FishDB = {
	[ZONE_ID] = {
		[COORDINATES] = NODE_ID,
	}
}
```

`ZONE_ID` - can be found in-game by typing `/dump C_Map.GetBestMapForUnit("player")` in the chat. This is the same zone id that the TomTom addon uses with their `/way` command.

`COORDINATES` - In `XXXXYYYY00` format. Always 10-digits long. Use zeros as a buffer. Example: If you have a coordinate of 64.3 59.8, the coordinate value would be `6430598000`. If you have a coordinate of 58.39 31.41, the coordinate value would be `5839314100`

`NODE_ID` - As defined by the [GatherMate2](https://www.curseforge.com/wow/addons/gathermate2) addon in the `GatherMate2\Constants.lua` file.

## Example

There's a `Prismatic Leaper` node in `Ohn'ahran Plains` at location 64.3, 59.8.

```lua
GatherMateData2FishDB = {
	[2023] = {
		[6430598000] = 1117,
	}
}
```

There's also `Prismatic Leaper` node in `The Azure Span` at 30.4, 25.0.

```lua
GatherMateData2FishDB = {
	[2023] = {
		[6430598000] = 1117,
	},
    [2024] = {
        [3040250000] = 1117,
    }
}
```

## Tips for populating data from wowhead

1. Lookup the object/node you care about on wowhead and has the map indicating where to find it.

[Prismatic Leaper on wowhead](https://www.wowhead.com/item=200061/prismatic-leaper)

2. Click the pin on the map, and then click `Copy All -> TomTom Command`

   When you paste, you'll get something that looks like this:

   ```
   /way #2023 56.4 80.4 Prismatic Leaper
   /way #2023 56.4 80.5 Prismatic Leaper
   /way #2023 56.5 80.4 Prismatic Leaper
   /way #2023 56.5 80.5 Prismatic Leaper
   /way #2023 58.3 31.7 Prismatic Leaper
   /way #2023 58.4 31.4 Prismatic Leaper
   /way #2023 58.5 31.4 Prismatic Leaper
   /way #2023 58.5 31.5 Prismatic Leaper
   /way #2023 61.5 82.3 Prismatic Leaper
   /way #2023 64.3 38.5 Prismatic Leaper
   /way #2023 64.4 38.2 Prismatic Leaper
   /way #2023 64.6 38.3 Prismatic Leaper
   /way #2023 64.6 38.7 Prismatic Leaper
   /way #2023 86.2 51.9 Prismatic Leaper
   ```

3. Then use your preferred method to then translate those coordinates into entries to include in FishData.lua. Don't forget to look up the constant for "Prismatic Leaper" in the `GatherMate2\Constants.lua` file.
