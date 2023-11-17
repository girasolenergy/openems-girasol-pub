import { Environment } from 'src/environments';
import { theme } from './theme';

export const environment: Environment = {
  ...theme,
  ...{
    uiTitle: 'Girasol Energy Management System',
    edgeShortName: 'Girasol Energy OpenEMS',
    edgeLongName: 'Open Energy Management System',

    backend: 'OpenEMS Backend',
    url: 'wss://' + location.hostname,

    production: false,
    debugMode: true,
  },
};
