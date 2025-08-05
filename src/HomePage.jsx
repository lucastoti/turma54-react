import React, { useState, useEffect } from 'react';
import { 
  Button,
  Container,
  Row,
  Col,
  Toast
} from 'react-bootstrap';
import './HomePage.css';


const App = () => {
  const [lista, setLista] = useState([]);
  const [search, setSearch] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    getLista();
  }, []); 

  const getLista = () => {
    fetch('https://dummyjson.com/products')
    .then(data => data.json())
    .then(resposta => {
      setLista(resposta.products);
    });
  };
  
  useEffect(() => {
    filterLista(search);
  }, [search]); 

  const filterLista = (filter) => {
    fetch(`https://dummyjson.com/products/search?q=${filter}`)
    .then(data => data.json())
    .then(resposta => {
      setLista(resposta.products);
    });
  };

  const showDetails = (id) => {
    fetch(`https://dummyjson.com/products/${id}`)
    .then(data => data.json())
    .then(resposta => {
      setDetails(resposta.description);
    });
  };


  return (
   <Container>
    <input
      value={search} 
      onChange={e => setSearch(e.target.value)}
      style={{marginBottom: '10px'}}
    /> 
    { lista.length && 
      lista.map(item => {
        return <div 
            key={item.id}
            className='row-spacing'
            style={{border: '1px solid', marginBottom: '10px', cursor: 'pointer'}}
            onClick={() => showDetails(item.id)}
            >
              {item.title}
              { details && <div style={{fontSize: '9px'}}>{details}</div> }
            </div>;
      })
    }

  </Container>
  );
};

export default App;
