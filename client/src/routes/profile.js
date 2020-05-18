import Statistics from '../components/profile/Statistics'
import ListeningHistory from '../components/profile/History'
import Profile from '../components/profile/Profile'
import Spotify from '../components/profile/Spotify'

const profileChildrenPaths = [
    {
      path: 'statistics', component: Statistics,
    },
    {
      path: 'history', component: ListeningHistory
    }
  ]

const secureProfileChildrenPaths = [
    {
      path: 'spotify', component: Spotify,
    },
]

const routes = [
    { path: '/profile', component: Profile,
    children: [...profileChildrenPaths, ...secureProfileChildrenPaths],
    meta: { secure: true, root: true},
    spathToRegexpOptions: { strict: true }},

    { path: '/profile/:username', component: Profile,
    children: profileChildrenPaths,
    meta: {root: true, profileMustExist: true}},
]

export default routes;
