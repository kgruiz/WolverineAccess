import json
from pathlib import *

if __name__ == "__main__":

    def GetImagePath(title: str) -> str:

        if title in imageData:

            return imageData[title]

        else:

            print(title)

    currentDir = Path("..").resolve()

    path = Path(currentDir, "../../Assets/JSON Files/tasks.json")

    collectionsPath = path.with_stem("collections")
    tasksPath = path.with_stem("tasks")

    isolatedTasks = []

    with open(path, "r") as file:

        tasksDicts = json.load(file)

    with path.with_stem("imageData").open("r") as file:

        imageData = json.load(file)

    newTasksDicts = tasksDicts

    keepKeys = ["taskCollections"]

    newTasksDicts = {key: value for key, value in tasksDicts.items() if key in keepKeys}

    keepKeys = ["name", "uniqueKey", "tiles"]

    for collectionNum, collectionDict in enumerate(newTasksDicts["taskCollections"]):

        newTasksDicts["taskCollections"][collectionNum] = {
            key: value for key, value in collectionDict.items() if key in keepKeys
        }

    for collectionNum, collectionDict in enumerate(newTasksDicts["taskCollections"]):

        keepKeys = [
            "favorite",
            "announcements",
            "collectionName",
            "title",
            "uniqueKey",
            "task",
        ]

        for tileNum, tile in enumerate(collectionDict["tiles"]):

            newTasksDicts["taskCollections"][collectionNum]["tiles"][tileNum] = {
                key: value for key, value in tile.items() if key in keepKeys
            }

    for collectionNum, collectionDict in enumerate(newTasksDicts["taskCollections"]):

        for tileNum, tile in enumerate(collectionDict["tiles"]):

            keepKeys = [
                "applicationName",
                "averageRating",
                "ratingCount",
                "tabletHighResolutionImageCdnUrl",
                "tabletLowResolutionImageCdnUrl",
                "openInNewWindow",
            ]

            taskDict = tile["task"]

            taskDict = {
                key: value for key, value in taskDict.items() if key in keepKeys
            }

            currentDict = newTasksDicts["taskCollections"][collectionNum]["tiles"][
                tileNum
            ]

            currentDict = {
                key: value for key, value in currentDict.items() if key != "task"
            }

            currentDict.update(taskDict)

            currentDict["currentRating"] = tileNum + 1
            currentDict["alt"] = currentDict["title"]
            currentDict["image"] = GetImagePath(title=currentDict["title"])
            currentDict["href"] = "not-implemented.html"

            if currentDict["title"] == "Canvas":

                currentDict["target"] = "_blank"
                currentDict["rel"] = "noopener"
                currentDict["href"] = "https://canvas.it.umich.edu/"

            elif currentDict["title"] == "Google Mail":

                currentDict["target"] = "_blank"
                currentDict["rel"] = "noopener"
                currentDict["href"] = "https://gmail.com"

            newTasksDicts["taskCollections"][collectionNum]["tiles"][
                tileNum
            ] = currentDict

    for collectionNum, collectionDict in enumerate(newTasksDicts["taskCollections"]):

        for tileNum, tile in enumerate(collectionDict["tiles"]):

            isolatedTasks.append(tile)

    with open(collectionsPath, "w") as newFile:

        json.dump(newTasksDicts, newFile, indent=4)

    with open(tasksPath, "w") as newFile:

        json.dump(isolatedTasks, newFile, indent=4)
