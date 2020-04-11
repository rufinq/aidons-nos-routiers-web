import * as firebase from 'firebase/app'
import 'firebase/functions'

const config = {
    apiKey: process.env.APP_API_KEY,
    projectId: process.env.APP_PROJECT_ID,
    authDomain: process.env.APP_AUTH_DOMAIN,
    databaseURL: process.env.APP_DATABASE_URL,
    appId: process.env.APP_ID
}

firebase.initializeApp(config)

if (process.env.NODE_ENV === 'development'){
    firebase.functions().useFunctionsEmulator('http://localhost:5001')
}

export const functions = {
    apiCall: firebase.functions().httpsCallable('apiCall')
}