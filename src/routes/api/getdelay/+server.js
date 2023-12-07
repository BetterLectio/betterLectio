import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { deleteApp, getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyA0PfQiXswZmGxwoyMVGrs3r7ocwv73Ako',
	authDomain: 'betterlectio-36bb9.firebaseapp.com',
	projectId: 'betterlectio-36bb9',
	storageBucket: 'betterlectio-36bb9.appspot.com',
	messagingSenderId: '1068596128158',
	appId: '1:1068596128158:web:9dffe9cfdf8bb8d2b80e8f'
};

let firebase;
if (!getApps().length) {
	firebase = initializeApp(firebaseConfig);
} else {
	firebase = getApp();
	deleteApp(firebase);
	firebase = initializeApp(firebaseConfig);
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	// firebase stuff
	const db = getFirestore();
	const delayRef = collection(db, 'Lectio Delay');
	const querySnapshot = await getDocs(delayRef);
	const docs = querySnapshot.docs.map(doc => doc.data());
	const doc = docs[0];
	let docIndex = 0;
	docs.forEach(doc => {
		if (doc.time.seconds > docs[docIndex].time.seconds) docIndex = docs.indexOf(doc);
	});

	return new Response(JSON.stringify(docs[docIndex]));
}
