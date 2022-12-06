import DashboardPage from "../pages/DashboardPage"
import FilmsPage from "../pages/FilmsPage"
import GenresPage from "../pages/GenresPage"
import PersonsPage from "../pages/PersonsPage"
import ProducersPage from "../pages/ProducersPage"
import ProfilePage from "../pages/ProfilePage"
import UsersPage from "../pages/UsersPage"
import ViewsPage from "../pages/ViewsPage"
import SalesPage from "../pages/SalesPage"
import LoginPage from "../pages/auth/Login/Login"
import PackagePage from "../pages/PackagePage"
import { NotFoundPage } from "../pages/NotFound/NotFoundPage"
import { DetailFilm } from "../pages/DetailFilm"
import DetailUser from "../pages/DetailUser"
import UploadPage from "../pages/UploadPage"
import DetailPerson from "../pages/DetailPerson";
import RankingPage from "../pages/RankingPage";

export const publicRoutes = [
  {path: '/dashboard', component: DashboardPage},
  {path: '/films', component: FilmsPage},
  {path: '/genres', component: GenresPage},
  {path: '/persons', component: PersonsPage},
  {path: '/producers', component: ProducersPage},
  {path: '/profile', component: ProfilePage},
  {path: '/users', component: UsersPage},
  {path: '/views', component: ViewsPage},
  {path: '/sales', component: SalesPage},
  {path: '/packages', component: PackagePage},
  {path: '/login', component: LoginPage, layout: null},
  {path: '/notfound', component: NotFoundPage, layout: null},
  {path: '/films/:filmId', component: DetailFilm},
  {path: '/users/:userId', component: DetailUser},
  {path: '/films/upload', component: UploadPage, layout: null },
  {path: '/persons/:personId', component: DetailPerson },
  {path: '/rankings', component: RankingPage },

]



