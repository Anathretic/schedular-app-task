import { Box, Divider, Typography } from '@mui/material';

const formatTime = date => {
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const CustomTooltip = ({ appointmentData }) => {
	return (
		<Box sx={{ padding: 2, minWidth: 300 }}>
			<Typography variant='h6' gutterBottom>
				{appointmentData.title}
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				{formatTime(appointmentData.startDate)} - {formatTime(appointmentData.endDate)}
			</Typography>
			{appointmentData.notes && (
				<>
					<Divider sx={{ my: 1 }} />
					<Typography variant='body2'>
						<strong>Notatka:</strong> {appointmentData.notes}
					</Typography>
				</>
			)}
		</Box>
	);
};
