
//let ipUrl="https://tikitikihot.com/admin/";
let ipUrl="http://localhost:8080/admin/";


let servicePath = {
    checkLogin:ipUrl + 'checkLogin' ,  //  apiurl-check userName and pwd
    getTypeInfo:ipUrl + 'getTypeInfo',  //  apiurl-get article types
    addArticle:ipUrl + 'addArticle',  //  apiurl-post article to db
    updateArticle:ipUrl + 'updateArticle',  //  apiurl-update article, then to db
    getArticleList:ipUrl + 'getArticleList',  //  apiurl-get articles from db
    delArticle:ipUrl + 'delArticle/',  //  apiurl-rm a article from db
    getArticleById:ipUrl + 'getArticleById/'  //  apiurl-rm a article from db
}
export default servicePath;