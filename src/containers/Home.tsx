import { useCallback, useEffect, useState } from "react";
import { List } from "antd";
import { MovieItem } from "../components";
import request from "../services/request";
import { useAuthenActions } from "../store";
import { iMovie, iMovieItem } from "../types";

const { Item } = List;
const Home = () => {
  const { isSignIn, userData } = useAuthenActions();
  const [moviesList, setMoviesList] = useState<iMovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const getMoviesList = useCallback(() => {
    setLoading(true);
    request
      .get<unknown, { data: iMovie[] }>("/movies")
      .then((res) => {
        setMoviesList(
          res.data.map((movie) => {
            const { upVotes, downVotes } = movie;
            let isVoted = false;
            let upVoted = false;
            let downVoted = false;

            if (userData) {
              upVoted = !!upVotes.find((user) => user._id === userData.id);
              downVoted = !!downVotes.find((user) => user._id === userData.id);
              isVoted = upVoted || downVoted;
            }
            return {
              ...movie,
              upVoteAmount: upVotes.length,
              downVoteAmount: downVotes.length,
              upVoted,
              downVoted,
              isVoted,
            };
          })
        );
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [userData]);
  const onMovieActions = (url: string, movieId: string) =>
    request
      .post(url, { movieId })
      .then(getMoviesList)
      .catch((e) => console.error(e));
  const onUpVoteMovie = (movieId: string) => () =>
    onMovieActions("movie/upvote", movieId);
  const onDownVoteMovie = (movieId: string) => () =>
    onMovieActions("movie/downvote", movieId);

  useEffect(() => {
    getMoviesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignIn]);
  return (
    <div className="home-container">
      <List
        loading={loading}
        dataSource={moviesList}
        renderItem={(movie) => (
          <Item>
            <MovieItem
              {...movie}
              onUpVoteMovie={onUpVoteMovie}
              onDownVoteMovie={onDownVoteMovie}
            />
          </Item>
        )}
      />
    </div>
  );
};

export default Home;
