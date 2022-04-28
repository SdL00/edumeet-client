import {
	Button,
	DialogActions,
	DialogTitle,
	styled,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { uiActions } from '../../store/slices/uiSlice';
import StyledDialog from '../dialog/StyledDialog';
import {
	CloseMessage,
	FilesharingMessage,
	StartingFileSharingMessage,
} from '../translated/translatedComponents';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { sendFiles } from '../../store/actions/filesharingActions';
import FilesharingList from './FilesharingList';

const ShareLabel = styled('label')(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(1),
	alignContent: 'center',
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(1),
}));

const FilesharingDialog = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const filesharingOpen = useAppSelector((state) => state.ui.filesharingOpen);
	const startFileSharingInProgress =
		useAppSelector((state) => state.room.startFileSharingInProgress);

	const handleCloseFilesharing = (): void => {
		dispatch(uiActions.setUi({
			filesharingOpen: !filesharingOpen
		}));
	};

	const handleFileDrop = (event: React.DragEvent<HTMLDivElement>): void => {
		event.preventDefault();

		const droppedFiles = event.dataTransfer.files;

		if (droppedFiles?.length)
			dispatch(sendFiles(droppedFiles));
	};

	const handleAttachFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const selectedFiles = event.target.files;

		if (selectedFiles?.length)
			dispatch(sendFiles(selectedFiles));
	};

	return (
		<StyledDialog
			open={filesharingOpen}
			onClose={handleCloseFilesharing}
			onDrop={handleFileDrop}
			onDragOver={(event) => event.preventDefault()}
		>
			<DialogTitle>
				<FilesharingMessage />
			</DialogTitle>
			<input
				hidden
				id='file-input'
				multiple
				type='file'
				onChange={handleAttachFile}
			/>
			<ShareLabel htmlFor='file-input'>
				<Button
					variant='contained'
					component='span'
					disabled={startFileSharingInProgress}
				>
					<FilesharingMessage />
				</Button>
				{ startFileSharingInProgress &&
					<StartingFileSharingMessage />
				}
			</ShareLabel>
			<FilesharingList />
			<DialogActions>
				<Button
					onClick={handleCloseFilesharing}
					startIcon={<CloseIcon />}
				>
					<CloseMessage />
				</Button>
			</DialogActions>
		</StyledDialog>
	);
};

export default FilesharingDialog;