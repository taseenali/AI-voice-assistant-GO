/**
 * OutboxDB Service
 * Responsible for persistent storage of outgoing webhooks.
 * Uses IndexedDB for reliable, multi-tenant aware transaction safety.
 */

const DB_NAME = 'ai_voice_assistant_outbox';
const STORE_NAME = 'outbox';
const DB_VERSION = 2; // Increment for new index

export const OutboxStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  DEAD_LETTER: 'dead-letter'
};

class OutboxDB {
  constructor() {
    this._db = null;
    this._initPromise = null;
  }

  /**
   * Initialize the IndexedDB
   */
  async init() {
    if (this._initPromise) return this._initPromise;

    this._initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        let store;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        } else {
          store = event.currentTarget.transaction.objectStore(STORE_NAME);
        }

        // Ensure all indexes exist
        if (!store.indexNames.contains('status')) store.createIndex('status', 'status', { unique: false });
        if (!store.indexNames.contains('lastAttempt')) store.createIndex('lastAttempt', 'lastAttempt', { unique: false });
        if (!store.indexNames.contains('client_id')) store.createIndex('client_id', 'client_id', { unique: false });
        if (!store.indexNames.contains('createdAt')) store.createIndex('createdAt', 'createdAt', { unique: false });
      };

      request.onsuccess = (event) => {
        this._db = event.target.result;
        resolve(this._db);
      };

      request.onerror = (event) => {
        console.error('OutboxDB: Error opening database', event.target.error);
        reject(event.target.error);
      };
    });

    return this._initPromise;
  }

  /**
   * Add a new item to the outbox
   */
  async add(item) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const record = {
        id: crypto.randomUUID(),
        status: OutboxStatus.PENDING,
        attempts: 0,
        lastAttempt: 0,
        createdAt: Date.now(),
        ...item
      };

      const request = store.add(record);
      request.onsuccess = () => resolve(record.id);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Update an item in the outbox
   */
  async update(id, updates) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (!data) return reject(new Error(`Item ${id} not found`));
        
        const updatedData = { ...data, ...updates };
        const putRequest = store.put(updatedData);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = (event) => reject(event.target.error);
      };
      getRequest.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Remove an item (usually on success)
   */
  async delete(id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Get all items of a certain status
   */
  async getByStatus(status) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('status');
      const request = index.getAll(status);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Get all items requiring processing (pending + eligible for retry)
   * Enforces FIFO (First-In-First-Out) order using createdAt index.
   */
  async getAllProcessable() {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('createdAt');
      const request = index.openCursor(null, 'next'); // ASC order
      
      const items = [];
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const item = cursor.value;
          if (
            item.status === OutboxStatus.PENDING || 
            (item.status === OutboxStatus.PROCESSING && Date.now() - item.lastAttempt > 30000)
          ) {
            items.push(item);
          }
          cursor.continue();
        } else {
          resolve(items);
        }
      };
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Get total count of items in the outbox
   */
  async getCount() {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }
}

export const outboxDB = new OutboxDB();
