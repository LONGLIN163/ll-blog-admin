import {useState, useEffect} from 'react';
import marked from 'marked'
import '../static/AddArticle.css'
import { Row, Col ,Input, Select ,Button ,DatePicker, message } from 'antd'
import axios from "axios"
import servicePath from '../config/apiUrl';

const { Option } = Select;
const { TextArea } = Input;

const AddArticle = (props) => {

    const [articleId,setArticleId] = useState(0) // 0 -> add, 1 -> modify
    const [articleTitle,setArticleTitle] = useState('')   
    const [articleContent , setArticleContent] = useState('')  //edit markdown type content here
    const [markdownContent, setMarkdownContent] = useState('preview...') //marked content show here
    const [introducemd,setIntroducemd] = useState()            //edit markdown type introduce here
    const [introducehtml, setIntroducehtml] = useState('preview...') //marked introduce show here
    const [showDate,setShowDate] = useState()   
    const [typeInfo ,setTypeInfo] = useState([]) // article type info 
    const [selectedType,setSelectType] = useState("select a type") 

    marked.setOptions({
        renderer: marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
      }); 

    const changeContent = (e) => {
        setArticleContent(e.target.value)
        let html=marked(e.target.value)
        setMarkdownContent(html)
    }
    const changeIntroduce = (e) => {
        setIntroducemd(e.target.value)
        let html=marked(e.target.value)
        setIntroducehtml(html)
    }

    const getTypeInfo = () => {
        axios({
            method:"get",
            url:servicePath.getTypeInfo,
            header:{ 'Access-Control-Allow-Origin':'*' },
            //withCredentials:true // front and back share the same session
        }).then(
            (res) => {
                console.log("AddArticle---res---",res)
                if(res.data.data==="not login"){
                    localStorage.removeItem('openId')
                    props.history.push('/')  
                }else{
                    setTypeInfo(res.data.data)
                }
            }
        )
    }

    // once the dom ready, excute this method
    useEffect(() => {
        getTypeInfo();
        //get article id
        let tmpId = props.match.params.id // if there is url with id, means this page is exist article page
        if(tmpId){ 
            setArticleId(tmpId)// if url has id, use this id 
            getArticleById(tmpId) // if url has id, so pull this article data
        } 
    },[]) //[] --- the metod only excute one time

    const selectTypeHandler = (e) =>{
        //setSelectType(e.target.value) // ************select -> e=value************
        setSelectType(e)
    }

    // validate article info when publish article
    const saveArticle = ()=>{
        if(!selectedType){
            message.error('Select a type is must!')  
            return false
        }else if(!articleTitle){
            message.error('Article title can not be empty!')
            return false
        }else if(!articleContent){
            message.error('Article content can not be empty!')
            return false
        }else if(!introducemd){
            message.error('Article introduce can not be empty!')
            return false
        }else if(!showDate){
            message.error('Publish date can not be empty!')
            return false
        }
        let dataProps={}  // collect all info
        dataProps.type_id = selectedType 
        dataProps.title = articleTitle
        dataProps.article_content =articleContent
        dataProps.introduce =introducemd
        let datetext= showDate.replace('-','/') //convert string to timestamp
        dataProps.addTime =(new Date(datetext).getTime())/1000

        if(articleId===0){ // 0 add a new article
            dataProps.view_count=0;
            axios({
                method:"post",
                data:dataProps,
                url:servicePath.addArticle,
                header:{ 'Access-Control-Allow-Origin':'*' },
                //withCredentials:true // front and back share the same session
            }).then(
                res=>{ // when success
                    setArticleId(res.data.insertId) // do change the status of this article
                    if(res.data.isScuccess){
                        message.success("article save success")
                    }else{
                        message.error("article save failed")
                    }
                }
            )
        }else{ // =/=0, this article with this id is exist in db, update
            dataProps.id = articleId 
            axios({
                method:'post',
                url:servicePath.updateArticle,
                header:{ 'Access-Control-Allow-Origin':'*' },
                data:dataProps,
            }).then(
                res=>{       
                    if(res.data.isSuccess){
                        message.success('update success')
                    }else{
                        message.error('update fail');
                    }
                }
            )
        }
    }

    const getArticleById=(id)=>{
        axios(servicePath.getArticleById+id,{
            header:{ 'Access-Control-Allow-Origin':'*' }
        }).then(
            (res) => {
                let data=res.data.data[0]
                setArticleTitle(data.title)
                setArticleContent(data.article_content)

                let html=marked(data.article_content)
                setMarkdownContent(html)
                setIntroducemd(data.introduce)

                let tmpInt = marked(data.introduce)
                setIntroducehtml(tmpInt)
                setShowDate(data.addTime)
                setSelectType(data.typeId)
            }
        )
    }

    return ( 
        <div>
            <Row gutter={5}>
                <Col span={18}>
                    <Row gutter={10}>
                        <Col span={20}>
                            <Input 
                                value={articleTitle}
                                placeholder="blog title.........."
                                size="large"
                                onChange={
                                    e=>{setArticleTitle(e.target.value)}
                                }
                            />
                        </Col>
                        <Col span={4}>
                            &nbsp;
                            <Select defaultValue={selectedType} size="large" onChange={selectTypeHandler}>
                                { 
                                    typeInfo.map((item,index) => {
                                        return (
                                            <Option key={index} value={item.Id}>
                                                {item.typeName}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea
                                className="markdown-content" 
                                placeholder="Article content written here... "
                                rows={30}
                                onChange={changeContent}
                                value={articleContent}
                            />
                        </Col>
                        <Col span={12}>
                            <div className="show-html" dangerouslySetInnerHTML={{__html:markdownContent}}></div>
                        </Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            <Button size="large">Draft</Button> &nbsp;
                            <Button 
                                type="primary" 
                                size="large"
                                onClick={saveArticle}
                            >Publish</Button>
                        </Col>
                        <Col span={24}>
                            <br />
                            <TextArea
                                className="markdown-content" 
                                placeholder="Article introduce written here... "
                                rows={6}
                                onChange={changeIntroduce}
                                value={introducemd}
                            />
                            <br />
                            <div  className="introduce-html" dangerouslySetInnerHTML={{__html:introducehtml}}></div>
                        </Col>
                        <Col span={12}>
                            <div className="date-select">
                                <DatePicker
                                    onChange={(date,dataString)=>{
                                        setShowDate(dataString)
                                    }}
                                    placeholder="publish date"
                                    size="large"  
                                />
                            </div>
                        </Col>
                    </Row>

                </Col>
            </Row>
        </div>
     );
}
 
export default AddArticle;