import { HashRouter, Route, Routes } from 'react-router-dom';

import { routes } from './constants/Routes';
import App from './containers/App';
import ClassifyPage from './containers/ClassifyPage';
import ExplorePage from './containers/ExplorePage';
import HomePage from './containers/HomePage';
import MediaToolsPage from './containers/MediaToolsPage';

export default function Root() {
  return (
    <HashRouter>
      <App>
        <Routes>
          <Route path={routes.CLASSIFY.path} element={<ClassifyPage />} />
          <Route path={routes.EXPLORE.path} element={<ExplorePage />} />
          <Route path={routes.MEDIA_TOOLS.path} element={<MediaToolsPage />} />
          <Route path={routes.HOME.path} element={<HomePage />} />
        </Routes>
      </App>
    </HashRouter>
  );
}
