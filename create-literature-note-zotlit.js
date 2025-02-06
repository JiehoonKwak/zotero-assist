/**
 * Create Literature Note(s) in Obsidian for the currently selected Zotero item(s)
 * @author jiehoonk
 * @usage Run this script from Zotero's PDF view, to create literature notes in Obsidian
 */

function buildItemRecord(item) {
    const record = {
      key: item.key,
      id: item.id,
      libraryID: item.libraryID,
    };
    if (item.library && item.library.isGroup) {
      record.groupID = item.library.groupID;
    }
    return record;
  }
  
  function sendToObsidian(type, action, items) {
    if (items.length === 0) return false;
    // Use version 1.0.1 to match the expected plugin log
    const version = "1.0.1";
    const params = new URLSearchParams();
    params.set("version", version);
    params.set("type", type);
    items.forEach((item, idx) => {
      params.set(`items[${idx}]`, JSON.stringify(buildItemRecord(item)));
    });
    const url = `obsidian://zotero/${action}?${params.toString()}`;
    Zotero.launchURL(url);
    return true;
  }
  
  function handleSelectedItems(action, selectedItems) {
    if (selectedItems.length === 0) return false;
    // Include regular items and attachments with a regular parent
    let processedItems = selectedItems
      .filter(item =>
        item.isRegularItem() ||
        (item.isAttachment() && item.parentItem && item.parentItem.isRegularItem())
      )
      .map(item => (item.isAttachment() ? item.parentItem : item));
  
    // Remove duplicate items based on id
    processedItems = processedItems.filter(
      (item, index, self) =>
        index === self.findIndex(i => i.id === item.id)
    );
    if (processedItems.length === 0) return false;
    return sendToObsidian("item", "export", processedItems);
  }
  
  const pane = Zotero.getActiveZoteroPane();
  if (!pane) {
    Zotero.alert(null, "Create Literature Note", "No active Zotero pane found");
    return;
  }
  const selectedItems = pane.getSelectedItems();
  if (!selectedItems || selectedItems.length === 0) {
    Zotero.alert(null, "Create Literature Note", "No item selected");
    return;
  }
  
  handleSelectedItems("export", selectedItems);
  