/* eslint-disable array-bracket-spacing */
/* eslint-disable camelcase */
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { deleteApp, getApp, getApps, initializeApp } from 'firebase/app';
const QuickChart = require('quickchart-js');
const chart = new QuickChart();

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

// this function is called by Netlify Functions every hour to log the current Lectio latency
// it will later be used to create a graph of Lectio latency over time
export default async req => {
	console.log('Received');

	const startmillis = Date.now();
	await fetch('https://lectio.dk');
	const endmillis = Date.now();

	console.log(`Current Lectio delay: ${endmillis - startmillis}ms`);

	const db = getFirestore();
	const delayRef = collection(db, 'Lectio Delay');

	// get the last 100 documents from the Lectio Delay collection
	const querySnapshot = await getDocs(delayRef);
	const docs = [];
	querySnapshot.forEach(doc => {
		docs.push(doc.data());
	});

	// fort the docs by time.seconds
	docs.sort((a, b) => a.time.seconds - b.time.seconds);

	// if over 50 documents, only use the
	if (docs.length > 50) docs.splice(0, docs.length - 50);

	const labels = [];
	const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const wordLength = 8;

	docs.forEach(doc => {
		let word = '';
		for (let i = 0; i < wordLength; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			word += characters[randomIndex];
		}
		labels.push(word);
	});

	const data = [];
	docs.forEach(doc => {
		data.push(doc.delay);
	});

	// create a graph of Lectio latency over time
	chart.setWidth(100);
	chart.setHeight(48);
	chart.setVersion('2');

	chart.setConfig({
		type: 'line',
		data: {
			labels,
			datasets: [{
				data,
				fill: false,
				borderColor: '#000000',
				borderWidth: 2,
				pointRadius: 0
			}]
		},
		options: {
			legend: { display: false },
			scales: {
				xAxes: [{
					display: false,
					gridLines: { display: false }
				}],
				yAxes: [{
					display: false,
					gridLines: { display: false }
				}]
			}
		}
	});

	// Print the chart URL
	console.log(chart.getUrl());

	// open the Lectio Delay collection
	// add a document to the collection with the time and delay
	const docRef = await addDoc(delayRef, {
		time: new Date(),
		delay: endmillis - startmillis,
		imgUrl: chart.getUrl()
	});

	console.log(`Document written with ID: ${docRef.id}`);
};

