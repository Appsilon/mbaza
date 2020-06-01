import { IconName } from '@blueprintjs/icons';

export type RouteType = {
  path: string;
  name: string;
  iconName: IconName;
};

export type RoutesType = {
  [key: string]: RouteType;
};

export const routes: RoutesType = {
  HOME: {
    path: '/',
    name: 'Home',
    iconName: 'home'
  },
  CLASSIFY: {
    path: '/classify',
    name: 'Classify',
    iconName: 'send-to-graph'
  },
  EXPLORE: {
    path: '/explore',
    name: 'Explore',
    iconName: 'search-template'
  }
};
