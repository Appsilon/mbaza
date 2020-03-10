export type RouteType = {
  path: string;
  name: string;
  iconName: string;
};

export interface RoutesType {
  [key: string]: RouteType;
}

export const routes: RoutesType = {
  HOME: {
    path: '/',
    name: 'Home',
    iconName: 'home'
  },
  COUNTER: {
    path: '/counter',
    name: 'Counter',
    iconName: 'pulse'
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
