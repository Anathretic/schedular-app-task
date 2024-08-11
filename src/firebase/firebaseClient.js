import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Dodanie nowego wydarzenia
export const addEvent = async event => {
	const docRef = await addDoc(collection(db, 'events'), event);
	return { id: docRef.id, ...event };
};

// Pobranie wszystkich wydarzeń
export const getEvents = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, 'events'));
		const events = querySnapshot.docs.map(doc => {
			const data = doc.data();
			return {
				id: doc.id,
				title: data.title,
				startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate,
				endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate,
				notes: data.notes,
			};
		});
		return events;
	} catch (error) {
		console.error('Error getting events: ', error);
		return [];
	}
};

// Aktualizacja wydarzenia
export const updateEvent = async (id, updatedEvent) => {
	const eventRef = doc(db, 'events', id);
	await updateDoc(eventRef, updatedEvent);
};

// Usunięcie wydarzenia
export const deleteEvent = async id => {
	const eventRef = doc(db, 'events', id);
	await deleteDoc(eventRef);
};
