import Statistics from '../components/Statistics'
import ListeningHistory from '../components/History'
import Profile from '../components/Profile'
import Spotify from '../components/Spotify'

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
