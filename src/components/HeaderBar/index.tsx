import { ChangeEvent, FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Divider, Input, Row, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { getUserData, useAuthenActions } from "../../store";
import "./styles.scss";

const { Title } = Typography;
const HeaderBar: FC = () => {
  const navigate = useNavigate();
  const { isSignIn, signIn, signOut } = useAuthenActions();
  const userData = getUserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.currentTarget.value.trim());
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value.trim());
  const onSignIn = () => {
    signIn({
      url: "/auth/signin",
      email,
      password,
    }).then(() => {
      setEmail("");
      setPassword("");
    });
  };
  const onSignUp = () => {
    signIn({
      url: "/auth/signup",
      email,
      password,
    }).then(() => {
      setEmail("");
      setPassword("");
    });
  };
  const onSignOut = () => signOut();
  const onNavigateToPostVideo = () => navigate("/post-movie");
  const SignedInLayout = (
    <>
      <p className="welcome-text test-class">
        <span className="bold">Welcome </span>
        {userData?.email}
      </p>
      <Button type="primary" onClick={onNavigateToPostVideo}>
        Share a movie
      </Button>
      <Divider type="vertical" className="button-divider" />
      <Button onClick={onSignOut} type="primary">
        Logout
      </Button>
    </>
  );
  const NotSignedInLayout = (
    <>
      <Input
        placeholder="email"
        className="header-input margin-left-auto"
        value={email}
        onChange={onEmailChange}
      />
      <Input
        placeholder="password"
        type="password"
        className="header-input"
        value={password}
        onChange={onPasswordChange}
      />
      <div className="buttons-group flex-layout">
        <Button type="primary" onClick={onSignIn}>
          Login
        </Button>
        <Divider type="vertical" className="button-divider" />
        <Button type="primary" onClick={onSignUp}>
          Register
        </Button>
      </div>
    </>
  );

  return (
    <Row className="header">
      <Col className="flex-layout" span={8}>
        <Link className="flex-layout header-right-content" to="/">
          <HomeOutlined className="home-icon" />
          <Title className="header-title">Funny Movies</Title>
        </Link>
      </Col>
      <Col span={16}>
        <div className="header-left-content flex-layout">
          {isSignIn ? SignedInLayout : NotSignedInLayout}
        </div>
      </Col>
      <Divider />
    </Row>
  );
};

export default HeaderBar;
