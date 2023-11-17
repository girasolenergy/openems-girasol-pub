import { Environment } from 'src/environments';
import { theme } from './theme';

export const environment: Environment = {
  ...theme,
  ...{
    uiTitle: 'Girasol Energy Management System',
    edgeShortName: 'Girasol Energy OpenEMS',
    edgeLongName: 'Open Energy Management System',

    backend: 'OpenEMS Backend',
    url: 'wss://' + 'dev-ems.pplc.co/saml/',

    production: true,
    debugMode: false,
  },
};
