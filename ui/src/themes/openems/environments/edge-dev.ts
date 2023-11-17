import { Environment } from 'src/environments';
import { theme } from './theme';

export const environment: Environment = {
  ...theme,
  ...{
    uiTitle: 'Girasol Energy OpenEMS - PPLC',
    edgeShortName: 'Girasol Energy OpenEMS',
    edgeLongName: 'Open Energy Management System',
    backend: 'OpenEMS Edge',
    url: 'ws://' + location.hostname + ':8085',
    production: false,
    debugMode: true,
  },
};
