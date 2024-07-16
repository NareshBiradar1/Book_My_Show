import React, { useEffect } from "react";
import { GetCurrentUser } from "../calls/users";
import { useNavigate } from "react-router-dom";
// import { message, Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { Header } from "antd/es/layout/layout";
import { setUser } from "../redux/userSlice";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
// import { setUser } from "../redux/userSlice";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, []);

  const getValidUser = async () => {
    try {
      dispatch(showLoading());
      const response = await GetCurrentUser();
      dispatch(setUser(response.data));
      dispatch(hideLoading());
      // Check if the user's role is not allowed
      if (!allowedRoles.includes(response.data.role)) {
        navigate("/unauthorized");
      }
    } catch (error) {
      dispatch(setUser(null));
  //     message.error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     getValidUser();
  //   } else {
      navigate("/login");
    }
  }

  // Only render children if there is a user and the user's role is allowed
  const navigateToProfile = () => {
    switch (user.role) {
      case "admin":
        navigate("/admin");
        break;
      case "partner":
        navigate("/partner");
        break;
      case "user":
        navigate("/profile");
        break;
      default:
        navigate("/");
    }
  };
  return user ? (
    <Layout>
      <Header
        className="d-flex justify-content-between"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link to="/">
          <h3 className="demo-logo text-white m-0">Book My Show</h3>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            { label: <Link to="/">Home</Link>, icon: <HomeOutlined /> },
            {
              label: `${user ? user.name : ""}`,
              icon: <UserOutlined />,
              children: [
                {
                  label: (
                    <span onClick={navigateToProfile}>
                      My Profile
                    </span>
                  ),
                  icon: <ProfileOutlined />,
                },
                {
                  label: (
                    <Link
                      to="/login"
                      onClick={() => {
                        localStorage.removeItem("token");
                        dispatch(setUser(null));
                        navigate("/login");
                      }}
                    >
                      Log Out
                    </Link>
                  ),
                  icon: <LogoutOutlined />,
                },
              ],
            },
          ]}
        />
      </Header>
      <div style={{ padding: 24, minHeight: 380, background: "#fff" }}>
        {children}
      </div>
    </Layout>
  ) : null;
}

export default ProtectedRoute;
