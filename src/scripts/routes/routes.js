import HomePage from '../pages/home/home-page';
import LandingPage from '../pages/home/landing-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import DetailPage from '../pages/detail/detail-page';
import AddStoryPage from '../pages/add/add-story-page';
import SavedStoryPage from '../pages/saved-story/saved-story-page';

const routes = {
  '/': new LandingPage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/home': new HomePage(),
  '/detail/:id': new DetailPage(),
  '/add': new AddStoryPage(),
  '/saved': new SavedStoryPage(),
};

export default routes;