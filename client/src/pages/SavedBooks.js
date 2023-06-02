import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth'; // import the 'auth' setup
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';// need these to refactor for GraphQL API
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);// Fetch user data
  const [removeBook, { error }] = useMutation(REMOVE_BOOK); // Mutation for removing a book

  const userData = data?.me || {};  // Retrieve user data from the query response

  const handleDeleteBook = async (bookId) => {
    try {
      const token = Auth.getToken(); // Retrieve the token from the authentication utility

      if (!token) { // If the token is not available, return false
        return false;
      }

      const { data } = await removeBook({ variables: { bookId } });  // Call the 'removeBook' function asynchronously, passing the 'bookId' as variables
      console.log('Deleted record: ', data); // Log the 'data' object, which likely contains information about the deleted record

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;