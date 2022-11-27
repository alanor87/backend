import ourFileTree from "./filetree.mjs";

const responseData = { path: [], contents: {} };

function resetResponseData() {
  responseData.path = [];
  responseData.contents = {};
}

function router(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/json");
  const path = req.url.split("/").filter((level) => level && level !== "path");

  pathSearch(path, ourFileTree);

  res.end(JSON.stringify(responseData));
  resetResponseData();
}

function pathSearch(path, fileTree) {
  if (fileTree?.children?.[path[0]]) {
    responseData.path.push(path[0]);

    switch (fileTree.children[path[0]].type) {
      case "file": {
        // If the tree element is file - it won't have anything nested inside.
        responseData.contents = { type: "file", message: path[0] };
        return;
      }
      case "dir": {
        // If it is a dir - looking for the next path location inside.
        pathSearch(path.slice(1), fileTree.children[path[0]]);
        return;
      }
    }
  } else {
    // When the path array is empty or has no children - it means
    //      - we 'drained' the path.
    //      - or the path was empty in request.
    //      - or the current file tree has no children.
    // In either case - returning file tree in its present condition of current recursive iteration.
    responseData.contents = {
      type: "dir",
      message: Object.keys(fileTree.children || fileTree),
    };
  }
}

export default router;
