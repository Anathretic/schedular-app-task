import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import {
	Scheduler,
	WeekView,
	MonthView,
	DayView,
	Appointments,
	AppointmentForm,
	AppointmentTooltip,
	Toolbar,
	DateNavigator,
	ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import { addEvent, getEvents, updateEvent, deleteEvent } from '../firebase/firebaseClient';
import { CustomTooltip } from './CustomTooltip';

const messages = {
	moreInformationLabel: 'Więcej informacji',
	detailsLabel: 'Szczegóły',
	titleLabel: 'Tytuł',
	allDayLabel: 'Cały dzień',
	repeatLabel: 'Powtarzaj',
	notesLabel: 'Notatki',
	daily: 'Codziennie',
	weekly: 'Co tydzień',
	monthly: 'Co miesiąc',
	yearly: 'Co rok',
	never: 'Nigdy',
	onLabel: 'Na:',
	afterLabel: 'Po:',
	occurrencesLabel: 'powtórzeniach',
	repeatEveryLabel: 'Powtarzaj co:',
	daysLabel: 'dni',
	endRepeatLabel: 'Zakończ powtarzanie',
};

export const SchedulerComponent = () => {
	const [data, setData] = useState([]);
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		const fetchData = async () => {
			try {
				const events = await getEvents();
				setData(events);
			} catch (error) {
				console.error('Error fetching events: ', error);
			}
		};
		fetchData();
	}, []);

	const commitChanges = async ({ added, changed, deleted }) => {
		let newData = data;

		if (added) {
			const addedEvent = await addEvent(added);
			newData = [...data, addedEvent];
		}
		if (changed) {
			for (let id in changed) {
				await updateEvent(id, changed[id]);
				newData = newData.map(appointment =>
					id === appointment.id ? { ...appointment, ...changed[id] } : appointment
				);
			}
		}
		if (deleted !== undefined) {
			await deleteEvent(deleted);
			newData = newData.filter(appointment => appointment.id !== deleted);
		}
		setData(newData);
	};

	return (
		<Paper>
			<Scheduler data={data} locale='pl-PL'>
				<ViewState currentDate={currentDate} onCurrentDateChange={setCurrentDate} />
				<EditingState onCommitChanges={commitChanges} />
				<IntegratedEditing />
				<DayView startDayHour={6} endDayHour={18} displayName='Dzień' />
				<WeekView startDayHour={6} endDayHour={18} displayName='Tydzień' />
				<MonthView displayName='Miesiąc' />
				<Appointments />
				<AppointmentTooltip showOpenButton showDeleteButton contentComponent={CustomTooltip} />
				<AppointmentForm messages={messages} />
				<Toolbar />
				<DateNavigator />
				<ViewSwitcher />
			</Scheduler>
		</Paper>
	);
};
