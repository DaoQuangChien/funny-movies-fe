import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Divider, Form, Input, Row, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useAuthenActions } from "../../store";
import "./styles.scss";

const { Title } = Typography;
const HeaderBar: FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userData, isSignIn, signIn, signOut } = useAuthenActions();
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState("");
  const handleFinish = (values: { email: string; password: string }) => {
    const { email, password } = values;

    setSubmitting(true);
    signIn({
      url: `/auth/${action}`,
      email,
      password,
    })
      .then(() => {
        form.resetFields();
      })
      .catch((e) => console.error(e))
      .finally(() => setSubmitting(false));
  };
  const handleSubmitBtnClick = (btnAction: string) => () => {
    setAction(btnAction);
    form.submit();
  };
  const onSignOut = () => signOut();
  const onNavigateToPostVideo = () => navigate("/post-movie");
  const SignedInLayout = (
    <Row gutter={[8, 8]} align="middle">
      <Col>
        <p className="welcome-text test-class" data-testid="welcome-text">
          <span className="bold">Welcome </span>
          {userData?.email}
        </p>
      </Col>
      <Col>
        <div className="buttons-group flex-layout">
          <Button
            type="primary"
            onClick={onNavigateToPostVideo}
            data-testid="share-movie-btn"
          >
            Share a movie
          </Button>
          <Divider type="vertical" className="button-divider" />
          <Button onClick={onSignOut} type="primary" data-testid="logout-btn">
            Logout
          </Button>
        </div>
      </Col>
    </Row>
  );
  const NotSignedInLayout = (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="inline"
      className="header-right-content"
    >
      <Row gutter={[8, 8]} justify="end">
        <Col>
          <Form.Item
            name="email"
            className="header-input margin-left-auto"
            rules={[
              {
                required: true,
                whitespace: true,
                type: "email",
                transform: (value) => value.trim(),
              },
            ]}
            noStyle
          >
            <Input
              className="header-input"
              placeholder="email"
              data-testid="email-input"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="password"
            className="header-input"
            rules={[
              {
                required: true,
                whitespace: true,
                transform: (value) => value.trim(),
              },
            ]}
            noStyle
          >
            <Input
              className="header-input"
              placeholder="password"
              type="password"
              data-testid="password-input"
            />
          </Form.Item>
        </Col>
        <Col>
          <div className="buttons-group flex-layout">
            <Button
              htmlType="submit"
              type="primary"
              disabled={submitting}
              onClick={handleSubmitBtnClick("signin")}
              data-testid="login-btn"
            >
              Login
            </Button>
            <Divider type="vertical" className="button-divider" />
            <Button
              type="primary"
              disabled={submitting}
              onClick={handleSubmitBtnClick("signup")}
              data-testid="register-btn"
            >
              Register
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );

  return (
    <>
      <Row className="header" align="middle" gutter={[8, 8]}>
        <Col className="flex-layout" md={{ span: 8 }}>
          <Link className="flex-layout header-left-content" to="/">
            <HomeOutlined className="home-icon" />
            <Title className="header-title">Funny Movies</Title>
          </Link>
        </Col>
        <Col md={{ span: 16 }}>
          <div className="header-right-content flex-layout">
            {isSignIn ? SignedInLayout : NotSignedInLayout}
          </div>
        </Col>
      </Row>
      <Divider />
    </>
  );
};

export default HeaderBar;
