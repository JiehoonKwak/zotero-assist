if (!items || items.length === 0) return;

async function getRegularItemAttachments(item) {
  const paths = [];
  const attachmentIDs = item.getAttachments();
  for (let id of attachmentIDs) {
    const file = await Zotero.Items.get(id).getFilePathAsync();
    if (file) paths.push(file);
  }
  return paths;
}

async function getAttachmentPath(item) {
  const paths = [];
  const file = await item.getFilePathAsync();
  if (file) paths.push(file);
  return paths;
}

function revealInFinder(filePath) {
  let file = Components.classes["@mozilla.org/file/local;1"]
    .createInstance(Components.interfaces.nsIFile);
  file.initWithPath("/usr/bin/open");
  let process = Components.classes["@mozilla.org/process/util;1"]
    .createInstance(Components.interfaces.nsIProcess);
  let args = ["-R", filePath];
  process.init(file);
  process.run(false, args, args.length);
}

async function processFirstAttachment(item) {
  try {
    if (!item || item.isNote()) return "Invalid item type";
    let paths = [];
    if (item.isRegularItem()) {
      paths = await getRegularItemAttachments(item);
    } else if (item.isAttachment()) {
      paths = await getAttachmentPath(item);
    }
    if (paths.length > 0) {
      revealInFinder(paths[0]);
      return `${paths[0]} revealed in Finder`;
    }
    return "No attachment found";
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

processFirstAttachment(items[0]).then(result => {
  Zotero.log(result);
});