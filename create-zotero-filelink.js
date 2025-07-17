/**
 * Copy the Zotero select link for the first selected item to the clipboard.
 * @usage Select an item in Zotero and run this script.
 */

if (!items || items.length === 0) {
    Zotero.debug("No items selected.");
    return "No items selected.";
}

// Get the first selected item (using a different variable name)
const selectedItem = items[0];
const itemKey = selectedItem.key; // Use the new variable name here too

// Construct the Zotero select link
const zoteroLink = `zotero://select/library/items/${itemKey}`;

// Copy the link to the clipboard
try {
    // Use Zotero's clipboard helper
    const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
    clipboardHelper.copyString(zoteroLink);
    Zotero.debug(`Copied to clipboard: ${zoteroLink}`);
    return `Copied: ${zoteroLink}`; // Optional: Return message for Zotero console
} catch (e) {
    // Zotero.logError(`Failed to copy link: ${e}`);
    // return `Error copying link: ${e.message}`; // Optional: Return error message
}