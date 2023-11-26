
import style from './DocumentsList.module.css'
import Search from '../../assets/images/employees/Search.svg'
import add from '../../assets/images/employees/Application Add.svg'
import { useEffect, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2'
import { MdPending } from 'react-icons/md'
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { updateTabData } from '../../redux/slices/tabSlice';
import { changeId } from '../../redux/slices/idToProcessSlice';
import { setLoading } from '../../redux/slices/loading';

function DocumentsList() {

    const [documentsList, setDocumentsList] = useState(null);
    const [showBox, setShowBox] = useState(false);
    const [send, setSend] = useState(false);
    const [dataToShow, setDataToShow] = useState(null);
    const [approve, setApprove] = useState(false);
    const [idForAction, setIdForAction] = useState(null);
    const [reason, setReason] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(8);
    const [reject, setReject] = useState(false);
    const [disApprove, setDisApprove] = useState(false);
    const [review, setReview] = useState(false);
    const [allDataArr, setAllDataArr] = useState(null);

    const userToken = Cookies.get('userToken');
    const tabData = useSelector(state => state.tab);
    const dispatch = useDispatch();

    const refreshData = () => {
        dispatch(setLoading(true))
        axios.get("/get-documents", { headers: { Authorization: `Bearer ${userToken}` } }).then((response) => {
            setAllDataArr(response.data.data)
            setDocumentsList(response.data.data.slice(startIndex, endIndex));
            dispatch(setLoading(false))
        }).catch(err => {
            dispatch(setLoading(false));
            Swal.fire({
                icon: 'error',
                title: 'OOps..',
                text: 'Something went wrong, Try Again!'
            })
        })
    }


    useEffect(() => {
        dispatch(setLoading(true))
        axios.get("/get-documents", { headers: { Authorization: `Bearer ${userToken}` } }).then((response) => {
            setAllDataArr(response.data.data)
            setDocumentsList(response.data.data.slice(startIndex, endIndex));
            dispatch(setLoading(false))
        }).catch(err => {
            dispatch(setLoading(false));
            Swal.fire({
                icon: 'error',
                title: 'OOps..',
                text: 'Something went wrong, Try Again!'
            })
        })
    }, [])


    const nextPage = () => {
        setStartIndex(startIndex + 8);
        setEndIndex(endIndex + 8);

    }

    const backPage = () => {
        setStartIndex(startIndex - 8);
        setEndIndex(endIndex - 8);


    }

    useEffect(() => {

        setDocumentsList(allDataArr?.slice(startIndex, endIndex))
    }, [startIndex, endIndex])


    const search = (event) => {
        if (event.target.value !== "") {
            console.log(event.target.value);

            const searchedList = allDataArr.filter((obj) =>

                obj.DocumentId.includes(event.target.value) || obj.DocumentTitle.includes(event.target.value)
            )
            console.log(searchedList);
            setDocumentsList(searchedList);
        } else {
            setDocumentsList(allDataArr?.slice(startIndex, endIndex))
        }
    }



    return (
        <>

            <div className={style.subparent}>

                <div className={style.searchbar}>
                    <div className={style.sec1}>
                        <img src={Search} alt="" />
                        <input onChange={search} type="text" placeholder='Search Document by name' />
                    </div>
                    {tabData?.Creation && (

                        <div className={style.sec2} onClick={() => {
                            dispatch(updateTabData({ ...tabData, Tab: 'createDocument' }))
                        }}>
                            <img src={add} alt="" />
                            <p>Create document</p>
                        </div>
                    )}
                </div>
                <div className={style.tableParent}>
                    {!documentsList || documentsList?.length === 0 ? (
                        <div className='w-100 d-flex align-items-center justify-content-center'>
                            <p className='text-center'>No any Records Available here.</p>
                        </div>
                    ) : (

                        <table className={style.table}>
                            <tr className={style.headers}>
                                <td>Document ID</td>
                                <td>Document Title</td>
                                <td>Revision No.</td>
                                <td>Document Type</td>
                                <td>Department</td>
                                <td>Creation Date</td>
                                <td>Created By</td>
                                <td>Status</td>
                                <td>Reviewed By</td>
                                <td>Review Date</td>
                                <td>Approved By</td>
                                <td>Approval Date</td>
                                <td>Action</td>
                                <td>Action</td>
                                <td>Document</td>
                                <td>Reason</td>
                                {tabData?.Approval && (
                                    <td></td>
                                )}
                                {tabData?.Review && (
                                    <td></td>
                                )}
                            </tr>
                            {
                                documentsList?.map((document, i) => {
                                    return (
                                        <tr className={style.tablebody} key={i}>
                                            <td ><p style={{
                                                backgroundColor: "#f0f5f0",
                                                padding: "2px 5px",
                                                borderRadius: "10px",
                                                fontFamily: "Inter",
                                                fontSize: "12px",
                                                fontStyle: "normal",
                                                fontWeight: "400",
                                                lineHeight: "20px",
                                            }}>{document.DocumentId}</p></td>
                                            <td className={style.simpleContent}>{document.DocumentTitle}</td>
                                            <td>{document.RevisionNo}</td>
                                            <td>{document.DocumentType}</td>
                                            <td>{document.Department.DepartmentName}</td>
                                            <td>{document.CreationDate?.slice(0, 10).split('-')[2]}/{document.CreationDate?.slice(0, 10).split('-')[1]}/{document.CreationDate?.slice(0, 10).split('-')[0]}</td>
                                            <td>{document.CreatedBy}</td>
                                            <td><div className={`text-center ${document.Status === 'Approved' && style.greenStatus} ${document.Status === 'Disapproved' && style.redStatus} ${document.Status === 'Rejected' && style.redStatus} ${document.Status === 'Pending' && style.yellowStatus} ${document.Status === 'Reviewed' && style.blueStatus} `}><p>{document.Status}</p></div></td>
                                            <td>{document.ReviewedBy || '--'}</td>
                                            {document.ReviewDate ? (

                                                <td>{document.ReviewDate?.slice(0, 10).split('-')[2]}/{document.ReviewDate?.slice(0, 10).split('-')[1]}/{document.ReviewDate?.slice(0, 10).split('-')[0]}</td>
                                            ) : (
                                                <td>- - -</td>
                                            )}
                                            <td>{document.ApprovedBy || '--'}</td>
                                            {document.ApprovalDate ? (

                                                <td>{document.ApprovalDate?.slice(0, 10).split('-')[2]}/{document.ApprovalDate?.slice(0, 10).split('-')[1]}/{document.ApprovalDate?.slice(0, 10).split('-')[0]}</td>
                                            ) : (
                                                <td>---</td>
                                            )}

                                            <td >

                                                <p onClick={() => {

                                                    setSend(true);
                                                }} className={style.click}>Send</p>
                                            </td>
                                            <td >
                                                {tabData?.Edit && (

                                                    <p onClick={() => {
                                                        dispatch(updateTabData({ ...tabData, Tab: 'editDocument' }))
                                                        dispatch(changeId(document._id))
                                                    }} style={{
                                                        height: '28px'

                                                    }} className={`btn btn-outline-primary pt-0`}>Edit</p>
                                                )}
                                                <p onClick={() => {
                                                    dispatch(updateTabData({ ...tabData, Tab: 'viewDocument' }));
                                                    dispatch(changeId(document._id))
                                                }} style={{
                                                    height: '28px'
                                                }} className={`btn btn-outline-danger pt-0`}>View</p>
                                            </td>
                                            <td >

                                                <p onClick={() => {
                                                    setDataToShow('Pending feature')
                                                    setShowBox(true);

                                                }} className={style.click}>Download</p>
                                            </td>
                                            <td >

                                                <p onClick={() => {
                                                    if (document.Status === 'Disapproved' || document.Status === 'Rejected') {
                                                        setDataToShow(document.Reason)
                                                    } else {
                                                        setDataToShow('Process is nor DisApproved neither Rejected.')
                                                    }
                                                    setShowBox(true);

                                                }} className={style.redclick}>View</p>
                                            </td>
                                            {tabData?.Approval && (

                                                <td>

                                                    <p onClick={() => {
                                                        if (document.Status === 'Approved' || document.Status === 'Rejected') {
                                                            setDataToShow('Document is already Approved or Rejected!');
                                                            setShowBox(true)
                                                        } else {

                                                            setApprove(true);
                                                            setIdForAction(document._id)
                                                        }
                                                    }} style={{
                                                        height: '28px'
                                                    }} className={`btn btn-outline-primary pt-0 px-1`}>Approve</p>
                                                    <p onClick={() => {
                                                        if (document.Status === 'Approved' || document.Status === 'Disapproved' || document.Status === 'Rejected') {
                                                            setDataToShow(`Document is already ${document.Status}!`);
                                                            setShowBox(true);
                                                        } else {

                                                            setDisApprove(true);
                                                            setIdForAction(document._id);
                                                        }

                                                    }} style={{
                                                        height: '28px'
                                                    }} className={`btn btn-outline-danger pt-0 px-1`}>Disaprrove</p>
                                                </td>
                                            )}
                                            {tabData?.Review && (

                                                <td className='ms-4' >

                                                    <p onClick={() => {
                                                        if (document.Status === 'Reviewed') {
                                                            setDataToShow('Document is already Reviewed!');
                                                            setShowBox(true);
                                                        } else {

                                                            setReview(true);
                                                            setIdForAction(document._id)
                                                        }
                                                    }} style={{
                                                        height: '28px'
                                                    }} className={`btn btn-outline-danger pt-0 px-1`}>Review</p>
                                                    <p onClick={() => {
                                                        if (document.Status === 'Rejected' || document.Status === 'Reviewed') {
                                                            setDataToShow('Document is already Rejected or Reviewed');
                                                            setShowBox(true);
                                                        } else {
                                                            setReject(true);
                                                            setIdForAction(document._id)
                                                        }
                                                    }} style={{
                                                        height: '28px'
                                                    }} className={`btn btn-outline-primary pt-0 px-1`}>Reject</p>
                                                </td>
                                            )}
                                        </tr>

                                    )

                                })
                            }
                        </table>
                    )}
                </div>
                <div className={style.Btns}>
                    {startIndex > 0 && (

                        <button onClick={backPage}>
                            {'<< '}Back
                        </button>
                    )}
                    {allDataArr?.length > endIndex && (

                        <button onClick={nextPage}>
                            next{'>> '}
                        </button>
                    )}
                </div>
            </div>

            {
                showBox && (

                    <div class={style.alertparent}>
                        <div class={style.alert}>

                            <p class={style.msg}>{dataToShow}</p>

                            <div className={style.alertbtns}>

                                <button onClick={() => {
                                    setShowBox(false);

                                }} className={style.btn2}>OK</button>

                            </div>
                        </div>
                    </div>
                )
            }
            {
                approve ?
                    <div class={style.alertparent}>
                        <div class={style.alert}>
                            <p class={style.msg}>Do you want to Approve this Document?</p>
                            <div className={style.alertbtns}>
                                <button onClick={() => {
                                    dispatch(setLoading(true))
                                    axios.patch('/approve-document', { id: idForAction }, { headers: { Authorization: `Bearer ${userToken}` } }).then(() => {
                                        dispatch(setLoading(false))
                                        refreshData();
                                        Swal.fire({
                                            title: 'Success',
                                            text: 'Submitted Successfully',
                                            icon: 'success',
                                            confirmButtonText: 'Go!',
                                        });
                                        setApprove(false);
                                    }).catch(err => {
                                        dispatch(setLoading(false));
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'OOps..',
                                            text: 'Something went wrong, Try Again!'
                                        })
                                    })

                                    setApprove(false)

                                }
                                } className={style.btn1}>Approve</button>


                                <button onClick={() => {
                                    setApprove(false);
                                }} className={style.btn2}>Cancel</button>

                            </div>
                        </div>
                    </div> : null
            }
            {
                review ?
                    <div class={style.alertparent}>
                        <div class={style.alert}>
                            <p class={style.msg}>Do you want to Review this Document?</p>
                            <div className={style.alertbtns}>
                                <button onClick={() => {
                                    setReview(false);
                                    dispatch(setLoading(true))
                                    axios.patch('/review-document', { documentId: idForAction }, { headers: { Authorization: `Bearer ${userToken}` } }).then(() => {
                                        dispatch(setLoading(false))
                                        refreshData();
                                        Swal.fire({
                                            title: 'Success',
                                            text: 'Submitted Successfully',
                                            icon: 'success',
                                            confirmButtonText: 'Go!',
                                        });
                                    }).catch(err => {
                                        dispatch(setLoading(false));
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'OOps..',
                                            text: 'Something went wrong, Try Again!'
                                        })
                                    })
                                    setReview(false)


                                }
                                } className={style.btn1}>Review</button>


                                <button onClick={() => {
                                    setReview(false);
                                }} className={style.btn2}>Cancel</button>

                            </div>
                        </div>
                    </div> : null
            }

            {
                disApprove && (
                    <div class={style.alertparent}>
                        <div class={`${style.alert2} `}>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setDisApprove(false);
                                dispatch(setLoading(true))
                                axios.patch('/disapprove-document', { documentId: idForAction, reason: reason }, { headers: { Authorization: `Bearer ${userToken}` } }).then(() => {
                                    dispatch(setLoading(false))
                                    Swal.fire({
                                        title: 'Success',
                                        text: 'DisApproved Successfully',
                                        icon: 'success',
                                        confirmButtonText: 'Go!',
                                    })
                                    refreshData();
                                }).catch(err => {
                                    dispatch(setLoading(false));
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'OOps..',
                                        text: 'Something went wrong, Try Again!'
                                    })
                                })
                            }}>
                                <textarea onChange={(e) => {
                                    setReason(e.target.value);
                                }} name="Reason" id="" cols="30" rows="10" placeholder='Comment here' required />


                                <div className={`$ mt-3 d-flex justify-content-end `}>
                                    <button type='submit' className='btn btn-danger px-3 py-2 m-3'>Disapprove</button>
                                    <a onClick={() => {
                                        setDisApprove(false);
                                    }} className="btn btn-outline-danger  px-3 py-2 m-3">Close</a>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {
                reject && (
                    <div class={style.alertparent}>
                        <div class={`${style.alert2} `}>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setReject(false);
                                dispatch(setLoading(true))
                                axios.patch('/reject-document', { documentId: idForAction, reason: reason }, { headers: { Authorization: `Bearer ${userToken}` } }).then(() => {
                                    dispatch(setLoading(false))
                                    Swal.fire({
                                        title: 'Success',
                                        text: 'Rejected Successfully',
                                        icon: 'success',
                                        confirmButtonText: 'Go!',
                                    })


                                    refreshData();
                                }).catch(err => {
                                    dispatch(setLoading(false));
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'OOps..',
                                        text: 'Something went wrong, Try Again!'
                                    })
                                })
                            }}>
                                <textarea onChange={(e) => {
                                    setReason(e.target.value);
                                }} name="Reason" id="" cols="30" rows="10" placeholder='Comment here' required />


                                <div className={`$ mt-3 d-flex justify-content-end `}>
                                    <button type='submit' className='btn btn-danger px-3 py-2 m-3'>Reject</button>
                                    <a onClick={() => {
                                        setReject(false);
                                    }} className="btn btn-outline-danger  px-3 py-2 m-3">Close</a>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {
                send && (
                    <div class={style.alertparent}>
                        <div class={`${style.alert} p-3 pt-5`}>
                            <form onSubmit={(e) => {

                            }}>
                                <div className='mx-4 my-4 d-inline'>

                                    <input type='checkbox' className='mx-3 my-2 p-2' /><span>Department 1</span>
                                </div>
                                <div className='mx-4 my-4 d-inline'>

                                    <input type='checkbox' className='mx-3 my-2 p-2' /><span>Department 2</span>
                                </div>
                                <div className='mx-4 my-4 d-inline'>

                                    <input type='checkbox' className='mx-3 my-2 p-2' /><span>Department 3</span>
                                </div>
                                <div className='mx-4 my-4 d-inline'>

                                    <input type='checkbox' className='mx-3 my-2 p-2' /><span>Department 4</span>
                                </div>


                                <div className={`$ mt-3 d-flex justify-content-end `}>
                                    <button type='submit' className='btn btn-danger px-3 py-2 m-3'>Send</button>
                                    <button onClick={() => {
                                        setSend(false);
                                    }} className="btn btn-outline-danger  px-3 py-2 m-3">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }


        </>
    )
}

export default DocumentsList
