import React from 'react';
import './App.css';
import MainPage from "./pages/MainPage";
import {Routes, Route} from "react-router-dom";
import MovieInfoPage from "./pages/MovieInfoPage";
import Navbar from "./components/Navbar";
import { PageRoutes } from './routes/pageRoutes'
import MoviesListPage from "./pages/MoviesListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchResultPage from "./pages/SearchResultPage";
import GenrePage from "./pages/GenrePage";
import UserProfilePage from "./pages/UserProfilePage";
import PersonInfoPage from './pages/PersonInfoPage';
import GenreListPage from './pages/GenreListPage';

function App() {
  return (
      <>
          <Navbar />
          <Routes>
              <Route path={'/'} element={<MainPage />}/>
              <Route path={PageRoutes.HOME} element={<MainPage />}/>
              <Route path={PageRoutes.MOVIE_INFO_ROUTE} element={<MovieInfoPage />}/>
              <Route path={PageRoutes.PERSON_INFO_ROUTE} element={<PersonInfoPage />}/>
              <Route path={PageRoutes.MOVIE_LIST} element={<MoviesListPage />}/>
              <Route path={PageRoutes.SEARCH_RESULT} element={<SearchResultPage />}/>
              <Route path={PageRoutes.GENRE_LIST} element={<GenreListPage />}/>
              <Route path={PageRoutes.GENRE_INFO_ROUTE} element={<GenrePage />}/>
              <Route path={PageRoutes.LOGIN} element={<LoginPage />}/>
              <Route path={PageRoutes.REGISTER} element={<RegisterPage />}/>
              <Route path={PageRoutes.USER_PROFILE_ROUTE} element={<UserProfilePage />}/>
          </Routes>
      </>
  );
}

export default App;
