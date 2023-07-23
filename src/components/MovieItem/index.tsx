import React, { FC } from "react";
import { Button, Card, Col, Row } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import "./styles.scss";
import { iMovieItem } from "../../types";

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
    <Card className="movie-item" hoverable>
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
          ></iframe>
        </Col>
        <Col sm={{ span: 24 }} md={{ span: 12 }}>
          <div className="flex-layout info">
            <p className="title bold">{title}</p>
            <p className="text">
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
                />
                {downVoteAmount}
              </div>
            </div>
            <p className="text bold">Description:</p>
            <p
              className="data"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default MovieItem;
