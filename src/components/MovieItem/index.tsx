import { FC } from "react";
import { Button, Card, Col, Row, Typography } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { iMovieItem } from "../../types";
import Parser from "html-react-parser";
import "./styles.scss";

interface Props extends iMovieItem {
  onUpVoteMovie: (id: string) => () => void;
  onDownVoteMovie: (id: string) => () => void;
}
const MovieItem: FC<Props> = ({
  _id,
  title,
  movieUrlId,
  user: { email },
  description,
  upVoteAmount,
  downVoteAmount,
  upVoted,
  downVoted,
  isVoted,
  onUpVoteMovie,
  onDownVoteMovie,
}) => {
  return (
    <Card className="movie-item" hoverable data-testid="movie-item">
      <Row gutter={[24, 24]}>
        <Col
          sm={{ span: 24 }}
          md={{ span: 12 }}
          className="flex-layout video-container"
        >
          <iframe
            title={title}
            className="movie"
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${movieUrlId}?controls=1`}
          />
        </Col>
        <Col sm={{ span: 24 }} md={{ span: 12 }}>
          <div className="flex-layout info">
            <p className="title bold" data-testid="movie-title">
              {title}
            </p>
            <p className="text" data-testid="movie-shared-by">
              <span className="bold">Shared by: </span>
              {email}
            </p>
            <div className="flex-layout">
              <div className="up-vote action">
                <Button
                  ghost
                  type="primary"
                  icon={<LikeOutlined />}
                  disabled={isVoted}
                  className={
                    upVoted ? "action-button up-voted" : "action-button"
                  }
                  onClick={onUpVoteMovie(_id)}
                  data-testid="upvote-btn"
                />
                {upVoteAmount}
              </div>
              <div className="down-vote action">
                <Button
                  ghost
                  icon={<DislikeOutlined />}
                  disabled={isVoted}
                  danger
                  className={
                    downVoted ? "action-button down-voted" : "action-button"
                  }
                  onClick={onDownVoteMovie(_id)}
                  data-testid="downvote-btn"
                />
                {downVoteAmount}
              </div>
            </div>
            <p className="text bold">Description:</p>
            <Typography.Paragraph
              ellipsis={{
                rows: 3,
                expandable: true,
                symbol: "more",
              }}
              className="data"
              data-testid="movie-description"
            >
              {Parser(description)}
            </Typography.Paragraph>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default MovieItem;
