'use client';
import { useEffect, useState } from 'react';

export default function News() {
  const [news, setNews] = useState([]);
  const [articleNum, setArticleNum] = useState(3);
  
  const fetchData = async()=>{
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?q=In&from=2024-04-19&sortBy=publishedAt&apiKey=70441cb00da94e639c27e59db191569d`
      );
      const data = await res.json();
      setNews(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }
  useEffect(() => {
    fetchData()
  }, []);

  return (
    <div className='text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2'>
      <h4 className='font-bold text-xl px-4'>Whats happening</h4>
      {news?.slice(0, articleNum).map((article) => (
        <div key={article.url}>
          <a href={article.url} target='_blank'>
            <div className='flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200 transition duration-200'>
              <div className='space-y-0.5'>
                <h6 className='text-sm font-bold'>{article.title}</h6>
                <p className='text-xs font-medium text-gray-500'>
                  {article.source.name}
                </p>
              </div>
              <img src={article?.urlToImage} width={70} className='rounded-xl' />
            </div>
          </a>
        </div>
      ))}
      <button
        onClick={() => setArticleNum(articleNum + 3)}
        className='text-blue-300 pl-4 pb-3 hover:text-blue-400 text-sm'
      >
        Load more
      </button>
    </div>
  );
}