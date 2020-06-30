import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reviews = () => {
    const [postDataPromos, setPostDataPromos] = useState([]);
    const [code, setCode] = useState('');
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    const [deleteCodeModal, setDeleteCodeModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [reviewsReady, setReviewsReady] = useState(false);
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    useEffect(() => {
        receivedData();
        // console.log("RECEIVED DATA", offset)
    }, [offset]);

    useEffect(() => {
        if (postDataPromos === null) { setOffset(offset - limit); }
        // receivedData()
    }, [postDataPromos]);

    useEffect(() => {
        receivedData()
    }, [reviewsReady]);

    useEffect(() => {
        if (pageCount < offset) setOffset(0);
    }, [pageCount]);

    const receivedData = () => {
        axios.get(process.env.REACT_APP_API_LINK + `/api/review/unverified?offset=${offset}&limit=${limit}`, config).then(async res => {
            // console.log(res.data.data)
            await setPageCount(Math.ceil(res.data.nbResults / limit));

            const newPostDataPromos = res.data.data.length > 0 ? res.data.data.map((promo) =>
                <>
                    {!promo.verified &&
                        <tr key={promo.id}>
                            <td><p className="m-2">{promo.rating ? promo.rating : "-"} ⭐</p></td>
                            <td><p className="m-2 align-items-center">{promo.username}</p></td>
                            <td><p className="m-2">{promo.title}</p></td>
                            <td><p className="m-2">{promo.description}</p></td>
                            <td><button className="btn btn-outline-danger m-1 md-force-align" onClick={() => { setDeleteCodeModal(true); setReviewToDelete(promo.id) }}><i className="material-icons md-24">delete</i></button></td>
                        </tr>
                    }
                </>
            ) : null
            setPostDataPromos(newPostDataPromos);
            setReviewsReady(true);
        }).catch(error => {
            console.log(error);
            toast.error('Error !', { position: 'top-center' });
        })
    }

    const handlePageClick = async (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limit;
        // console.log(newOffset)
        await setOffset(selectedPage * limit)
    };

    const deleteReview = (e) => {
        axios
            .delete(process.env.REACT_APP_API_LINK + '/api/review/' + reviewToDelete)
            .then(async e => {
                toast.success('Review correctly deleted!', { position: "top-center" });
                setReviewToDelete(null)
                setDeleteCodeModal(false)
                setReviewsReady(false)
            })
            .catch(err => {
                toast.error('Error, the review can\'t be deleted !', { position: 'top-center' });
            })
    }

    return (
        <>
            <div className="row justify-content-end mb-2">
                <Modal show={deleteCodeModal} onHide={() => setDeleteCodeModal(false)}>
                    <Modal.Header closeButton>Careful ! Are you sure to want delete this review ?</Modal.Header>
                    <Modal.Body>
                        <Button color="warning" className="mt-4" onClick={() => setDeleteCodeModal(false)} block>No, go back</Button>
                        <Button color="danger" className="mt-4" onClick={() => { deleteReview() }} block>Yes, delete</Button>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="row border  bg-light  p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="m-2"> Rating </p></th>
                            <th><p className="m-2 align-items-center"> Username </p></th>
                            <th><p className="m-2"> Title </p></th>
                            <th><p className="m-2"> Description </p></th>
                        </tr>
                    </thead>
                    <tbody>{postDataPromos}</tbody>
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    {pageCount > 0 &&
                        <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={2}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />
                    }
                </div>
            </div>
        </>
    )
}

export default Reviews;
