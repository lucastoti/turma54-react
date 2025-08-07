import React, { useState, useEffect } from 'react';
import { 
  Modal,
  Container,
  Table,
  Button,
  Form
} from 'react-bootstrap';
import './HomePage.css';
import { CardText, Pencil, Trash } from 'react-bootstrap-icons';



const App = () => {
  const [lista, setLista] = useState([]);
  const [search, setSearch] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [productId, setProductId] = useState(null);
  const [productCategory, setProductCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalAddEditModal, setShowModalAddEditModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');

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
      setProductTitle(resposta.title);
      setProductDetails(resposta.description);
      setShowModal(true);
    });
  };

  const showDeleteModal = (id) => {
    fetch(`https://dummyjson.com/products/${id}`)
    .then(data => data.json())
    .then(resposta => {
      setProductTitle(resposta.title);
      setProductCategory(resposta.category);
      setProductId(resposta.id);
      setShowModalDelete(true);
    });
  };

  const handleDeleteProduct = (id) => {
    fetch(`https://dummyjson.com/products/${id}`, {
      method: 'DELETE'
    })
    .then(data => data.json())
    .then(resposta => {
      if (resposta.isDeleted) {
        setShowModalDelete(false);
        // cenário quando a api é real
        // getLista();
        // cenário quando a api é pública
        setLista(produtos => produtos.filter(i => i.id !== id));
      } else {
        alert('Produto não pode ser deletado'); 
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formTitle,
        category: formCategory
      })
    })
    .then(res => res.json())
    .then(resposta => {
      var listaAntiga = lista;
      listaAntiga.push({
        id: resposta.id,
        title: resposta.title,
        category: resposta.category,
        brand: 'brand test',
        availabilityStatus: 'In Stock'
      })
      setLista(listaAntiga);
      setShowModalAddEditModal(false);
    });
  };

  const handleClose = () => setShowModal(false);
  const handleCloseDeleteModal = () => setShowModalDelete(false);
  const handleCloseAddEditModal = () => setShowModalAddEditModal(false);

  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFormCategory(e.target.value);
  };

  return (
   <Container style={{padding: '50px 0'}}>
    <Button 
      variant='primary'
      style={{marginBottom: '10px'}}
      onClick={() => setShowModalAddEditModal(true)}
    >Add new product</Button>
    <Table striped>
      <thead>
        <tr>
          <th>Title</th>
          <th>Brand</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        { lista.length ?
          lista.map(item => {
            return <tr
                key={item.id}
              >
              <td>{item.title}</td>
              <td>{item.brand}</td>
              <td>{item.availabilityStatus}</td>
              <td>
                <CardText style={{cursor: 'pointer', margin: '0 5px'}} onClick={() => showDetails(item.id)} />
                {/* <Pencil style={{cursor: 'pointer', margin: '0 5px'}} onClick={() => showDetails(item.id)} />  */}
                <Trash style={{cursor: 'pointer', margin: '0 5px'}} onClick={() => showDeleteModal(item.id)} />
              </td>
            </tr>
          })
          : <tr>
              <td colSpan={4}>
                <span>No results found</span>
              </td>
            </tr>
          }
      </tbody>
    </Table>
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{productTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{productDetails}</Modal.Body>
    </Modal>
    <Modal show={showModalDelete} onHide={handleCloseDeleteModal}>
      <Modal.Header closeButton>
        <Modal.Title>Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Title: {productTitle}</div>
        <div>Category: {productCategory}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDeleteModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => handleDeleteProduct(productId)}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
    <Modal show={showModalAddEditModal} onHide={handleCloseAddEditModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add/Edit</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
             <Form.Control
                type="string"
                placeholder="Title"
                value={formTitle}
                onChange={handleTitleChange}
                required
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label>Category</Form.Label>
             <Form.Control
                type="string"
                placeholder="Category"
                value={formCategory}
                onChange={handleCategoryChange}
                required
              />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddEditModal}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Salvar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  </Container>
  );
};

export default App;
