import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyChHN8TejlQ_QvpBir3Yv3_zVGc81X_PAo",
    authDomain: "sample-project1-5a8dc.firebaseapp.com",
    projectId: "sample-project1-5a8dc",
    storageBucket: "sample-project1-5a8dc.firebasestorage.app",
    messagingSenderId: "1079189514046",
    appId: "1:1079189514046:web:6eb28d1725abfc2c1fee6f"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  export { db };