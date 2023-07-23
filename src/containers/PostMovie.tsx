import React, { ChangeEvent, useState } from "react";
import { Button, Card, Col, Input, notification, Row } from "antd";
import request from "../services/request";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostMovie = () => {
  const navigate = useNavigate();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) =>
    setYoutubeUrl(e.currentTarget.value);
  const onPostMovie = () => {
    let videoId = "";
    const url = youtubeUrl
      .replace(/(>|<)/gi, "")
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    if (url[2] === undefined) {
      notification.error({
        message: "Invalid Link",
        description: "Cannot get video ID from this link",
      });
      return;
    }
    setLoading(true);
    videoId = url[2].split(/[^0-9a-z_-]/i)[0];
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      )
      .then((res) => {
        const {
          data: { items },
        } = res;
        const [
          {
            snippet: { title, description },
          },
        ] = items;
        request
          .post("/movie", {
            title,
            description,
            movieUrlId: videoId,
          })
          .then(() => navigate("/"))
          .catch((e) => console.error(e));
      })
      .catch(() => {
        notification.error({
          message: "Request Error",
          description: "Something went wrong!",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card
      title="Share a Youtube Movie"
      style={{ width: 600, margin: "auto", maxWidth: 600 }}
    >
      <Row gutter={[8, 8]} align="middle">
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          Youtube Url:
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 20 }}>
          <Input
            placeholder="Youtube Url"
            value={youtubeUrl}
            onChange={onUrlChange}
            data-testid="url-input"
          />
        </Col>
        <Col xs={{ offset: 0 }} md={{ offset: 4 }}>
          <Button
            type="primary"
            loading={loading}
            onClick={onPostMovie}
            data-testid="share-btn"
          >
            Share
          </Button>
        </Col>
      </Row>
      <Row gutter={[8, 8]}></Row>
    </Card>
  );
};

export default PostMovie;
