import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { stopPreviewWebcam, updatePreviewWebcam } from '../../store/actions/mediaActions';
import {
	useAppDispatch,
	useAppSelector,
	useDeviceSelector
} from '../../store/hooks';
import { meProducersSelector } from '../../store/selectors';
import { deviceActions } from '../../store/slices/deviceSlice';
import {
	ApplyMessage,
	noVideoDevicesLabel,
	selectVideoDeviceLabel,
	videoDeviceLabel
} from '../translated/translatedComponents';
import DeviceChooser, { ChooserDiv } from './DeviceChooser';

interface VideoInputChooserProps {
	preview?: boolean;
	withConfirm?: boolean;
}

const VideoInputChooser = ({
	preview,
	withConfirm
}: VideoInputChooserProps): JSX.Element => {
	const intl = useIntl();
	const dispatch = useAppDispatch();
	const [ confirm, setConfirm ] = useState(false);
	const { webcamProducer } = useAppSelector(meProducersSelector);
	const videoDevices = useDeviceSelector('videoinput');
	const videoInProgress = useAppSelector((state) => state.me.videoInProgress);
	const videoDevice = useAppSelector((state) => state.settings.selectedVideoDevice);

	const handleDeviceChange = (deviceId: string): void => {
		if (deviceId) {
			if (preview) {
				setConfirm(true);

				dispatch(updatePreviewWebcam({
					restart: true,
					newDeviceId: deviceId,
					updateMute: !withConfirm
				}));
			} else {
				dispatch(deviceActions.updateWebcam({
					restart: true,
					newDeviceId: deviceId
				}));
			}
		}
	};

	const handleConfirm = (): void => {
		// TODO: Add replace track support
		dispatch(deviceActions.updateWebcam({
			restart: true
		}));

		setConfirm(false);
	};

	useEffect(() => {
		if (withConfirm) {
			dispatch(updatePreviewWebcam({
				restart: true,
				updateMute: !withConfirm
			}));
		}

		return (): void => {
			if (withConfirm) {
				dispatch(stopPreviewWebcam({
					updateMute: !withConfirm
				}));
			}
		};
	}, []);

	return (
		<ChooserDiv>
			<DeviceChooser
				value={videoDevice}
				setValue={handleDeviceChange}
				name={videoDeviceLabel(intl)}
				devicesLabel={selectVideoDeviceLabel(intl)}
				noDevicesLabel={noVideoDevicesLabel(intl)}
				disabled={videoDevices.length === 0 || videoInProgress}
				devices={videoDevices}
			/>
			{ withConfirm && webcamProducer && (
				<Button
					onClick={handleConfirm}
					disabled={!confirm || videoInProgress}
				>
					<ApplyMessage />
				</Button>
			)}
		</ChooserDiv>
	);
};

export default VideoInputChooser;