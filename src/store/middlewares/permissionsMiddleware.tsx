import { Middleware } from '@reduxjs/toolkit';
import { signalingActions } from '../slices/signalingSlice';
import { Logger } from '../../utils/logger';
import { MiddlewareOptions } from '../store';
import { permissionsActions } from '../slices/permissionsSlice';

const logger = new Logger('PermissionsMiddleware');

const createPermissionsMiddleware = ({
	signalingService
}: MiddlewareOptions): Middleware => {
	logger.debug('createPermissionsMiddleware()');

	const middleware: Middleware = ({ dispatch }) =>
		(next) => async (action) => {
			if (signalingActions.connected.match(action)) {
				signalingService.on('notification', (notification) => {
					logger.debug(
						'signalingService "notification" event [method:%s, data:%o]',
						notification.method, notification.data);

					try {
						switch (notification.method) {
							case 'signInRequired': {
								dispatch(permissionsActions.setLoggedIn(false));
								dispatch(permissionsActions.setSignInRequired(true));
								break;
							}

							case 'lockRoom': {
								dispatch(permissionsActions.setLocked(true));
								break;
							}

							case 'unlockRoom': {
								dispatch(permissionsActions.setLocked(false));
								break;
							}
						}
					} catch (error) {
						logger.error('error on signalService "notification" event [error:%o]', error);
					}
				});
			}

			return next(action);
		};

	return middleware;
};

export default createPermissionsMiddleware;