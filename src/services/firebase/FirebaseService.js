const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
const InvariantError = require('../../Error/InvariantError');

class FirebaseService {
  constructor() {
    this.firebaseConfig = {
      apiKey: process.env.FB_API_KEY,
      authDomain: process.env.FB_AUTH_DOMAIN,
      projectId: process.env.FB_PROJECT_ID,
      storageBucket: process.env.FB_STORAGE_BUCKET,
      messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
      appId: process.env.FB_APP_ID,
      measurementId: process.env.FB_MEASUREMENT_ID,
    };

    this.app = initializeApp(this.firebaseConfig);
    this.storage = getStorage(this.app);
  }

  async addImage(filename, file, metadata) {
    try {
      const storageRef = ref(this.storage, `productsImage/${filename}`);
      await uploadBytes(storageRef, file, metadata);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      throw new InvariantError(error.message);
    }
  }

  async deleteImage(filename) {
    try {
      const storageRef = ref(this.storage, `productsImage/${filename}`);
      await deleteObject(storageRef);
    } catch (error) {
      throw new InvariantError(error.message);
    }
  }
}

module.exports = FirebaseService;
