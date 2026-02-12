export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("SubtextDB", 1);
        request.onerror = (event) => reject("IndexedDB error");
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("files")) {
                db.createObjectStore("files");
            }
        };
        request.onsuccess = (event) => resolve(event.target.result);
    });
};

export const saveFile = async (file) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["files"], "readwrite");
        const store = transaction.objectStore("files");
        const request = store.put(file, "current_pdf");
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e);
    });
};

export const getFile = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["files"], "readonly");
        const store = transaction.objectStore("files");
        const request = store.get("current_pdf");
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (e) => reject(e);
    });
};
