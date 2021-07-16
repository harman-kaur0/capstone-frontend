import firebase from 'firebase'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBWXMFaVO5M_vP0dJxQUVD8lB8ULVgslrQ",
    authDomain: "my-clinic-663b2.firebaseapp.com",
    projectId: "my-clinic-663b2",
    storageBucket: "my-clinic-663b2.appspot.com",
    messagingSenderId: "20659142695",
    appId: "1:20659142695:web:48be457c2ee82830894e02",
    measurementId: "G-8H1RMR0GWC"
  };

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export { storage, firebase as default }
