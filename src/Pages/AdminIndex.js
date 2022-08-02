import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import '../static/AdminIndex.css'
import { useState } from 'react';

import {BrowserRouter as Router, Route} from "react-router-dom";
import AddArticle from './AddArticle';
import ArticleList from './ArticleList';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const AdminIndex = (props)=> {

    const [collapsed,setCollapsed]=useState(false)
    const [subbreadcrumb,setSubbreadcrumb]=useState()

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    const ArticleClickHandler = (e) => {

        console.log("AdminIndex---props--->"+props)
        console.log("AdminIndex---e.key--->"+e.key)

        if(e.key==='addArticle'){
          props.history.push('/index/add')
          setSubbreadcrumb("Add Article")
        }else{
          props.history.push('/index/list')
          setSubbreadcrumb("List Article")
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        Dashboard 
                    </Menu.Item>

                    <SubMenu 
                        key="sub1" 
                        icon={<UserOutlined />} 
                        title="Article Manage"
                        onClick={ArticleClickHandler}
                    >
                        <Menu.Item key="addArticle">Add Article </Menu.Item>
                        <Menu.Item key="articleList">List Article</Menu.Item>
                    </SubMenu>

                    <Menu.Item key="9" icon={<SettingOutlined />}>
                        Admin
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Article Manage</Breadcrumb.Item>
                        <Breadcrumb.Item>{subbreadcrumb}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <div key={props.location.key}>
                           <Router>
                                <Route path="/index/" exact component={AddArticle} />
                                <Route path="/index/add" exact component={AddArticle} />
                                <Route path="/index/add/:id" exact component={AddArticle} />
                                <Route path="/index/list" exact component={ArticleList} />
                           </Router>
                        </div>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
}

export default AdminIndex;