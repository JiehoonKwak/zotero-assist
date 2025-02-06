/**
 * Open the first attachment of a Zotero item with Dropover
 * @author jiehoonk
 * @usage Select an item in Zotero and run this script
 */

if (!items || items.length === 0) return;

/**
 * Retrieve file paths for attachments from a regular Zotero item.
 * @param {Zotero.Item} item Zotero item object
 * @returns {Promise<string[]>} Array of attachment file paths
 */
async function getRegularItemAttachments(item) {
    const paths = [];
    const attachmentIDs = item.getAttachments();
    for (let id of attachmentIDs) {
        const file = await Zotero.Items.get(id).getFilePathAsync();
        if (file) paths.push(file);
    }
    return paths;
}

/**
 * Retrieve file path for an attachment item.
 * @param {Zotero.Item} item Zotero attachment item
 * @returns {Promise<string[]>} Array containing the file path
 */
async function getAttachmentPath(item) {
    const paths = [];
    const file = await item.getFilePathAsync();
    if (file) paths.push(file);
    return paths;
}

/**
 * Open specified files with Dropover using the macOS 'open' command.
 * @param {string[]} filePaths Array of file paths
 */
function openFilesWithDropover(filePaths) {
    // Create an nsIFile instance pointing to the 'open' utility
    let file = Components.classes["@mozilla.org/file/local;1"]
        .createInstance(Components.interfaces.nsIFile);
    file.initWithPath("/usr/bin/open");

    // Create an nsIProcess instance to run the command
    let process = Components.classes["@mozilla.org/process/util;1"]
        .createInstance(Components.interfaces.nsIProcess);

    // Build command arguments: '-b', 'me.damir.dropover-mac', followed by file paths
    let args = ["-b", "me.damir.dropover-mac"].concat(filePaths);

    process.init(file);
    process.run(false, args, args.length);
}

/**
 * Open the first attachment of a Zotero item using Dropover.
 * @param {Zotero.Item} item Zotero item object
 * @returns {Promise<string>} Result message
 */
async function openFirstAttachmentWithDropover(item) {
    try {
        if (!item || item.isNote()) return "Invalid item type";

        let paths = [];
        if (item.isRegularItem()) {
            paths = await getRegularItemAttachments(item);
        } else if (item.isAttachment()) {
            paths = await getAttachmentPath(item);
        }

        if (paths.length > 0) {
            openFilesWithDropover([paths[0]]);
            return `${paths[0]} opened with Dropover`;
        }
        return "No attachment found";
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

// Execute on the first selected item
openFirstAttachmentWithDropover(items[0]).then(result => {
    Zotero.log(result);
});

