import { useState, useEffect } from "react";
import { List,Col,Row,Modal,message,Button } from "antd";
import axios from "axios";
import servicePath from "../config/apiUrl";
import '../static/ArticleList.css'

const {confirm}=Modal;

const ArticleList = (props) => {

    const [list,setList]=useState([]);

    const getList = () => {
      axios({
          method:"get",
          url:servicePath.getArticleList,
          header:{ 'Access-Control-Allow-Origin':'*' },
          //withCredentials:true // front and back share the same session
      })
      .then(
          (res) => {
              console.log("ArticleList---getList--->"+res.data.data)
              setList(res.data.data)
          }
      )
    }

    useEffect(() => {
        getList()
    },[])

    const delArticle = (id) => {
        confirm({
            title:"A u sure?",
            content:"Click this button, this article will be removed 4 ever! ",
            onOk(){
                axios(servicePath.delArticle+id,{withCredentials:true}).then(
                    (res) => {
                        message.success("Delete Article success!")
                        getList() // *** you d better not to del and refesh data like this often. 
                    }
                )
            },
            onCancel(){
                message.success("This article status is still same!")
            }
        }) 
    }

    const updateArticle=(id)=>{
        props.history.push('/index/add/'+id);
    }

 
    return ( 
        
        <List
        header={
            <Row className="list-div">
                <Col span={10}>
                    <b>Title</b>
                </Col>
                <Col span={3}>
                    <b>Type</b>
                </Col>
                <Col span={3}>
                    <b>Publish Date</b>
                </Col>
                {/* <Col span={3}>
                    <b>Chapers</b>
                </Col> */}
                <Col span={3}>
                    <b>Views</b>
                </Col>
                <Col span={4}>
                    <b>More+</b>
                </Col>
            </Row>
        }
        bordered
        dataSource={list}
        renderItem={item => (
            <List.Item>
                <Row className="list-div">
                    <Col span={10}>
                        {item.title}
                    </Col>
                    <Col span={3}>
                     {item.typeName}
                    </Col>
                    <Col span={3}>
                        {item.addTime}
                    </Col>
                    {/* <Col span={3}>
                        <span>{item.part_count}</span> chapters
                    </Col> */}
                    <Col span={3}>
                      {item.view_count}
                    </Col>

                    <Col span={4}>
                      <Button type="primary" 
                        onClick={()=>updateArticle(item.id)}
                       >Edit</Button>&nbsp;

                      <Button 
                        onClick={()=>delArticle(item.id)}
                      >Delete </Button>
                    </Col>
                </Row>

            </List.Item>
        )}
      /> 
    );
}
 
export default ArticleList;