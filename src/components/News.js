import React, { useState, useEffect } from 'react'
import NewsItem from './NewsItem'
import Spineer from './Spineer'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'


const News = (props)=> {
  const [articles,setArticles] = useState([])
  const [loading,setLoading] = useState(true)
  const [page,setPage] = useState(1)
  const [totalResults,settotalResults] = useState(1)
  // document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
  const capitalizeFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1);
  }
  const updateNews = async () => {
    props.setProgress(0);
  
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
  
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    console.log(parsedData);
    props.setProgress(70);
    setArticles(parsedData.articles);
    settotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };
  

  useEffect(()=>{
    updateNews();
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
  },[])

  const fetchMoreData = async () => {
    setPage(page + 1);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
  
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    setArticles(articles.concat(parsedData.articles));
    settotalResults(parsedData.totalResults);
  };
  


    return (
      <div className='container my-2'>
        <h2 className='text-center'>NewsMonkey- Top Headlines from {capitalizeFirstLetter(props.category)}</h2>
        {loading && <Spineer />} 
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spineer />} 
        >

        <div className="container">
        
        
        <div className="row">
        {articles.map((element) => {
          return <div className="col-md-4" key={element.url}>
          <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageurl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
          </div>
        })}
        </div>
        </div>
        </InfiniteScroll>
      </div>
    )
  
}


News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general',
}
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News


// col-md-4 means meadium devices me 4 column. In bootstrap there use to be 12 column.
// Now in the question we have to make a row of three items.
// when three item will be identified then a row will be papulate.