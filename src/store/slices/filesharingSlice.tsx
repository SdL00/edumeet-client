import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilesharingFile } from '../../utils/types';

type FilesharingState = FilesharingFile[];

const initialState: FilesharingState = [];

const filesharingSlice = createSlice({
	name: 'filesharing',
	initialState,
	reducers: {
		addFile: ((state, action: PayloadAction<FilesharingFile>) => {
			state.push(action.payload);
		}),
		updateFile: ((state, action: PayloadAction<FilesharingFile>) => {
			const file = state.find((f) => f.magnetURI === action.payload.magnetURI);

			if (file) {
				const {
					peerId,
					displayName,
					timestamp,
					magnetURI,
					started,
				} = action.payload;

				if (peerId)
					file.peerId = peerId;
				if (displayName)
					file.displayName = displayName;
				if (timestamp)
					file.timestamp = timestamp;
				if (magnetURI)
					file.magnetURI = magnetURI;
				if (started !== undefined)
					file.started = started;
			}
		}),
		addFiles: ((state, action: PayloadAction<FilesharingFile[]>) => {
			return [ ...state, ...action.payload ];
		}),
		clearFiles: (() => {
			return [];
		}),
	}
});

export const filesharingActions = filesharingSlice.actions;
export default filesharingSlice;